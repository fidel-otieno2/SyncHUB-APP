import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DATABASE_URL = os.getenv('DATABASE_URL')

    # Handle PostgreSQL URL conversion
    if DATABASE_URL and 'postgresql' in DATABASE_URL:
        # Use pg8000 for deployment, psycopg2 for local development
        import os
        is_production = os.getenv('RENDER') or os.getenv('HEROKU')

        # Use psycopg for both local and production
        if 'postgresql://' in DATABASE_URL and 'postgresql+psycopg' not in DATABASE_URL:
            DATABASE_URL = DATABASE_URL.replace('postgresql://', 'postgresql+psycopg://')
        elif 'postgresql+psycopg2://' in DATABASE_URL:
            DATABASE_URL = DATABASE_URL.replace('postgresql+psycopg2://', 'postgresql+psycopg://')
        elif 'postgresql+pg8000://' in DATABASE_URL:
            DATABASE_URL = DATABASE_URL.replace('postgresql+pg8000://', 'postgresql+psycopg://')

        # SSL is handled automatically by psycopg3 for Supabase

    # Use SQLite for deployment if PostgreSQL fails
    if DATABASE_URL and 'postgresql' in DATABASE_URL:
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        SQLALCHEMY_DATABASE_URI = 'sqlite:///synchub.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
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
