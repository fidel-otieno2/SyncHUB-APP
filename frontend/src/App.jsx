import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FileProvider } from './context/FileContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import FolderPage from './pages/FolderPage';
import FileDetailsPage from './pages/FileDetailsPage';
import DevicesPage from './pages/DevicesPage';
import UploadPage from './pages/UploadPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <FileProvider>
        <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/folder/:folderType"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <FolderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/file/:fileId"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <FileDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/files/:id"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <FileDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/devices"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <DevicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <UploadPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
      </FileProvider>
    </AuthProvider>
  );
}

export default App;