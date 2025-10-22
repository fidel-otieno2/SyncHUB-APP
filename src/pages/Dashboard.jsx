import React, { useEffect } from 'react';
import { useFiles } from '../context/FileContext';
import FileCard from '../components/FileCard';
import SyncStatus from '../components/SyncStatus';

const Dashboard = () => {
  const { files, fetchFiles, downloadFile, deleteFile } = useFiles();

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <SyncStatus />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {files.map(file => (
          <FileCard
            key={file.id}
            file={file}
            onDownload={downloadFile}
            onDelete={deleteFile}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
