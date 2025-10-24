import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FileProvider } from './context/FileContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import FileUploadPage from './pages/FileUploadPage';
import SyncMonitorPage from './pages/SyncMonitorPage';
import SettingsPage from './pages/SettingsPage';
import FileDetailsPage from './pages/FileDetailsPage';
import UserProfilePage from './pages/UserProfilePage';
import FolderPage from './pages/FolderPage';
import DevicesPage from './pages/DevicesPage';
import NotFound from './pages/NotFound';
import './styles/globals.css';

const AppRoutes = () => {
  const authContext = useAuth();
  if (!authContext) return <div>Loading...</div>;
  const { user } = authContext;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/upload" element={user ? <FileUploadPage /> : <Navigate to="/login" replace />} />
          <Route path="/sync-monitor" element={user ? <SyncMonitorPage /> : <Navigate to="/login" replace />} />
          <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/login" replace />} />
          <Route path="/files/:id" element={user ? <FileDetailsPage /> : <Navigate to="/login" replace />} />
          <Route path="/folder/:folderType" element={user ? <FolderPage /> : <Navigate to="/login" replace />} />
          <Route path="/devices" element={user ? <DevicesPage /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={user ? <UserProfilePage /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <FileProvider>
          <AppRoutes />
        </FileProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
