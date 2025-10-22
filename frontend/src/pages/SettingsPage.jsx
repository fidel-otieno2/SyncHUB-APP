import React, { useState } from 'react';

const SettingsPage = () => {
  const [minioConfig, setMinioConfig] = useState({
    endpoint: 'localhost:9000',
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
  });

  const [ngrokConfig, setNgrokConfig] = useState({
    tunnelUrl: 'https://abcd1234.ngrok.io',
    status: 'Active'
  });

  const [dbConfig, setDbConfig] = useState({
    host: 'localhost',
    port: '5432',
    database: 'synchub'
  });

  const handleSave = () => {
    // In real app, save to backend
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">System Settings</h1>
          <p className="text-lg text-gray-600">Configure MinIO, Ngrok, and Database connections</p>
        </div>

        <div className="space-y-8">
          {/* MinIO Configuration */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">MinIO Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint</label>
                <input
                  type="text"
                  value={minioConfig.endpoint}
                  onChange={(e) => setMinioConfig({...minioConfig, endpoint: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Key</label>
                <input
                  type="text"
                  value={minioConfig.accessKey}
                  onChange={(e) => setMinioConfig({...minioConfig, accessKey: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                <input
                  type="password"
                  value={minioConfig.secretKey}
                  onChange={(e) => setMinioConfig({...minioConfig, secretKey: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Ngrok Configuration */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ngrok Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tunnel URL</label>
                <input
                  type="text"
                  value={ngrokConfig.tunnelUrl}
                  onChange={(e) => setNgrokConfig({...ngrokConfig, tunnelUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="flex items-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    ngrokConfig.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {ngrokConfig.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Database Configuration */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Database Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
                <input
                  type="text"
                  value={dbConfig.host}
                  onChange={(e) => setDbConfig({...dbConfig, host: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                <input
                  type="text"
                  value={dbConfig.port}
                  onChange={(e) => setDbConfig({...dbConfig, port: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Database</label>
                <input
                  type="text"
                  value={dbConfig.database}
                  onChange={(e) => setDbConfig({...dbConfig, database: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition duration-300"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
