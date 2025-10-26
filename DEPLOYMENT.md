# SyncHUB Deployment Guide

## Backend Deployment (Render)

### 1. Environment Variables for Render
Set these in your Render service settings:

```bash
# Required
DATABASE_URL=your-supabase-postgresql-url
JWT_SECRET=your-jwt-secret-key

# Optional MinIO (if you deploy MinIO separately)
MINIO_ENDPOINT=your-minio-service.onrender.com
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET=synchub-files
MINIO_SECURE=true

# Frontend URL
FRONTEND_URL=https://your-frontend.vercel.app
```

### 2. Deploy MinIO on Render (Optional)
1. Create new Web Service on Render
2. Use Docker image: `minio/minio`
3. Set start command: `minio server /data --console-address ":9001"`
4. Set environment variables:
   - `MINIO_ROOT_USER=your-access-key`
   - `MINIO_ROOT_PASSWORD=your-secret-key`

### 3. Backend Service Settings
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`
- **Environment**: Python 3.11

## Frontend Deployment (Vercel)

### 1. Environment Variables for Vercel
```bash
VITE_API_URL=https://your-backend.onrender.com
```

### 2. Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
# Copy .env.example to .env and configure
python app.py
```

### Frontend
```bash
cd frontend
npm install
# Copy .env.example to .env and configure
npm run dev
```

## Notes
- The app works without MinIO (uses fallback responses)
- MinIO is optional for deployment
- All endpoints handle MinIO unavailability gracefully
- Frontend automatically uses environment-based API URL