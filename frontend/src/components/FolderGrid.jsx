import React from 'react';
import { useNavigate } from 'react-router-dom';

const FolderGrid = () => {
  const navigate = useNavigate();

  const folders = [
    {
      type: 'documents',
      name: 'Documents',
      icon: '📄',
      color: 'bg-blue-100 border-blue-300 hover:bg-blue-200',
      textColor: 'text-blue-800'
    },
    {
      type: 'images',
      name: 'Images',
      icon: '🖼️',
      color: 'bg-green-100 border-green-300 hover:bg-green-200',
      textColor: 'text-green-800'
    },
    {
      type: 'videos',
      name: 'Videos',
      icon: '🎥',
      color: 'bg-red-100 border-red-300 hover:bg-red-200',
      textColor: 'text-red-800'
    },
    {
      type: 'music',
      name: 'Music',
      icon: '🎵',
      color: 'bg-purple-100 border-purple-300 hover:bg-purple-200',
      textColor: 'text-purple-800'
    },
    {
      type: 'archives',
      name: 'Archives',
      icon: '📦',
      color: 'bg-orange-100 border-orange-300 hover:bg-orange-200',
      textColor: 'text-orange-800'
    },
    {
      type: 'others',
      name: 'Others',
      icon: '📁',
      color: 'bg-gray-100 border-gray-300 hover:bg-gray-200',
      textColor: 'text-gray-800'
    }
  ];

  const handleFolderClick = (folderType) => {
    navigate(`/folder/${folderType}`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-6">
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