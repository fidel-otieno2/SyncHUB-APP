import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFiles } from '../context/FileContext';
import { formatDate } from '../utils/formatDate';

const FileDetailsPage = () => {
  const { id } = useParams();
  const { files, downloadFile, deleteFile } = useFiles();
  const [file, setFile] = useState(null);
  const [versions, setVersions] = useState([]);
  const [syncLogs, setSyncLogs] = useState([]);

  useEffect(() => {
    const foundFile = files.find(f => f.id === parseInt(id));
    if (foundFile) {
      setFile(foundFile);
      // Mock versions and sync logs
      setVersions([
        { id: 1, version: 1, uploadedBy: 'User', date: new Date(), size: '2.5 MB' },
        { id: 2, version: 2, uploadedBy: 'User', date: new Date(Date.now() - 86400000), size: '2.3 MB' },
      ]);
      setSyncLogs([
        { id: 1, device: 'Laptop', status: 'Success', timestamp: new Date() },
        { id: 2, device: 'Phone', status: 'Success', timestamp: new Date(Date.now() - 3600000) },
      ]);
    }
  }, [id, files]);

  const handleDownload = () => {
    downloadFile(file.id);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      deleteFile(file.id);
    }
  };

  const handleSyncNow = () => {
    // Implement sync now functionality
    alert('Sync initiated!');
  };

  if (!file) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">File Not Found</h2>
          <p className="text-gray-600">The requested file could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">{file.title}</h1>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">File Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Type:</span> {file.type || 'Unknown'}</p>
                  <p><span className="font-medium">Size:</span> {file.size || 'Unknown'}</p>
                  <p><span className="font-medium">Uploaded by:</span> {file.uploadedBy || 'Unknown'}</p>
                  <p><span className="font-medium">Date uploaded:</span> {formatDate(file.uploadDate || new Date())}</p>
                  <p><span className="font-medium">Last synced:</span> {formatDate(file.lastSynced || new Date())}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{file.description || 'No description available.'}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleSyncNow}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition duration-300"
              >
                🔄 Sync Now
              </button>
              <button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition duration-300"
              >
                📥 Download
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition duration-300"
              >
                🗑️ Delete File
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Versions */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">📜 View Versions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {versions.map((version) => (
                  <div key={version.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Version {version.version}</p>
                        <p className="text-sm text-gray-600">Uploaded by {version.uploadedBy} on {formatDate(version.date)}</p>
                        <p className="text-sm text-gray-600">Size: {version.size}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                          Download
                        </button>
                        <button className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">
                          Restore
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sync Logs */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Sync Logs</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {syncLogs.map((log) => (
                  <div key={log.id} className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <div>
                      <p className="font-medium">{log.device}</p>
                      <p className="text-sm text-gray-600">{formatDate(log.timestamp)}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      log.status === 'Success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status}
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
