import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900/95 backdrop-blur-lg border-b border-gray-700 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">SyncHUB</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-200 hover:text-white hover:bg-gray-700/50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  className="text-gray-200 hover:text-white hover:bg-gray-700/50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Upload
                </Link>
                <Link
                  to="/devices"
                  className="text-gray-200 hover:text-white hover:bg-gray-700/50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Devices
                </Link>
                <Link
                  to="/settings"
                  className="text-gray-200 hover:text-white hover:bg-gray-700/50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg transform hover:scale-105 ml-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg transform hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
