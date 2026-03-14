import React from 'react';

const ImpactCard = ({ title, amount, impact, selected, onSelect }) => {
  const impactColors = {
    'High Impact': 'bg-red-100 text-red-800',
    'Medium Impact': 'bg-yellow-100 text-yellow-800',
    'Low Impact': 'bg-green-100 text-green-800'
  };

  return (
    <div 
      onClick={onSelect}
      className={`p-4 rounded-[20px] border-2 cursor-pointer transition-all ${
        selected ? 'border-[#3A361] bg-gray-50' : 'border-gray-200'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{title}</h3>
        <span className={`text-xs px-3 py-1 rounded-full ${impactColors[impact]}`}>
          {impact}
        </span>
      </div>
      <p className="text-lg font-semibold">{amount}</p>
    </div>
  );
};

export default ImpactCard;