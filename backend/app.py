from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Import Blueprints
from routes.weather_routes import weather_bp  
from routes.recommendations_routes import recommendations_bp
from routes.menu_routes import menu_bp

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()

# Register Blueprints
app.register_blueprint(weather_bp, url_prefix='/api/weather')
app.register_blueprint(recommendations_bp, url_prefix='/api/recommendations')
app.register_blueprint(menu_bp, url_prefix='/api/menu')

@app.route('/')
def home():
    return jsonify({"message": "Flask Server is Running!"})

if __name__ == '__main__':
    app.run(debug=True)
