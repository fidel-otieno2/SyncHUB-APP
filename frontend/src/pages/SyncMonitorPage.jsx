import React, { useEffect, useState } from 'react';
import { useFiles } from '../context/FileContext';
import { formatDate } from '../utils/formatDate';

const SyncMonitorPage = () => {
  const { syncAll } = useFiles();
  const [syncLogs, setSyncLogs] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Mock sync logs - in real app, fetch from API
    setSyncLogs([
      { id: 1, fileName: 'document.pdf', device: 'Laptop', status: 'Success', timestamp: new Date() },
      { id: 2, fileName: 'image.jpg', device: 'Phone', status: 'Failed', timestamp: new Date(Date.now() - 3600000) },
      { id: 3, fileName: 'video.mp4', device: 'Tablet', status: 'Success', timestamp: new Date(Date.now() - 7200000) },
    ]);
  }, []);

  const handleForceSync = async () => {
    setIsSyncing(true);
    try {
      await syncAll();
      // Add new log entry
      setSyncLogs(prev => [{
        id: Date.now(),
        fileName: 'All Files',
        device: 'Manual Sync',
        status: 'Success',
        timestamp: new Date()
      }, ...prev]);
    } catch (error) {
      setSyncLogs(prev => [{
        id: Date.now(),
        fileName: 'All Files',
        device: 'Manual Sync',
        status: 'Failed',
        timestamp: new Date()
      }, ...prev]);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sync Monitor</h1>
            <p className="text-lg text-gray-600">Track syncing activity across all devices</p>
          </div>
          <button
            onClick={handleForceSync}
            disabled={isSyncing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300 disabled:opacity-50"
          >
            {isSyncing ? 'Syncing...' : 'Force Sync All'}
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Sync Activity</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {syncLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.fileName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.device}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        log.status === 'Success'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(log.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {syncLogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No sync activity yet</div>
            <p className="text-gray-400 mt-2">Sync logs will appear here once files are synced</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SyncMonitorPage;
