import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center px-6">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
        </div>

        {/* Error Icon */}
        <div className="text-8xl mb-8 animate-bounce">
          😵‍💫
        </div>

        {/* Error Message */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 border border-white/20 max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-xl text-gray-300 font-medium mb-6">
            🔍 The page you're looking for seems to have vanished into the digital void!
          </p>
          <p className="text-lg text-gray-400">
            Don't worry, even the best explorers sometimes take a wrong turn.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/" 
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl transform hover:scale-105 flex items-center space-x-2"
          >
            <span>🏠</span>
            <span>Go Home</span>
          </Link>
          
          <Link 
            to="/dashboard" 
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl transform hover:scale-105 flex items-center space-x-2"
          >
            <span>📊</span>
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Fun Fact */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 font-medium">
            🎆 Fun fact: 404 errors got their name from room 404 at CERN where the web was born!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
