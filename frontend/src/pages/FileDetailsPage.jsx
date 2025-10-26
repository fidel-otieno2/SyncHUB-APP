import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFiles } from '../context/FileContext';
import { formatDate } from '../utils/formatDate';
import axiosInstance from '../api/axiosInstance';
import MediaPlayer from '../components/MediaPlayer';

import Tooltip from '../components/Tooltip';
import Toast from '../components/Toast';

const FileDetailsPage = () => {
  const { fileId, id } = useParams();
  const actualId = fileId || id; // Handle both route patterns
  const navigate = useNavigate();
  const { files, downloadFile, deleteFile } = useFiles();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [versions, setVersions] = useState([]);
  const [syncLogs, setSyncLogs] = useState([]);
  const [alert, setAlert] = useState(null);


  useEffect(() => {
    const fetchFileDetails = async () => {
      console.log('File ID from URL params:', actualId);
      if (!actualId) {
        console.log('No ID found in URL params');
        setError('No file ID provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await axiosInstance.get(`/api/files/${actualId}`);
        const fileData = response.data;
        
        // Format the file data with proper details
        const formattedFile = {
          ...fileData,
          type: fileData.content_type || 'Unknown',
          size: formatFileSize(fileData.size),
          uploadedBy: 'Current User',
          uploadDate: fileData.created_at ? new Date(fileData.created_at) : new Date(),
          lastSynced: new Date()
        };
        
        setFile(formattedFile);
        
        // Mock versions and sync logs
        setVersions([
          { id: 1, version: 1, uploadedBy: 'Current User', date: new Date(), size: formatFileSize(fileData.size) },
        ]);
        setSyncLogs([
          { id: 1, device: 'Current Device', status: 'Success', timestamp: new Date() },
        ]);
      } catch (error) {
        console.error('Error fetching file details:', error);
        setError(error.response?.data?.error || 'Failed to load file details');
        setFile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFileDetails();
  }, [actualId]);

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(`/api/files/${actualId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.filename || 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setAlert({ message: `"${file.filename}" downloaded successfully!`, type: 'success' });
    } catch (error) {
      setAlert({ message: 'Download failed. Please try again.', type: 'error' });
    }
  };
  
  const handleVersionDownload = async (version) => {
    try {
      // For now, download the same file (in real app, you'd have version-specific URLs)
      await handleDownload();
      setAlert({ message: `"${file.filename}" version ${version.version} downloaded successfully!`, type: 'success' });
    } catch (error) {
      setAlert({ message: 'Version download failed.', type: 'error' });
    }
  };
  
  const handleRestore = (version) => {
    // In a real app, this would restore the file to this version
    setAlert({ message: `"${file.filename}" restored to version ${version.version} successfully!`, type: 'success' });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await deleteFile(file.id);
        setAlert({ message: `"${file.filename}" deleted successfully!`, type: 'success' });
      } catch (error) {
        setAlert({ message: 'Delete failed. Please try again.', type: 'error' });
      }
    }
  };

  const handleSyncNow = async () => {
    try {
      await axiosInstance.post('/api/sync/trigger');
      setAlert({ message: `"${file.filename}" sync initiated successfully!`, type: 'success' });
    } catch (error) {
      setAlert({ message: 'Sync failed. Please try again.', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading File Details...</h2>
        </div>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">File Not Found</h2>
          <p className="text-gray-300 mb-4">{error || 'The requested file could not be found.'}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      {alert && (
        <Toast
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            <span className="text-xl">←</span>
            <span>Back to Files</span>
          </button>
        </div>
        
        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden mb-8 border border-white/20">
          <div className="px-8 py-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-cyan-200/30">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">📄 {file.title}</h1>
          </div>
          <div className="p-8">
            {/* Media Player */}
            <MediaPlayer file={file} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  📊 File Information
                </h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Type:</span> {file.type || 'Unknown'}</p>
                  <p><span className="font-medium">Size:</span> {file.size || 'Unknown'}</p>
                  <p><span className="font-medium">Uploaded by:</span> {file.uploadedBy || 'Unknown'}</p>
                  <p><span className="font-medium">Date uploaded:</span> {formatDate(file.uploadDate || new Date())}</p>
                  <p><span className="font-medium">Last synced:</span> {formatDate(file.lastSynced || new Date())}</p>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  📝 Description
                </h3>
                <p className="text-gray-600">{file.description || 'No description available.'}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Tooltip text="Sync this file across all devices">
                <button
                  onClick={handleSyncNow}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  🔄 Sync Now
                </button>
              </Tooltip>
              <Tooltip text="Download file to your device">
                <button
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  📥 Download
                </button>
              </Tooltip>
              <Tooltip text="Delete this file permanently">
                <button
                  onClick={handleDelete}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  🗑️ Delete File
                </button>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Versions */}
          <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden border border-white/20">
            <div className="px-8 py-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-purple-200/30">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">📜 View Versions</h2>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                {versions.map((version) => (
                  <div key={version.id} className="border-2 border-purple-200 rounded-2xl p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold text-purple-800">🔖 Version {version.version}</p>
                        <p className="text-sm text-gray-700 font-medium">👤 Uploaded by {version.uploadedBy} on {formatDate(version.date)}</p>
                        <p className="text-sm text-gray-600">📦 Size: {version.size}</p>
                      </div>
                      <div className="flex gap-3">
                        <Tooltip text="Download this version">
                          <button 
                            onClick={() => handleVersionDownload(version)}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg transform hover:scale-105"
                          >
                            📥 Download
                          </button>
                        </Tooltip>
                        <Tooltip text="Restore file to this version">
                          <button 
                            onClick={() => handleRestore(version)}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg transform hover:scale-105"
                          >
                            🔄 Restore
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sync Logs */}
          <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden border border-white/20">
            <div className="px-8 py-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-emerald-200/30">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">🔄 Sync Logs</h2>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                {syncLogs.map((log) => (
                  <div key={log.id} className="flex justify-between items-center border-b-2 border-emerald-100 pb-4 mb-4 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02]">
                    <div>
                      <p className="text-lg font-bold text-emerald-800 flex items-center">💻 {log.device}</p>
                      <p className="text-sm text-gray-700 font-medium flex items-center">🕒 {formatDate(log.timestamp)}</p>
                    </div>
                    <span className={`inline-flex px-6 py-3 text-sm font-bold rounded-2xl shadow-xl ${
                      log.status === 'Success'
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                        : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
                    }`}>
                      {log.status === 'Success' ? '✅ Success' : '❌ Failed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetailsPage;
