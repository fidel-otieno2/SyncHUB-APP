import React, { useState, useRef } from 'react';

const AudioPlayer = ({ file }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  
  const streamUrl = `http://localhost:5000/api/files/stream/${file.id}`;
  
  const handlePlay = (e) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4 mt-2" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center space-x-4">
        <button
          onClick={handlePlay}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full transition-colors flex items-center justify-center min-w-[48px] min-h-[48px]"
          type="button"
        >
          <span className="text-lg">{isPlaying ? '⏸️' : '▶️'}</span>
        </button>
        <div className="flex-1">
          <audio
            ref={audioRef}
            controls
            src={streamUrl}
            className="w-full h-10"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          >
            Your browser does not support audio playback.
          </audio>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;