#!/bin/bash

echo "🚀 Starting SyncHUB Services..."

# Kill existing processes
pkill -f "minio server"
pkill -f "python.*app.py"
pkill -f "npm.*dev"
pkill -f "ngrok"

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

# Start ngrok for backend
echo "🌐 Starting ngrok..."
nohup ngrok http 5000 > ngrok.log 2>&1 &

sleep 3

echo "✅ All services started!"
echo "📦 MinIO: http://localhost:9000 (admin/minioadmin)"
echo "🔧 Backend: http://localhost:5000"
echo "🎨 Frontend: http://localhost:5173"
echo "🌐 ngrok: Check ngrok.log for public URL"

# Show ngrok URL
sleep 2
curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*"' | head -1