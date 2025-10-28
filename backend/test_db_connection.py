from dotenv import load_dotenv
import os
load_dotenv()

from config import Config
from sqlalchemy import create_engine

print("Testing database connection...")
print(f"DATABASE_URL: {Config.SQLALCHEMY_DATABASE_URI}")

try:
    engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
    conn = engine.connect()
    print("✅ Connection successful!")
    conn.close()
except Exception as e:
    print(f"❌ Connection failed: {e}")
