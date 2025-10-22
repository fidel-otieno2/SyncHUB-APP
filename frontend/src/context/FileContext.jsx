import React, { createContext, useContext, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const FileContext = createContext();

export const useFiles = () => useContext(FileContext);

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [syncStatus, setSyncStatus] = useState('checking');

  const fetchFiles = async () => {
    try {
      const res = await axiosInstance.get('/api/files');
      setFiles(res.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const uploadFile = async ({ title, description, file }) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);
    const res = await axiosInstance.post('/api/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        console.log('Upload progress:', progressEvent.loaded / progressEvent.total);
      }
    });
    fetchFiles(); // Refresh files
    return res.data;
  };

  const downloadFile = async (id) => {
    const res = await axiosInstance.get(`/api/files/${id}/download`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'file'); // You might want to get the filename from the response
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const syncAll = async () => {
    await axiosInstance.post('/api/sync/trigger');
    fetchFiles();
  };

  const deleteFile = async (id) => {
    await axiosInstance.delete(`/api/files/${id}`);
    fetchFiles();
  };

  const checkSync = async () => {
    try {
      const res = await axiosInstance.get('/api/sync/status');
      setSyncStatus(res.data.status);
    } catch (error) {
      setSyncStatus('error');
    }
  };

  return (
    <FileContext.Provider value={{ files, syncStatus, fetchFiles, uploadFile, downloadFile, syncAll, deleteFile, checkSync }}>
      {children}
    </FileContext.Provider>
  );
};
