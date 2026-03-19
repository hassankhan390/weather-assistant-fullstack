import requests
import csv
from datetime import date

def geocode_location(location):
    GEOCODE_API = "https://nominatim.openstreetmap.org/search"
    response = requests.get(GEOCODE_API, params={"q": location, "format": "json"})
    if response.status_code == 200 and len(response.json()) > 0:
        lat = float(response.json()[0]['lat'])
        lon = float(response.json()[0]['lon'])
        return lat, lon
    return None, None

def export_csv(records):
    keys = records[0].__dict__.keys()
    with open("weather_export.csv", "w", newline="") as f:
        dict_writer = csv.DictWriter(f, keys)
        dict_writer.writeheader()
        dict_writer.writerows([r.__dict__ for r in records])