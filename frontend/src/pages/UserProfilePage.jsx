import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ name, email });
      alert('Profile updated');
    } catch (error) {
      alert('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            👤 User Profile
          </h1>
          <p className="text-xl text-gray-300 font-medium">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Avatar Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full flex items-center justify-center text-6xl text-white font-bold shadow-xl">
                {name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{name}</h2>
              <p className="text-gray-600 font-medium">{email}</p>
              <div className="mt-6 p-4 bg-gradient-to-r from-violet-100 to-purple-100 rounded-2xl">
                <p className="text-sm text-violet-700 font-semibold">🎆 Member since 2024</p>
              </div>
            </div>
          </div>

          {/* Profile Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-8">
                ⚙️ Account Settings
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center">
                    📝 Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-6 py-4 border-2 border-violet-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-violet-300 focus:border-violet-500 transition-all duration-200 bg-violet-50/50 text-lg font-medium"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center">
                    📧 Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 border-2 border-violet-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-violet-300 focus:border-violet-500 transition-all duration-200 bg-violet-50/50 text-lg font-medium"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-600 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-700 text-white py-4 px-8 rounded-2xl font-bold text-xl transition-all duration-300 shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating Profile...
                      </>
                    ) : (
                      <>
                        💾 Update Profile
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
