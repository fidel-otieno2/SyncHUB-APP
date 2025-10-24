import React from 'react';
import { useNavigate } from 'react-router-dom';

const FolderGrid = () => {
  const navigate = useNavigate();

  const folders = [
    {
      type: 'documents',
      name: 'Documents',
      icon: '📄',
      color: 'bg-blue-500/20 border-blue-400/30 hover:bg-blue-500/30',
      textColor: 'text-blue-300'
    },
    {
      type: 'images',
      name: 'Images',
      icon: '🖼️',
      color: 'bg-green-500/20 border-green-400/30 hover:bg-green-500/30',
      textColor: 'text-green-300'
    },
    {
      type: 'videos',
      name: 'Videos',
      icon: '🎥',
      color: 'bg-red-500/20 border-red-400/30 hover:bg-red-500/30',
      textColor: 'text-red-300'
    },
    {
      type: 'music',
      name: 'Music',
      icon: '🎵',
      color: 'bg-purple-500/20 border-purple-400/30 hover:bg-purple-500/30',
      textColor: 'text-purple-300'
    },
    {
      type: 'archives',
      name: 'Archives',
      icon: '📦',
      color: 'bg-orange-500/20 border-orange-400/30 hover:bg-orange-500/30',
      textColor: 'text-orange-300'
    },
    {
      type: 'others',
      name: 'Others',
      icon: '📁',
      color: 'bg-gray-500/20 border-gray-400/30 hover:bg-gray-500/30',
      textColor: 'text-gray-300'
    }
  ];

  const handleFolderClick = (folderType) => {
    navigate(`/folder/${folderType}`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {folders.map((folder) => (
        <div
          key={folder.type}
          onClick={() => handleFolderClick(folder.type)}
          className={`${folder.color} border-2 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg`}
        >
          <div className="text-center">
            <div className="text-4xl mb-3">{folder.icon}</div>
            <h3 className={`text-lg font-semibold ${folder.textColor}`}>
              {folder.name}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FolderGrid;