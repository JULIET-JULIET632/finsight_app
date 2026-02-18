import React from 'react';

const ScoreCard = ({ score, status, description }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Good': return 'text-green-600';
      case 'Needs Improvement': return 'text-yellow-600';
      case 'Warning': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-[20px] shadow-lg border border-gray-100">
      <div className="text-center">
        <div className="text-6xl font-bold mb-2">{score}</div>
        <div className={`text-lg font-medium mb-4 ${getStatusColor(status)}`}>{status}</div>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
    </div>
  );
};

export default ScoreCard;