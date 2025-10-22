import React from 'react';
import FileUploader from '../components/FileUploader';

const FileUploadPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Upload New File</h1>
          <p className="text-lg text-gray-600">Add a new file to your SyncHUB collection</p>
        </div>
        <div className="flex justify-center">
          <FileUploader />
        </div>
      </div>
    </div>
  );
};

export default FileUploadPage;
