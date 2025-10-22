import React, { useEffect, useState } from 'react';
import { useFiles } from '../context/FileContext';

const SyncStatus = () => {
  const { syncStatus, checkSync } = useFiles();
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      checkSync();
      setLastChecked(new Date());
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [checkSync]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Sync Status</h3>
      <p className={`text-sm ${syncStatus === 'synced' ? 'text-green-600' : 'text-yellow-600'}`}>
        Status: {syncStatus}
      </p>
      {lastChecked && (
        <p className="text-sm text-gray-500">
          Last checked: {lastChecked.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

export default SyncStatus;
