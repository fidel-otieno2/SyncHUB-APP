#!/bin/bash

echo "🚀 Starting SyncHUB - Fully Functional Setup"

# Kill existing processes
pkill -f "minio server" 2>/dev/null
pkill -f "python.*app.py" 2>/dev/null
pkill -f "npm.*dev" 2>/dev/null
pkill -f "ngrok" 2>/dev/null

sleep 2

# Start MinIO
echo "📦 Starting MinIO..."
cd /home/moringa/Documents/Final_Project/SyncHUB-APP/synchub/backend
nohup minio server data --address ":9000" --console-address ":9001" > minio.log 2>&1 &

sleep 3

# Start Backend
echo "🔧 Starting Backend..."
nohup python3 app.py > backend.log 2>&1 &

sleep 3

# Start Frontend
echo "🎨 Starting Frontend..."
cd /home/moringa/Documents/Final_Project/SyncHUB-APP/synchub/frontend
nohup npm run dev > frontend.log 2>&1 &

sleep 5

# Start ngrok
echo "🌐 Starting ngrok..."
nohup ngrok http 5000 > ngrok.log 2>&1 &

sleep 3

echo "✅ SyncHUB Fully Functional!"
echo "📦 MinIO Console: http://localhost:9001"
echo "🔧 Backend API: http://localhost:5000"
echo "🎨 Frontend App: http://localhost:5173"
echo "🌐 Public Backend: Check ngrok.log for URL"

# Show services status
echo ""
echo "📊 Services Status:"
ps aux | grep -E "(minio|python.*app.py|npm.*dev|ngrok)" | grep -v grep