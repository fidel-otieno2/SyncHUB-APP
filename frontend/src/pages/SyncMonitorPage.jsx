import React, { useEffect, useState } from 'react';
import { useFiles } from '../../../frontend (2)/src/context/FileContext';
import { formatDate } from '../../../frontend (2)/src/utils/formatDate';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">Sync Monitor</h1>
            <p className="text-xl text-gray-300 font-medium">Track syncing activity across all devices</p>
          </div>
          <button
            onClick={handleForceSync}
            disabled={isSyncing}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {isSyncing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Syncing...
              </>
            ) : (
              <>
                🔄 Force Sync All
              </>
            )}
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden border border-white/20">
          <div className="px-8 py-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-indigo-200/30">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              📊 Sync Activity
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-indigo-100">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-bold text-indigo-700 uppercase tracking-wider">
                    📄 File Name
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-indigo-700 uppercase tracking-wider">
                    💻 Device
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-indigo-700 uppercase tracking-wider">
                    ⚡ Status
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-indigo-700 uppercase tracking-wider">
                    🕒 Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-indigo-100">
                {syncLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200">
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {log.fileName}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {log.device}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full shadow-lg ${
                        log.status === 'Success'
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                          : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
                      }`}>
                        {log.status === 'Success' ? '✅ Success' : '❌ Failed'}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {formatDate(log.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {syncLogs.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🔄</div>
            <div className="text-gray-600 text-2xl font-semibold mb-3">No sync activity yet</div>
            <p className="text-gray-500 text-lg">Sync logs will appear here once files are synced</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SyncMonitorPage;
