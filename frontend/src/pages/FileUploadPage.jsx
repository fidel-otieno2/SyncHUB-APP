import React from 'react';
import FileUploadNew from '../components/FileUploadNew';

const FileUploadPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">Upload New File</h1>
          <p className="text-lg text-gray-300">Add a new file to your SyncHUB collection</p>
        </div>
        <div className="flex justify-center">
          <FileUploadNew />
        </div>
      </div>
    </div>
  );
};

export default FileUploadPage;
