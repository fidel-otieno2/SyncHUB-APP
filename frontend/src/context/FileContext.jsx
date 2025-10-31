import React, { createContext, useContext, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const FileContext = createContext();

export const useFiles = () => useContext(FileContext);

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [syncStatus, setSyncStatus] = useState('checking');
  const [recentFiles, setRecentFiles] = useState([]);

  const checkSync = async () => {
    try {
      const res = await axiosInstance.get('/api/sync/status');
      setSyncStatus(res.data.status);
    } catch (error) {
      setSyncStatus('error');
    }
  };

  // Initialize sync check on mount
  React.useEffect(() => {
    checkSync();
  }, []);

  const fetchFiles = React.useCallback(async () => {
    try {
      const res = await axiosInstance.get('/api/files');
      setFiles(res.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  }, []);

  const uploadFile = React.useCallback(async ({ title, description, file, folder_type, device_name }) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);
    formData.append('folder_type', folder_type || 'documents');
    formData.append('device_name', device_name || 'Current Device');
    const res = await axiosInstance.post('/api/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        console.log('Upload progress:', progressEvent.loaded / progressEvent.total);
      }
    });
    fetchFiles(); // Refresh files
    return res.data;
  }, [fetchFiles]);

  const downloadFile = async (id) => {
    try {
      // Track as recent file when downloaded
      trackRecentFile(id);

      // Get the download URL from backend
      const response = await axiosInstance.get(`/api/files/${id}/download`, {
        responseType: 'blob'
      });

      // Create blob URL and trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Get filename from response headers or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = `file-${id}`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const trackRecentFile = (fileId) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      setRecentFiles(prev => {
        // Remove if already exists
        const filtered = prev.filter(f => f.id !== fileId);
        // Add to beginning and keep only top 3
        return [file, ...filtered].slice(0, 3);
      });
    }
  };

  const syncAll = async () => {
    await axiosInstance.post('/api/sync/trigger');
    fetchFiles();
  };

  const deleteFile = async (id) => {
    try {
      await axiosInstance.delete(`/api/files/delete/${id}`);
      fetchFiles();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  };

  const moveFile = async (id, targetFolder) => {
    try {
      await axiosInstance.post(`/api/files/move/${id}`, {
        folder_type: targetFolder
      });
      // Force refresh with cache busting
      await fetchFiles();
      // Also trigger a page reload to ensure fresh data
      setTimeout(() => {
        window.location.reload();
      }, 500);
      return true;
    } catch (error) {
      console.error('Move failed:', error);
      alert('Move failed. Please try again.');
      return false;
    }
  };

  return (
    <FileContext.Provider value={{ files, syncStatus, recentFiles, fetchFiles, uploadFile, downloadFile, syncAll, deleteFile, moveFile, checkSync, trackRecentFile }}>
      {children}
    </FileContext.Provider>
  );
};
