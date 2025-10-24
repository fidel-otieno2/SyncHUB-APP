import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Toast = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    return type === 'success' ? (
      <CheckCircleIcon className="h-5 w-5 text-green-400" />
    ) : (
      <XCircleIcon className="h-5 w-5 text-red-400" />
    );
  };

  const getBgColor = () => {
    return type === 'success' 
      ? 'bg-green-900/90 border-green-500/50' 
      : 'bg-red-900/90 border-red-500/50';
  };

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg border backdrop-blur-sm ${getBgColor()}`}>
      {getIcon()}
      <span className="ml-3 text-white text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-white"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;