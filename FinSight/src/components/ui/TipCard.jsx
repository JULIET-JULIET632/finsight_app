import React from 'react';

const TipCard = ({ title, description }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-[20px] border border-gray-200">
      <h3 className="font-medium text-[#3A361] mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default TipCard;