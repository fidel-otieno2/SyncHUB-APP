import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CloudArrowUpIcon, DocumentIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const FileUpload = ({ onUploadSuccess }) => {
  const [step, setStep] = useState(1); // 1: metadata, 2: file upload
  const [fileMetadata, setFileMetadata] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  // Step 1: Create file metadata
  const onSubmitMetadata = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/files`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setFileMetadata(response.data.file);
      setStep(2);
    } catch (error) {
      console.error('Failed to create file metadata:', error);
      alert('Failed to create file metadata. Please try again.');
    }
  };

  // Step 2: Upload actual file
  const handleFileUpload = async () => {
    if (!selectedFile || !fileMetadata) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/files/${fileMetadata.id}/upload`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          }
        }
      );

      // Reset form and notify parent
      reset();
      setStep(1);
      setFileMetadata(null);
      setSelectedFile(null);
      setUploadProgress(0);
      setIsUploading(false);

      if (onUploadSuccess) {
        onUploadSuccess(response.data.file);
      }

      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload File</h2>

      {step === 1 && (
        <form onSubmit={handleSubmit(onSubmitMetadata)} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              File Title *
            </label>
            <input
              type="text"
              id="title"
              {...register('title', { 
                required: 'Title is required',
                minLength: { value: 2, message: 'Title must be at least 2 characters' }
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter file title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

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

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Next: Choose File
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            <p><strong>Title:</strong> {fileMetadata?.title}</p>
            {fileMetadata?.description && (
              <p><strong>Description:</strong> {fileMetadata.description}</p>
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
                <p className="text-sm text-gray-600">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
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

          <div className="flex space-x-3">
            <button
              onClick={() => setStep(1)}
              disabled={isUploading}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={handleFileUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;