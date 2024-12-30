from os import environ
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = environ.get('MONGO_URI', 'mongodb://localhost:27017/bills_management') 