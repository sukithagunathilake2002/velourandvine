from flask import Blueprint, request, jsonify
from controllers.recommendations_controller import get_recommendations

recommendations_bp = Blueprint("recommendations_bp", __name__)

@recommendations_bp.route("/", methods=["GET"])
def recommendations():
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "City is required"}), 400
    return get_recommendations(city)
