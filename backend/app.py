from flask import Flask
from flask_cors import CORS
from routes.employee_routes import employee_bp
from routes.bill_routes import bill_bp
from pymongo import MongoClient
from config import Config

def create_app():
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173"],
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
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True) 