import React from 'react';

const SecondaryButton = ({ children, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-white text-[#3A361] border border-[#3A361] font-medium py-4 px-6 rounded-[10px] transition-all hover:bg-gray-50 ${className}`}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;