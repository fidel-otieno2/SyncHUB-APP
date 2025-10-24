import React, { useState } from 'react';

const SettingsPage = () => {
  const [minioConfig, setMinioConfig] = useState({
    endpoint: 'http://localhost:9000',
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
  });

  const [ngrokConfig, setNgrokConfig] = useState({
    tunnelUrl: 'https://deucedly-pretyphoid-jeanene.ngrok-free.dev',
    status: 'Active'
  });

  const [dbConfig, setDbConfig] = useState({
    host: 'aws-1-eu-north-1.pooler.supabase.com',
    port: '5432',
    database: 'postgres',
    user: 'postgres.szfyytdzcgljaesbwkri'
  });

  const handleSave = () => {
    // In real app, save to backend
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">⚙️ System Settings</h1>
          <p className="text-xl text-gray-300 font-medium">Configure MinIO, Ngrok, and Database connections</p>
        </div>

        <div className="space-y-8">
          {/* MinIO Configuration */}
          <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              🗄 MinIO Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint</label>
                <input
                  type="text"
                  value={minioConfig.endpoint}
                  onChange={(e) => setMinioConfig({...minioConfig, endpoint: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 bg-blue-50/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Key</label>
                <input
                  type="text"
                  value={minioConfig.accessKey}
                  onChange={(e) => setMinioConfig({...minioConfig, accessKey: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 bg-blue-50/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                <input
                  type="password"
                  value={minioConfig.secretKey}
                  onChange={(e) => setMinioConfig({...minioConfig, secretKey: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 bg-blue-50/50"
                />
              </div>
            </div>
          </div>

          {/* Ngrok Configuration */}
          <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              🌐 Ngrok Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tunnel URL</label>
                <input
                  type="text"
                  value={ngrokConfig.tunnelUrl}
                  onChange={(e) => setNgrokConfig({...ngrokConfig, tunnelUrl: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-200 bg-indigo-50/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="flex items-center">
                  <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full shadow-lg ${
                    ngrokConfig.status === 'Active'
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                      : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
                  }`}>
                    {ngrokConfig.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Database Configuration */}
          <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              💾 Database Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
                <input
                  type="text"
                  value={dbConfig.host}
                  onChange={(e) => setDbConfig({...dbConfig, host: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 bg-purple-50/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                <input
                  type="text"
                  value={dbConfig.port}
                  onChange={(e) => setDbConfig({...dbConfig, port: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 bg-purple-50/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Database</label>
                <input
                  type="text"
                  value={dbConfig.database}
                  onChange={(e) => setDbConfig({...dbConfig, database: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 bg-purple-50/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                <input
                  type="text"
                  value={dbConfig.user}
                  onChange={(e) => setDbConfig({...dbConfig, user: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 bg-purple-50/50"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 text-white px-12 py-4 rounded-2xl font-bold text-xl transition-all duration-300 shadow-2xl transform hover:scale-105"
            >
              💾 Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
