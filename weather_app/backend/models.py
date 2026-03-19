from sqlalchemy import Column, Integer, String, Float, Date, Text
from database import Base

class WeatherRecord(Base):
    __tablename__ = "weather_records"
    id = Column(Integer, primary_key=True, index=True)
    location_input = Column(String, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    temp = Column(Float)
    condition = Column(String)
    date_requested = Column(Date)
    start_date = Column(Date)
    end_date = Column(Date)
    notes = Column(Text, nullable=True)