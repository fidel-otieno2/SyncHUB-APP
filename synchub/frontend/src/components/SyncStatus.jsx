import React, { useEffect, useState } from 'react';
import { useFiles } from '../context/FileContext';

const SyncStatus = () => {
  const { syncStatus, checkSync } = useFiles();
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    // Initial check
    checkSync();
    setLastChecked(new Date());
    
    const interval = setInterval(() => {
      checkSync();
      setLastChecked(new Date());
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []); // Remove checkSync dependency to prevent infinite calls

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Sync Status</h3>
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
          syncStatus === 'synced' 
            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
            : syncStatus === 'idle'
            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
            : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
        }`}>
          {syncStatus === 'synced' ? '✓ Synced' : syncStatus === 'idle' ? '⏸ Idle' : '⚠ Error'}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-gray-300 text-sm">
          Status: <span className="capitalize font-medium text-white">{syncStatus}</span>
        </p>
        {lastChecked && (
          <p className="text-gray-400 text-xs">
            Last checked: {lastChecked.toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default SyncStatus;
