import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFiles } from '../context/FileContext';
import { formatDate } from '../utils/formatDate';
import AudioPlayer from './AudioPlayer';
import Alert from './Alert';
import { t } from '../utils/translations';

const FileCard = ({ file }) => {
  const { downloadFile, deleteFile, moveFile, trackRecentFile } = useFiles();
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const lang = JSON.parse(localStorage.getItem('synchub-settings') || '{}').language || 'en';

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

  const handleMove = (e) => {
    e.preventDefault();
    setShowMoveModal(true);
  };

  const handleMoveConfirm = async (targetFolder) => {
    const success = await moveFile(file.id, targetFolder);
    if (success) {
      setShowMoveModal(false);
      setAlert({ message: `"${file.title}" moved to ${targetFolder} successfully!`, type: 'success' });
    } else {
      setAlert({ message: `Failed to move "${file.title}". Please try again.`, type: 'error' });
    }
  };

  const folders = [
    { value: 'video', label: '🎥 Videos' },
    { value: 'audio', label: '🎵 Audio' },
    { value: 'pictures', label: '🖼️ Pictures' },
    { value: 'documents', label: '📄 Documents' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'synced': return 'bg-green-100 text-green-800';
      case 'syncing': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCardClick = () => {
    if (trackRecentFile) {
      trackRecentFile(file.id);
    }
  };

  return (
    <>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <div 
        className="bg-white/10 backdrop-blur-lg rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer border border-white/20"
        onClick={handleCardClick}
      >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1 truncate">{file.title}</h3>
            <p className="text-sm text-gray-300 mb-2 line-clamp-2">{file.description || 'No description'}</p>
          </div>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(file.status || 'synced')}`}>
            {file.status || 'Synced'}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Type:</span>
            <span>{file.type || 'Unknown'}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>Size:</span>
            <span>{file.size || 'Unknown'}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>Uploaded:</span>
            <span>{formatDate(file.uploadDate || new Date())}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>Last Synced:</span>
            <span>{formatDate(file.lastSynced || new Date())}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/files/${file.id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium transition duration-300"
          >
            {t('viewDetails', lang)}
          </Link>
          <button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition duration-300"
            title="Download"
          >
            📥
          </button>

          <button
            onClick={handleMove}
            className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md text-sm font-medium transition duration-300"
            title="Move to folder"
          >
            📁
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium transition duration-300"
            title="Delete"
          >
            🗑️
          </button>
        </div>
        
        {/* Play Button for Audio */}
        {file.folder_type === 'audio' && (
          <div className="mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(`http://localhost:5000/api/files/stream/${file.id}`, '_blank');
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              🎵 Play Audio
            </button>
          </div>
        )}
      </div>
      
      {/* Move Modal */}
      {showMoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Move "{file.title}" to:</h3>
            <div className="space-y-2">
              {folders.filter(f => f.value !== file.folder_type).map((folder) => (
                <button
                  key={folder.value}
                  onClick={() => handleMoveConfirm(folder.value)}
                  className="w-full text-left p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {folder.label}
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowMoveModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default FileCard;
