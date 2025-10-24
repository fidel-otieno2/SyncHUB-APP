import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CloudArrowUpIcon, DocumentIcon } from '@heroicons/react/24/outline';
import axiosInstance from '../api/axiosInstance';
import Toast from './Toast';

const FileUpload = ({ onUploadSuccess }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [toast, setToast] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  // Upload file with metadata
  const onSubmitUpload = async (data) => {
    if (!selectedFile) {
      setToast({ message: 'Please select a file first', type: 'error' });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', selectedFile.name.split('.').slice(0, -1).join('.') || selectedFile.name);
    formData.append('description', data.description || '');
    formData.append('folder_type', data.folder_type);
    formData.append('device_name', 'Current Device');

    try {
      const response = await axiosInstance.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        }
      });

      // Reset form
      reset();
      setSelectedFile(null);
      setUploadProgress(0);
      setIsUploading(false);

      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }

      setToast({ message: 'File uploaded successfully!', type: 'success' });
    } catch (error) {
      console.error('Upload failed:', error);
      setToast({ message: 'Upload failed. Please try again.', type: 'error' });
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    
    // Auto-detect folder type based on file extension
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      let folderType = 'others';
      
      if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext)) folderType = 'documents';
      else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(ext)) folderType = 'images';
      else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(ext)) folderType = 'videos';
      else if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(ext)) folderType = 'music';
      else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) folderType = 'archives';
      
      // Auto-set folder type
      document.getElementById('folder_type').value = folderType;
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
    
    // Auto-detect folder type for dropped files
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      let folderType = 'others';
      
      if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext)) folderType = 'documents';
      else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(ext)) folderType = 'images';
      else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(ext)) folderType = 'videos';
      else if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(ext)) folderType = 'music';
      else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) folderType = 'archives';
      
      document.getElementById('folder_type').value = folderType;
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload File</h2>

      <form onSubmit={handleSubmit(onSubmitUpload)} className="space-y-4">

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Optional description"
            />
          </div>

          <div>
            <label htmlFor="folder_type" className="block text-sm font-medium text-gray-700">
              Folder *
            </label>
            <select
              id="folder_type"
              {...register('folder_type', { required: 'Please select a folder' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a folder...</option>
              <option value="documents">📄 Documents</option>
              <option value="images">🖼️ Images</option>
              <option value="videos">🎥 Videos</option>
              <option value="music">🎵 Music</option>
              <option value="archives">📦 Archives</option>
              <option value="others">📁 Others</option>
            </select>
            {errors.folder_type && (
              <p className="mt-1 text-sm text-red-600">{errors.folder_type.message}</p>
            )}
          </div>

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="space-y-2">
              <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-sm font-medium text-gray-800">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <p className="text-xs text-gray-500">
                Type: {selectedFile.type || 'Unknown'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-sm text-gray-600">
                Drag and drop a file here, or click to select
              </p>
            </div>
          )}

          <input
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="mt-2 inline-block cursor-pointer text-blue-600 hover:text-blue-500"
          >
            Choose File
          </label>
        </div>

        {isUploading && (
          <div className="space-y-2">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedFile || isUploading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isUploading ? 'Uploading...' : 'Upload File'}
        </button>
      </form>
    </div>
    </>
  );
};

export default FileUpload;