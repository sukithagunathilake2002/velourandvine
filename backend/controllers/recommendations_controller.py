from flask import jsonify
from utils.weather import get_weather  # Ensure this function fetches real weather data

HOT_THRESHOLD = 20  # If temp >= 20°C, recommend cold dishes

def get_recommendations(city):
    # Fetch the weather data
    weather_data = get_weather(city)

    # Debugging log
    print(f"Weather data for {city}: {weather_data}")

    if weather_data is None or "error" in weather_data:
        print("Error fetching weather data")
        return jsonify({"error": "Unable to fetch weather data"}), 500

    # Extract temperature and condition
    temp = weather_data.get("temperature", 20)
    condition = weather_data.get("condition", "Unknown")

    # Debugging log
    print(f"Extracted temperature: {temp}°C, Condition: {condition}")

    # Initialize recommendations
    recommendations = {
        "hot_dishes": [],
        "cold_dishes": []
    }

    if temp >= HOT_THRESHOLD:
        print("It's hot! Recommending cold dishes.")
        recommendations["cold_dishes"] = [
            "Vineyard Caesar",
            "Velour Salad",
            "Smoked Salmon Tartare",
            "Tiramisu à la Vine"
        ]
    else:
        print("It's cold! Recommending hot dishes.")
        recommendations["hot_dishes"] = [
            "Pan-Seared Duck Breast",
            "Velour Soup of the Day",
            "Filet Mignon au Vin",
            "Velour Chocolate Lava Cake"
        ]

    # Debugging log to confirm recommendations exist
    print(f"Final recommendations for {city}: {recommendations}")

    # Ensure structured JSON response
    return jsonify({
        "city": city,
        "temperature": temp,
        "condition": condition,
        "recommendations": recommendations  # ✅ Ensure this key exists
    })
