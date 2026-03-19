import requests
from datetime import datetime

# It's better to keep this in a separate utils.py, 
# but I've included a fixed version here for completeness.
def geocode_location(location):
    # 1. If it's already coordinates (like in your screenshot), split them
    if "," in location:
        try:
            parts = location.split(",")
            return float(parts[0]), float(parts[1])
        except (ValueError, IndexError):
            pass

    # 2. For city names, we MUST use a User-Agent header
    GEOCODE_API = "https://nominatim.openstreetmap.org/search"
    headers = {
        "User-Agent": "WeatherAppProject/1.0 (contact: yourname@email.com)" 
    }
    params = {
        "q": location,
        "format": "json",
        "limit": 1
    }
    
    try:
        # Added headers and a timeout for stability
        response = requests.get(GEOCODE_API, params=params, headers=headers, timeout=5)
        data = response.json()
        
        if response.status_code == 200 and len(data) > 0:
            return float(data[0]['lat']), float(data[0]['lon'])
        else:
            print(f"Geocoding failed for {location}: {response.status_code}")
    except Exception as e:
        print(f"Geocoding exception: {e}")
        
    return None, None

OPENWEATHER_API_KEY = "YOUR API KEY"

def fetch_weather(location, start_date, end_date):
    # Use the local geocode fix or the one from your utils
    lat, lon = geocode_location(location)
    
    if lat is None or lon is None:
        return None, f"Could not find coordinates for: {location}"

    url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=metric&appid={OPENWEATHER_API_KEY}"
    
    try:
        response = requests.get(url, timeout=10)
        # Detailed error if API fails
        if response.status_code != 200:
            error_data = response.json()
            message = error_data.get("message", "Unknown error")
            return None, f"OpenWeather Error ({response.status_code}): {message}"

        data = response.json()
        
        # Verify the list isn't empty
        if not data.get('list'):
            return None, "No forecast data returned from API"

        # Simple aggregation: take first item for current/start date
        record = {
            "latitude": lat,
            "longitude": lon,
            "temp": data['list'][0]['main']['temp'],
            "condition": data['list'][0]['weather'][0]['description'],
        }
        return record, None

    except requests.exceptions.RequestException as e:
        return None, f"Network error: {str(e)}"

def smart_insight(weather_record):
    # Ensure weather_record is a dict or object with temp/condition
    # Using .get() for safety
    temp = weather_record.get('temp', 20)
    condition = weather_record.get('condition', "").lower()
    
    insights = []
    if temp > 30:
        insights.append("High temperature—pack light clothing & sunscreen.")
    if "rain" in condition or "drizzle" in condition:
        insights.append("Potential rain—carry an umbrella or plan indoor activities.")
    if temp < 10:
        insights.append("Cold weather—wear warm layers.")
    if "clear" in condition and temp > 15:
        insights.append("Clear skies—great day for outdoor activities!")
        
    return insights if insights else ["Weather looks moderate—enjoy your day!"]
