from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import date
import models, schemas
from database import SessionLocal, engine
from services.weather_service import fetch_weather, smart_insight
from utils import export_csv
from fastapi.middleware.cors import CORSMiddleware

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
    
    # IMPROVED ERROR LOGGING
    if error:
        print(f"DEBUG: Weather fetch failed for {record.location_input}. Reason: {error}")
        raise HTTPException(status_code=400, detail=f"Weather Error: {error}")
    
    # Check if weather_data actually contains what we need before proceeding
    if not weather_data or 'temp' not in weather_data:
        raise HTTPException(status_code=400, detail="Weather data was incomplete")

    db_record = models.WeatherRecord(
        location_input=record.location_input,
        latitude=weather_data['latitude'],
        longitude=weather_data['longitude'],
        temp=weather_data['temp'],
        condition=weather_data['condition'],
        date_requested=date.today(),
        start_date=record.start_date,
        end_date=record.end_date,
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@app.get("/records", response_model=list[schemas.WeatherRecordResponse])
def get_records(db: Session = Depends(get_db)):
    return db.query(models.WeatherRecord).all()

@app.put("/records/{record_id}", response_model=schemas.WeatherRecordResponse)
def update_record(record_id: int, update: schemas.WeatherRecordUpdate, db: Session = Depends(get_db)):
    db_record = db.query(models.WeatherRecord).filter(models.WeatherRecord.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Record not found")
    for key, value in update.dict(exclude_unset=True).items():
        setattr(db_record, key, value)
    db.commit()
    db.refresh(db_record)
    return db_record

@app.delete("/records/{record_id}")
def delete_record(record_id: int, db: Session = Depends(get_db)):
    db_record = db.query(models.WeatherRecord).filter(models.WeatherRecord.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(db_record)
    db.commit()
    return {"detail": "Record deleted"}

@app.get("/export")
def export_records(db: Session = Depends(get_db)):
    records = db.query(models.WeatherRecord).all()
    export_csv(records)
    return {"detail": "CSV exported successfully"}

@app.get("/insight/{record_id}")
def get_insight(record_id: int, db: Session = Depends(get_db)):
    db_record = db.query(models.WeatherRecord).filter(models.WeatherRecord.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Record not found")
    insights = smart_insight({
        "temp": db_record.temp,
        "condition": db_record.condition
    })
    return {"insights": insights}