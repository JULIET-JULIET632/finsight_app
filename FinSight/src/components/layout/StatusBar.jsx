import React from 'react';

const StatusBar = () => {
  return (
    <div className="flex justify-between items-center px-4 py-2">
      <span className="text-sm font-medium">11:07</span>
      <div className="flex items-center gap-1">
        <div className="w-4 h-4 bg-black/20 rounded-sm"></div>
        <div className="w-4 h-4 bg-black/20 rounded-sm"></div>
        <div className="w-4 h-4 bg-black/20 rounded-sm"></div>
      </div>
    </div>
  );
};

export default StatusBar;