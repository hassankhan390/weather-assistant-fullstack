from fastapi import FastAPI, HTTPException, Depends, Response
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import date
import models, schemas, io, csv, json
from database import SessionLocal, engine
from services.weather_service import fetch_weather, smart_insight

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="PM Accelerator Smart Weather Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/weather", response_model=schemas.WeatherRecordResponse)
def create_weather(record: schemas.WeatherRecordCreate, db: Session = Depends(get_db)):
    weather_data, error = fetch_weather(record.location_input, record.start_date, record.end_date)
    if error:
        raise HTTPException(status_code=400, detail=f"Weather Error: {error}")
    
    db_record = models.WeatherRecord(
        location_input=record.location_input,
        latitude=weather_data.get('latitude', 0),
        longitude=weather_data.get('longitude', 0),
        temp=weather_data['temp'],
        condition=weather_data['condition'],
        date_requested=date.today(),
        start_date=record.start_date,
        end_date=record.end_date,
        notes="" 
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@app.get("/records", response_model=list[schemas.WeatherRecordResponse])
def get_records(db: Session = Depends(get_db)):
    return db.query(models.WeatherRecord).order_by(models.WeatherRecord.id.desc()).all()

@app.put("/records/{record_id}", response_model=schemas.WeatherRecordResponse)
def update_record(record_id: int, update: schemas.WeatherRecordUpdate, db: Session = Depends(get_db)):
    db_record = db.query(models.WeatherRecord).filter(models.WeatherRecord.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Record not found")
    
    update_data = update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_record, key, value)
        
    db.commit()
    db.refresh(db_record)
    return db_record

@app.get("/export")
def export_records(format: str = "csv", db: Session = Depends(get_db)):
    records = db.query(models.WeatherRecord).all()
    
    if format == "json":
        data = [schemas.WeatherRecordResponse.from_orm(r).dict() for r in records]
        return data

    if format == "markdown":
        md = "# History\n\n| ID | Location | Temp | Date |\n|---|---|---|---|\n"
        for r in records:
            md += f"| {r.id} | {r.location_input} | {r.temp}° | {r.date_requested} |\n"
        return Response(content=md, media_type="text/markdown", headers={"Content-Disposition": "attachment; filename=history.md"})

    # Default CSV
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Location", "Temp", "Condition", "Notes"])
    for r in records:
        writer.writerow([r.location_input, r.temp, r.condition, r.notes])
    output.seek(0)
    return StreamingResponse(iter([output.getvalue()]), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=history.csv"})

@app.get("/insight/{record_id}")
def get_insight(record_id: int, db: Session = Depends(get_db)):
    db_record = db.query(models.WeatherRecord).filter(models.WeatherRecord.id == record_id).first()
    if not db_record: raise HTTPException(status_code=404, detail="Not found")
    return {"insights": smart_insight({"temp": db_record.temp, "condition": db_record.condition})}

@app.delete("/records/{record_id}")
def delete_record(record_id: int, db: Session = Depends(get_db)):
    db_record = db.query(models.WeatherRecord).filter(models.WeatherRecord.id == record_id).first()
    db.delete(db_record)
    db.commit()
    return {"detail": "Deleted"}