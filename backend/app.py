from flask import Flask
from flask_cors import CORS
from routes.employee_routes import employee_bp
from routes.bill_routes import bill_bp
from pymongo import MongoClient
from config import Config
import os

def create_app():
    app = Flask(__name__)
    
    # Configure CORS with environment-specific origins
    allowed_origins = [
        "http://localhost:5173",  # Local development
        os.getenv('FRONTEND_URL', '')  # Production frontend
    ]
    
    CORS(app, resources={
        r"/api/*": {
            "origins": allowed_origins,
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "allow_headers": ["Content-Type"]
        }
    })
    
    # Initialize MongoDB
    client = MongoClient(Config.MONGO_URI)
    app.db = client.bills_management
    
    # Register blueprints with url_prefix
    app.register_blueprint(employee_bp, url_prefix='/api')
    app.register_blueprint(bill_bp, url_prefix='/api')
    
    @app.route('/')
    def home():
        return {"status": "healthy", "message": "API is running"}
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 8000))) 