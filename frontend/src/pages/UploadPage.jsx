import React from 'react';
import FileUpload from '../components/FileUpload';

const UploadPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Upload Files</h1>
        <FileUpload />
      </div>
    </div>
  );
};

export default UploadPage;