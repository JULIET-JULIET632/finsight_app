import React from 'react';
import { useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[395px] mx-auto bg-white border-t border-gray-200 px-6 py-3">
      <div className="flex justify-around items-center">
        <button onClick={() => navigate('/')} className="flex flex-col items-center">
          <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
          <span className="text-xs mt-1">Home</span>
        </button>
        <button onClick={() => navigate('/results')} className="flex flex-col items-center">
          <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
          <span className="text-xs mt-1">Score</span>
        </button>
        <button onClick={() => navigate('/simulate')} className="flex flex-col items-center">
          <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
          <span className="text-xs mt-1">Simulate</span>
        </button>
        <button className="flex flex-col items-center">
          <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;