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
        
        if is_production:
            # Use pg8000 for deployment (Python 3.13 compatible)
            # Remove any SSL parameters that pg8000 doesn't support
            DATABASE_URL = DATABASE_URL.split('?')[0]  # Remove query parameters
            if 'postgresql://' in DATABASE_URL and 'postgresql+pg8000' not in DATABASE_URL:
                DATABASE_URL = DATABASE_URL.replace('postgresql://', 'postgresql+pg8000://')
            elif 'postgresql+psycopg2://' in DATABASE_URL:
                DATABASE_URL = DATABASE_URL.replace('postgresql+psycopg2://', 'postgresql+pg8000://')
        else:
            # Use psycopg2 for local development
            if 'postgresql://' in DATABASE_URL and 'postgresql+psycopg2' not in DATABASE_URL:
                DATABASE_URL = DATABASE_URL.replace('postgresql://', 'postgresql+psycopg2://')
            elif 'postgresql+pg8000://' in DATABASE_URL:
                DATABASE_URL = DATABASE_URL.replace('postgresql+pg8000://', 'postgresql+psycopg2://')
            # Add SSL requirement for Supabase (only for psycopg2)
            if 'supabase.com' in DATABASE_URL and 'sslmode' not in DATABASE_URL:
                DATABASE_URL += '?sslmode=require'
    
    # Use SQLite for deployment if PostgreSQL fails
    if DATABASE_URL and 'postgresql' in DATABASE_URL:
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        SQLALCHEMY_DATABASE_URI = 'sqlite:///synchub.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Configure engine options based on driver
    if DATABASE_URL and 'pg8000' in DATABASE_URL:
        # pg8000 specific configuration for Supabase
        import ssl
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        SQLALCHEMY_ENGINE_OPTIONS = {
            'pool_pre_ping': True,
            'pool_recycle': 300,
            'pool_timeout': 30,
            'max_overflow': 10,
            'connect_args': {
                'ssl_context': ssl_context
            }
        }
    else:
        # psycopg2 configuration
        SQLALCHEMY_ENGINE_OPTIONS = {
            'pool_pre_ping': True,
            'pool_recycle': 300,
            'pool_timeout': 30,
            'max_overflow': 10
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