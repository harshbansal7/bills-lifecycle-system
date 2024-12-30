from os import environ
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = environ.get('MONGO_URI', 'mongodb://localhost:27017/bills_management')
    PORT = int(environ.get('PORT', 8000))
    FRONTEND_URL = environ.get('FRONTEND_URL', 'http://localhost:5173') 