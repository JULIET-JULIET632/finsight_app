import React from 'react';

const PrimaryButton = ({ children, onClick, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-black text-white font-medium py-4 px-6 rounded-[10px]"
    >
      {children}
    </button>
  );
};

export default PrimaryButton;