import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Alert from '../components/Alert';

const SettingsPage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    storageLocation: '/home/user/synchub',
    syncFrequency: 'auto',
    notifications: true,
    autoSync: true,
    maxFileSize: '100',
    theme: 'dark',
    language: 'en'
  });
  const [alert, setAlert] = useState(null);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem('synchub-settings', JSON.stringify(settings));
    setAlert({ message: 'Settings saved successfully!', type: 'success' });
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        storageLocation: '/home/user/synchub',
        syncFrequency: 'auto',
        notifications: true,
        autoSync: true,
        maxFileSize: '100',
        theme: 'dark',
        language: 'en'
      });
      setAlert({ message: 'Settings reset to default!', type: 'success' });
    }
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'synchub-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    setAlert({ message: 'Settings exported successfully!', type: 'success' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">Settings</h1>
          <p className="text-gray-300">Manage your SyncHUB preferences and configuration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Settings */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              ⚙️ General Settings
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Storage Location</label>
                <input 
                  type="text" 
                  value={settings.storageLocation}
                  onChange={(e) => handleSettingChange('storageLocation', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="/path/to/storage"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sync Frequency</label>
                <select 
                  value={settings.syncFrequency}
                  onChange={(e) => handleSettingChange('syncFrequency', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="auto">Automatic (Real-time)</option>
                  <option value="5min">Every 5 minutes</option>
                  <option value="15min">Every 15 minutes</option>
                  <option value="1hour">Every hour</option>
                  <option value="manual">Manual only</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Maximum File Size (MB)</label>
                <input 
                  type="number" 
                  value={settings.maxFileSize}
                  onChange={(e) => handleSettingChange('maxFileSize', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
                  min="1"
                  max="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                <select 
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              🎛️ Preferences
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-gray-300 font-medium">Enable Notifications</label>
                  <p className="text-sm text-gray-400">Get notified about sync status and file changes</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                  className="w-5 h-5 text-cyan-500 bg-white/10 border-white/20 rounded focus:ring-cyan-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-gray-300 font-medium">Auto-Sync</label>
                  <p className="text-sm text-gray-400">Automatically sync files when changes are detected</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.autoSync}
                  onChange={(e) => handleSettingChange('autoSync', e.target.checked)}
                  className="w-5 h-5 text-cyan-500 bg-white/10 border-white/20 rounded focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                <select 
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="dark">Dark Mode</option>
                  <option value="light">Light Mode</option>
                  <option value="auto">System Default</option>
                </select>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              👤 Account Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <p className="text-white">{user?.email || 'user@example.com'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <p className="text-white">{user?.name || 'User Name'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Account Type</label>
                <p className="text-white">Premium User</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Storage Used</label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-white/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-cyan-500 to-purple-600 h-2 rounded-full" style={{width: '45%'}}></div>
                  </div>
                  <span className="text-white text-sm">4.5GB / 10GB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              🔧 Actions
            </h2>
            
            <div className="space-y-4">
              <button 
                onClick={handleSaveSettings}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                💾 Save Settings
              </button>
              
              <button 
                onClick={handleExportSettings}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                📤 Export Settings
              </button>
              
              <button 
                onClick={handleResetSettings}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                🔄 Reset to Default
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;