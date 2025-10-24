# SyncHUB - File Synchronization Platform

![SyncHUB Logo](frontend/public/logo.png)

A modern, full-stack file synchronization and management platform built with React and Flask, enabling seamless file sharing and synchronization across multiple devices.

## 🚀 Project Overview

SyncHUB is a comprehensive file management solution that allows users to upload, organize, sync, and access their files from anywhere. Built with modern web technologies, it provides real-time synchronization, multi-device support, and an intuitive user interface.

## 👥 Development Team

- **FIDEL OTIENO** - Scrum Master & Full-Stack Developer
- **JAYLAN SAAD** - Frontend Developer
- **BENSON BECKHAM** - Backend Developer  
- **BERYL** - UI/UX Designer & Frontend Developer

## 🏗️ Architecture

### Frontend (React)
- **Framework**: React 18.2.0 with Vite
- **Styling**: Tailwind CSS with custom gradients
- **State Management**: React Context API
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **UI Components**: Headless UI, Heroicons

### Backend (Flask)
- **Framework**: Flask 2.3.3
- **Database**: PostgreSQL with Supabase
- **ORM**: SQLAlchemy with Flask-Migrate
- **Authentication**: JWT with Flask-JWT-Extended
- **File Storage**: MinIO Object Storage
- **API Documentation**: Flasgger (Swagger)

### Database & Storage
- **Primary Database**: PostgreSQL (Supabase Cloud)
- **File Storage**: MinIO (Self-hosted Object Storage)
- **Caching**: In-memory device tracking
- **Migrations**: Flask-Migrate with Alembic

### Development Tools
- **Tunneling**: Ngrok (for external access during development)
- **API Testing**: Built-in test suite
- **Process Management**: Custom startup scripts

## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/dash.png)
*Main dashboard showing file overview, sync status, and recent activity*

### File Management
![File Management](screenshots/fl.png)
*File upload, organization, and folder structure*

### Device Synchronization
![Device Sync](screenshots/dev.png)
*Real-time device tracking and sync monitoring*

### Settings Panel
![Settings](screenshots/set.png)
*Comprehensive settings with multi-language support*

## ✨ Features

### Core Functionality
- 🔐 **User Authentication** - Secure registration and login with JWT
- 📁 **File Management** - Upload, download, organize files by type
- 🔄 **Real-time Sync** - Automatic synchronization across devices
- 📱 **Multi-device Support** - Access files from any device
- 🎨 **Modern UI** - Dark theme with gradient designs
- 🌍 **Internationalization** - Multi-language support (EN, ES, FR, DE)

### File Operations
- **Upload**: Drag-and-drop file upload with progress tracking
- **Download**: Direct file download with success notifications
- **Organization**: Automatic categorization (Documents, Images, Videos, Music, Archives)
- **Preview**: In-browser file preview for supported formats
- **Search**: Find files quickly with search functionality
- **Move**: Reorganize files between folders

### Device Management
- **Device Registration**: Automatic device detection and registration
- **Sync Status**: Real-time sync status monitoring
- **Device Tracking**: Track active/inactive devices
- **Cross-platform**: Works on desktop, tablet, and mobile

### User Experience
- **Responsive Design**: Mobile-first responsive interface
- **Dark Theme**: Modern dark UI with purple/cyan gradients
- **Notifications**: Success/error alerts for all operations
- **Settings**: Comprehensive settings panel
- **Dashboard**: Overview of files, sync status, and recent activity

## 🛠️ Technology Stack

### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.15.0",
  "axios": "^1.5.0",
  "tailwindcss": "^3.4.18",
  "@headlessui/react": "^1.7.17",
  "@heroicons/react": "^2.0.18",
  "vite": "^4.4.5"
}
```

### Backend Dependencies
```python
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
Flask-Migrate==4.0.5
Flask-JWT-Extended==4.5.2
Flask-CORS==4.0.0
psycopg2-binary==2.9.7
minio==7.1.17
python-dotenv==1.0.0
bcrypt==4.0.1
```

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- PostgreSQL database (or Supabase account)
- MinIO server (for file storage)

### 1. Clone Repository
```bash
git clone https://github.com/fidel-otieno2/SyncHUB-APP.git
cd SyncHub-APP
```

### 2. Backend Setup
```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Configure environment variables
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secret-key
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# Initialize database
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Start backend server
python app.py
```

### 3. Frontend Setup
```bash
cd frontend

# Install Node dependencies
npm install

# Create environment file
cp .env.example .env

# Configure API URL
VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

### 4. MinIO Setup
```bash
# Download and install MinIO
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio

# Start MinIO server
./minio server ./data --console-address ":9001"
```

### 5. Ngrok Setup (Optional - For External Access)
```bash
# Install ngrok
sudo snap install ngrok

# Authenticate ngrok (get auth token from ngrok.com)
ngrok config add-authtoken YOUR_AUTH_TOKEN

# Expose backend to internet
ngrok http 5000

# Expose frontend to internet (separate terminal)
ngrok http 5173
```

## 🚀 Quick Start

### Using the Startup Script
```bash
# Make script executable
chmod +x start_synchub.sh

# Start all services
./start_synchub.sh
```

### Manual Startup
```bash
# Terminal 1: Start MinIO
minio server data --address ":9000" --console-address ":9001"

# Terminal 2: Start Backend
cd backend && python app.py

# Terminal 3: Start Frontend
cd frontend && npm run dev
```

### Access URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **MinIO Console**: http://localhost:9001
- **Ngrok URLs**: Check terminal output for public URLs (e.g., https://abc123.ngrok.io)

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register - User registration
POST /api/auth/login    - User login
GET  /api/auth/me       - Get current user
```

### File Management Endpoints
```
GET    /api/files              - List all files
POST   /api/files/upload       - Upload file
GET    /api/files/{id}         - Get file details
GET    /api/files/{id}/download - Download file
DELETE /api/files/delete/{id}  - Delete file
POST   /api/files/move/{id}    - Move file to folder
```

### Device Management Endpoints
```
GET  /api/devices          - List devices
POST /api/devices/register - Register device
POST /api/devices/heartbeat - Device heartbeat
```

### Sync Endpoints
```
GET  /api/sync/status  - Get sync status
POST /api/sync/trigger - Trigger manual sync
```

## 🗂️ Project Structure

```
SyncHUB-APP/
├── backend/
│   ├── routes/
│   │   ├── auth.py      # Authentication routes
│   │   ├── files.py     # File management routes
│   │   ├── devices.py   # Device management routes
│   │   └── sync.py      # Sync routes
│   ├── models.py        # Database models
│   ├── config.py        # Configuration
│   ├── app.py          # Flask application
│   └── requirements.txt # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   ├── api/         # API integration
│   │   ├── utils/       # Utility functions
│   │   └── styles/      # CSS styles
│   ├── public/          # Static assets
│   └── package.json     # Node dependencies
├── .gitignore
├── README.md
└── start_synchub.sh     # Startup script
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your-jwt-secret-key
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=synchub-files
CLOUDINARY_CLOUD_NAME=your-cloud-name
SENDGRID_API_KEY=your-sendgrid-key
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest tests/
```

### Frontend Testing
```bash
cd frontend
npm run test
```

### Integration Testing
```bash
# Run comprehensive test suite
./test_all_functionality.sh
```

## 📱 Usage Guide

### 1. User Registration
- Navigate to `/register`
- Fill in name, email, and password
- Click "Register" to create account

### 2. File Upload
- Go to Dashboard or Upload page
- Drag and drop files or click to select
- Choose folder type (Documents, Images, etc.)
- Add title and description
- Click "Upload"

### 3. File Management
- View files in Dashboard or specific folders
- Click "View Details" for file information
- Use download, move, or delete options
- Track sync status in real-time

### 4. Device Sync
- Files automatically sync across registered devices
- Monitor sync activity in Dashboard
- Force sync using "Sync All" button
- Check device status in Devices page

### 5. Settings Configuration
- Access Settings from navigation
- Configure storage location, sync frequency
- Enable/disable notifications
- Change language and theme
- Export/import settings

## 🌍 Internationalization

SyncHUB supports multiple languages:
- **English** (default)
- **Spanish** (Español)
- **French** (Français)
- **German** (Deutsch)

Change language in Settings → Preferences → Language

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt password encryption
- **CORS Protection** - Cross-origin request security
- **Input Validation** - Server-side input sanitization
- **File Type Validation** - Secure file upload restrictions
- **Environment Variables** - Sensitive data protection

## 🚀 Deployment

### Development with External Access (Ngrok)
1. Start all local services (backend, frontend, MinIO)
2. Run ngrok tunnels for backend and frontend
3. Update frontend environment to use ngrok backend URL
4. Share ngrok URLs for external testing

### Production Deployment
1. Set up production database (PostgreSQL)
2. Configure MinIO for production
3. Set production environment variables
4. Build frontend: `npm run build`
5. Deploy backend with WSGI server (Gunicorn)
6. Serve frontend with Nginx
7. Set up SSL certificates

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint for JavaScript code
- Write unit tests for new features
- Update documentation for API changes
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

**Backend not starting:**
- Check database connection
- Verify environment variables
- Install missing dependencies

**Frontend build errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

**File upload failures:**
- Verify MinIO server is running
- Check file size limits
- Ensure proper CORS configuration

**Database connection issues:**
- Verify PostgreSQL/Supabase credentials
- Check network connectivity
- Run database migrations

**Ngrok connection issues:**
- Verify ngrok authentication token
- Check if ports 5000/5173 are available
- Restart ngrok tunnel if connection drops
- Update frontend API URL to use ngrok URL for external access

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check documentation and troubleshooting guide

## 🙏 Acknowledgments

- **Moringa School** - For providing the learning platform
- **React Team** - For the amazing frontend framework
- **Flask Community** - For the robust backend framework
- **Supabase** - For reliable database hosting
- **MinIO** - For object storage solution
- **Tailwind CSS** - For beautiful styling framework

---

**Built with ❤️ by the SyncHUB Team**

*Fidel Otieno, 
Jaylan Saad, 
Benson Beckham,
Beryl Moseti *