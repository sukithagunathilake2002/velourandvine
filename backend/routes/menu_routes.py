from flask import Blueprint, request, jsonify
from utils.weather import get_weather

menu_bp = Blueprint("menu_bp", __name__)  # ✅ Correct Blueprint Name

MENU_ITEMS = {
    "hot_dishes": [
        {"name": "Pan-Seared Duck Breast", "description": "A succulent duck breast, pan-seared to perfection."},
        {"name": "Velour Soup of the Day", "description": "A rich, comforting soup made with seasonal ingredients."},
        {"name": "Filet Mignon au Vin", "description": "A tender filet mignon, infused with a red wine reduction."},
        {"name": "Velour Chocolate Lava Cake", "description": "Decadent chocolate cake with a warm, gooey center."}
    ],
    "cold_dishes": [
        {"name": "Vineyard Caesar", "description": "Classic Caesar salad with a gourmet twist."},
        {"name": "Velour Salad", "description": "A refreshing mix of greens, nuts, and gourmet cheese."},
        {"name": "Smoked Salmon Tartare", "description": "Fresh smoked salmon, capers, and a hint of lemon."},
        {"name": "Tiramisu à la Vine", "description": "A luxurious Italian dessert with mascarpone and espresso."}
    ]
}

HOT_THRESHOLD = 20  # Threshold for hot/cold recommendations

@menu_bp.route("", methods=["GET"])  # ✅ No slash in the route path
def get_menu():
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "City is required"}), 400

    weather_data = get_weather(city)
    if "error" in weather_data:
        return jsonify({"error": "Unable to fetch weather data"}), 500

    temp = weather_data.get("temperature", 20)
    condition = weather_data.get("condition", "Unknown")

    recommended_menu = MENU_ITEMS["cold_dishes"] if temp >= HOT_THRESHOLD else MENU_ITEMS["hot_dishes"]

    return jsonify({
        "city": city,
        "temperature": temp,
        "condition": condition,
        "menu": recommended_menu
    })
