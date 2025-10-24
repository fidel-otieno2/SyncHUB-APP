import React from 'react';
import { Link } from 'react-router-dom';
import { useFiles } from '../context/FileContext';
import { formatDate } from '../utils/formatDate';

const FileCard = ({ file }) => {
  const { downloadFile, deleteFile } = useFiles();

  const handleDownload = (e) => {
    e.preventDefault();
    downloadFile(file.id);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm(`Are you sure you want to delete "${file.title}"?`)) {
      deleteFile(file.id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'synced': return 'bg-green-100 text-green-800';
      case 'syncing': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{file.title}</h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{file.description || 'No description'}</p>
          </div>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(file.status || 'synced')}`}>
            {file.status || 'Synced'}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Type:</span>
            <span>{file.type || 'Unknown'}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Size:</span>
            <span>{file.size || 'Unknown'}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Uploaded:</span>
            <span>{formatDate(file.uploadDate || new Date())}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Last Synced:</span>
            <span>{formatDate(file.lastSynced || new Date())}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/files/${file.id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium transition duration-300"
          >
            View Details
          </Link>
          <button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition duration-300"
            title="Download"
          >
            📥
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium transition duration-300"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
