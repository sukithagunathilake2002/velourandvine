import requests
import os
from dotenv import load_dotenv

load_dotenv()

def get_weather(city=None, lat=None, lon=None):
    api_key = os.getenv("WEATHER_API_KEY")
    if not api_key:
        return {"error": "Missing API key"}

    if lat and lon:
        # Convert coordinates to city using reverse geocoding
        geocode_url = f"http://api.weatherapi.com/v1/search.json?key={api_key}&q={lat},{lon}"
        try:
            geocode_response = requests.get(geocode_url).json()
            if not geocode_response or "error" in geocode_response:
                return {"error": "Failed to get city from coordinates"}

            city = geocode_response[0]["name"]  # Extract city name
        except Exception as e:
            return {"error": str(e)}

    if not city:
        return {"error": "City is required"}

    # Fetch weather for the determined city
    weather_url = f"http://api.weatherapi.com/v1/current.json?key={api_key}&q={city}"
    
    try:
        response = requests.get(weather_url)
        if response.status_code != 200:
            return {"error": "Weather API request failed"}

        data = response.json()
        return {
            "city": city,
            "temperature": data["current"]["temp_c"],
            "condition": data["current"]["condition"]["text"]
        }
    except Exception as e:
        return {"error": str(e)}
