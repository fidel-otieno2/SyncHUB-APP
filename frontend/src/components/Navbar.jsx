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
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-white text-xl font-bold">
              SyncHUB
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Upload File
                </Link>
                <Link
                  to="/sync-monitor"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Sync Monitor
                </Link>
                <Link
                  to="/settings"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
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
