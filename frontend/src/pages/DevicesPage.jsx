import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const DevicesPage = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [newDevice, setNewDevice] = useState({
    email: '',
    device_name: '',
    device_type: 'laptop'
  });

  useEffect(() => {
    fetchDevices();
    
    // Send heartbeat to mark current device as active
    const sendHeartbeat = async () => {
      try {
        await axiosInstance.post('/api/devices/heartbeat');
      } catch (error) {
        console.log('Heartbeat failed:', error);
      }
    };
    
    // Send initial heartbeat
    sendHeartbeat();
    
    // Send heartbeat every 30 seconds
    const heartbeatInterval = setInterval(sendHeartbeat, 30000);
    
    return () => clearInterval(heartbeatInterval);
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      console.log('Fetching devices...');
      const response = await axiosInstance.get('/api/devices');
      console.log('Devices response:', response.data);
      setDevices(response.data);
    } catch (error) {
      console.error('Error fetching devices:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDevice = async (e) => {
    e.preventDefault();
    try {
      console.log('Backend URL:', axiosInstance.defaults.baseURL);
      console.log('Attempting to register device:', newDevice);
      
      // Test backend connection first
      const testResponse = await axiosInstance.get('/api/test');
      console.log('Backend test response:', testResponse.data);
      
      const response = await axiosInstance.post('/api/devices/register', newDevice);
      console.log('Device registration response:', response.data);
      setNewDevice({ email: '', device_name: '', device_type: 'laptop' });
      setShowAddDevice(false);
      fetchDevices();
      alert('Device added successfully!');
    } catch (error) {
      console.error('Error adding device:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error details:', error.response?.data);
      console.error('Full error:', error);
      alert(`Failed to add device: ${error.response?.data?.error || error.message}`);
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'laptop': return '💻';
      case 'phone': return '📱';
      case 'tablet': return '📱';
      default: return '🖥️';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-300' 
      : 'bg-red-100 text-red-800 border-red-300';
  };

  const syncAllFiles = async () => {
    try {
      await axiosInstance.post('/api/sync/trigger');
      alert('Sync initiated! Files will be synchronized across all devices.');
    } catch (error) {
      console.error('Error syncing files:', error);
      alert('Failed to sync files');
    }
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Device Management</h1>
            <p className="text-gray-300 mt-2 text-lg">Manage and sync files across all your devices</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={syncAllFiles}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              🔄 Sync All Files
            </button>
            <button
              onClick={() => setShowAddDevice(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              + Add Device
            </button>

          </div>
        </div>

        {/* Device Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📊</div>
              <div>
                <h3 className="text-lg font-semibold text-red-400">Total Devices</h3>
                <p className="text-2xl font-bold text-red-300">{devices.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🟢</div>
              <div>
                <h3 className="text-lg font-semibold text-blue-400">Active Devices</h3>
                <p className="text-2xl font-bold text-blue-300">
                  {devices.filter(d => d.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🔴</div>
              <div>
                <h3 className="text-lg font-semibold text-purple-400">Inactive Devices</h3>
                <p className="text-2xl font-bold text-purple-300">
                  {devices.filter(d => d.status === 'inactive').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Devices List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-200/50">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">📊 Connected Devices</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {devices.map((device) => (
              <div key={device.id} className="p-6 hover:bg-gray-50/70 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{getDeviceIcon(device.type)}</div>
                    <div>
                      <h3 className="text-lg font-bold text-red-400">
                        {device.name}
                        {device.is_main_device && (
                          <span className="ml-2 px-3 py-1 text-xs bg-gradient-to-r from-red-500 to-purple-600 text-white rounded-full font-bold">
                            Main Device
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-blue-400 font-medium">
                        Owner: {device.user_name} • Type: {device.type}
                      </p>
                      {device.last_seen && (
                        <p className="text-xs text-purple-400 font-medium">
                          Last seen: {new Date(device.last_seen).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(device.status)}`}>
                      {device.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Device Modal */}
        {showAddDevice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-200/50">
              <h2 className="text-xl font-semibold mb-4">Add New Device</h2>
              <form onSubmit={handleAddDevice}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Email
                  </label>
                  <input
                    type="email"
                    value={newDevice.email}
                    onChange={(e) => setNewDevice({...newDevice, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Device Name
                  </label>
                  <input
                    type="text"
                    value={newDevice.device_name}
                    onChange={(e) => setNewDevice({...newDevice, device_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Device Type
                  </label>
                  <select
                    value={newDevice.device_type}
                    onChange={(e) => setNewDevice({...newDevice, device_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="laptop">Laptop</option>
                    <option value="phone">Phone</option>
                    <option value="tablet">Tablet</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddDevice(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 shadow-lg transform hover:scale-105"
                  >
                    Add Device
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevicesPage;