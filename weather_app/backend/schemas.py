from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class WeatherRecordCreate(BaseModel):
    location_input: str
    start_date: date
    end_date: date

class WeatherRecordUpdate(BaseModel):
    location_input: Optional[str]
    notes: Optional[str]

class WeatherRecordResponse(BaseModel):
    id: int
    location_input: str
    latitude: float
    longitude: float
    temp: float
    condition: str
    date_requested: date
    start_date: date
    end_date: date
    notes: Optional[str]

    class Config:
        orm_mode = True