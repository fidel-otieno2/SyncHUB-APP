import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DATABASE_URL = os.getenv('DATABASE_URL')
    
    # Handle PostgreSQL URL conversion and connection issues
    if DATABASE_URL and 'postgresql' in DATABASE_URL:
        # Ensure psycopg2 format
        if 'postgresql://' in DATABASE_URL and 'postgresql+psycopg2' not in DATABASE_URL:
            DATABASE_URL = DATABASE_URL.replace('postgresql://', 'postgresql+psycopg2://')
        # Add SSL requirement for Supabase
        if 'supabase.com' in DATABASE_URL and 'sslmode' not in DATABASE_URL:
            DATABASE_URL += '?sslmode=require'
    
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
        'pool_timeout': 30,
        'max_overflow': 10,
        'connect_args': {
            'connect_timeout': 30,
            'sslmode': 'require'
        }
    }
    JWT_SECRET_KEY = os.getenv('JWT_SECRET', 'your-secret-key')
    
    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
    CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET = os.getenv('CLOUDINARY_API_SECRET')
    
    # Frontend URL
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')