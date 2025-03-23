from flask import Blueprint, request, jsonify
from utils.weather import get_weather

weather_bp = Blueprint("weather_bp", __name__)

@weather_bp.route("/get-weather", methods=["GET"])
def get_weather_route():
    city = request.args.get("city")
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    weather_data = get_weather(city=city, lat=lat, lon=lon)
    if "error" in weather_data:
        return jsonify({"error": weather_data["error"]}), 400

    return jsonify(weather_data)
