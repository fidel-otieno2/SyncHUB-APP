# 🚀 SyncHUB Deployment Guide

## Backend Deployment (Render)

1. **Create Render Account**: Sign up at render.com
2. **Connect GitHub**: Link your repository
3. **Create Web Service**:
   - Runtime: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`

4. **Environment Variables**:
   ```
   DATABASE_URL=your_supabase_url
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   FRONTEND_URL=https://your-app.vercel.app
   ```

## Frontend Deployment (Vercel)

1. **Create Vercel Account**: Sign up at vercel.com
2. **Import Project**: Connect GitHub repository
3. **Configure Build**:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

## Database Setup (Supabase)

1. **Create Supabase Project**
2. **Get Connection String**
3. **Run Migrations** (if needed)

## File Storage (Cloudinary)

1. **Create Cloudinary Account**
2. **Get API Credentials**
3. **Configure Environment Variables**

## ✅ Features Now Cloud-Ready

- ✅ File upload to Cloudinary
- ✅ Database storage in Supabase
- ✅ No local dependencies
- ✅ Auto-scaling backend
- ✅ Global CDN for files
- ✅ Always-available service

## 🔧 Changes Made

- Replaced MinIO with Cloudinary
- Removed ngrok dependency
- Added Gunicorn for production
- Created deployment configs
- Updated environment variables