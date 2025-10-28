#!/usr/bin/env python3
import psycopg
import os
from dotenv import load_dotenv

load_dotenv()

# Test direct connection
url = "postgresql://postgres:CQ9A4%40Axf%3FHw-Z6@db.szfyytdzcgljaesbwkri.supabase.co:5432/postgres"
print(f"Testing connection to: {url.split('@')[1]}")

try:
    conn = psycopg.connect(url)
    print("✅ Direct connection successful!")
    
    # Test a simple query
    with conn.cursor() as cur:
        cur.execute("SELECT version();")
        version = cur.fetchone()
        print(f"PostgreSQL version: {version[0]}")
    
    conn.close()
    print("✅ Database is working!")
    
except Exception as e:
    print(f"❌ Connection failed: {e}")