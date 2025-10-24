import React, { useState } from 'react';
import Tooltip from './Tooltip';

const MediaPlayer = ({ file }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Use same logic as axios to detect correct backend URL
  const isNetworkAccess = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  const baseUrl = isNetworkAccess ? `http://${window.location.hostname}:5000` : 'http://localhost:5000';
  const fileUrl = `${baseUrl}/api/files/stream/${file.id}`;
  
  const isAudio = file.content_type?.startsWith('audio/');
  const isVideo = file.content_type?.startsWith('video/');
  const isImage = file.content_type?.startsWith('image/');
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isAudio) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L4.5 13.5H2a1 1 0 01-1-1V7.5a1 1 0 011-1h2.5l3.883-3.314a1 1 0 011.617.814zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{file.title}</h4>
            <p className="text-sm text-gray-500">Audio File</p>
          </div>
        </div>
        <audio 
          controls 
          className="w-full"
          preload="metadata"
        >
          <source src={fileUrl} type={file.content_type} />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{file.title}</h4>
              <p className="text-sm text-gray-500">Video File</p>
            </div>
          </div>
          <Tooltip text="Toggle Fullscreen">
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </Tooltip>
        </div>
        
        {isFullscreen && (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <video 
              controls 
              className="max-w-full max-h-full"
              autoPlay
            >
              <source src={fileUrl} type={file.content_type} />
              Your browser does not support the video element.
            </video>
          </div>
        )}
        
        <div className="flex justify-center">
          <video 
            controls 
            className="rounded shadow-lg object-cover"
            style={{ width: '250px', height: '250px' }}
            preload="metadata"
          >
            <source src={fileUrl} type={file.content_type} />
            Your browser does not support the video element.
          </video>
        </div>
      </div>
    );
  }

  if (isImage) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{file.title}</h4>
            <p className="text-sm text-gray-500">Image File</p>
          </div>
        </div>
        <img 
          src={fileUrl} 
          alt={file.title}
          className="w-full rounded max-h-96 object-contain bg-white"
        />
      </div>
    );
  }

  return null;
};

export default MediaPlayer;