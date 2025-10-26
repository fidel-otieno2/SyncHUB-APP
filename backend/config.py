import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DATABASE_URL = os.getenv('DATABASE_URL')
    
    # Handle PostgreSQL URL conversion and connection issues
    if DATABASE_URL and 'postgresql' in DATABASE_URL:
        # Use psycopg3 driver for Python 3.13 compatibility
        if 'postgresql+psycopg2' in DATABASE_URL:
            DATABASE_URL = DATABASE_URL.replace('postgresql+psycopg2', 'postgresql+psycopg')
        elif 'postgresql://' in DATABASE_URL and 'postgresql+psycopg' not in DATABASE_URL:
            DATABASE_URL = DATABASE_URL.replace('postgresql://', 'postgresql+psycopg://')
        # Add SSL requirement for Supabase
        if 'supabase.com' in DATABASE_URL and 'sslmode' not in DATABASE_URL:
            DATABASE_URL += '?sslmode=require'
    
    SQLALCHEMY_DATABASE_URI = DATABASE_URL or 'postgresql://postgres:password@localhost:5432/synchub'
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
    
    # MinIO Configuration
    MINIO_ENDPOINT = os.getenv('MINIO_ENDPOINT', 'localhost:9000')
    MINIO_ACCESS_KEY = os.getenv('MINIO_ACCESS_KEY', 'minioadmin')
    MINIO_SECRET_KEY = os.getenv('MINIO_SECRET_KEY', 'minioadmin')
    MINIO_BUCKET = os.getenv('MINIO_BUCKET', 'synchub-files')
    MINIO_SECURE = os.getenv('MINIO_SECURE', 'False').lower() == 'true'
    
    # Frontend URL
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')