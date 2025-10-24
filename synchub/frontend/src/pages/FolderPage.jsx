import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import FileCard from '../components/FileCard';

const FolderPage = () => {
  const { folderType } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const folderInfo = {
    documents: { name: 'Documents', icon: '📄', color: 'text-blue-600' },
    images: { name: 'Images', icon: '🖼️', color: 'text-green-600' },
    videos: { name: 'Videos', icon: '🎥', color: 'text-red-600' },
    music: { name: 'Music', icon: '🎵', color: 'text-purple-600' },
    archives: { name: 'Archives', icon: '📦', color: 'text-orange-600' },
    others: { name: 'Others', icon: '📁', color: 'text-gray-600' }
  };

  const currentFolder = folderInfo[folderType] || folderInfo.documents;

  useEffect(() => {
    fetchFolderFiles();
  }, [folderType]);

  const fetchFolderFiles = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/files/by-folder/${folderType}`);
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching folder files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              <span className="text-xl">←</span>
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>

        {/* Folder Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
          <div className="flex items-center space-x-6">
            <div className="text-8xl animate-bounce">{currentFolder.icon}</div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                {currentFolder.name}
              </h1>
              <p className={`text-xl font-semibold flex items-center ${currentFolder.color}`}>
                📁 {files.length} {files.length === 1 ? 'file' : 'files'} in this folder
              </p>
            </div>
          </div>
        </div>

        {/* Files Grid */}
        {files.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-16 text-center border border-white/20">
            <div className="text-8xl mb-6 animate-pulse">📁</div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent mb-4">
              No files in this folder
            </h3>
            <p className="text-xl text-gray-600 font-medium">
              🚀 Upload files to the {currentFolder.name.toLowerCase()} folder to see them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {files.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderPage;