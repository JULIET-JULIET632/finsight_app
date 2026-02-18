import React from 'react';
import { useNavigate } from 'react-router-dom';

const UpdatedScoreScreen = () => {
  const navigate = useNavigate();

  const tips = [
    {
      title: "Borrow",
      description: "Borrowed from your parents, you can use it to pay for things like food, clothing, and other necessities."
    },
    {
      title: "Stay Safe",
      description: "Stay safe by staying home and avoiding crowds."
    },
    {
      title: "Secure Your Home",
      description: "Secure your home by locking doors and windows."
    },
    {
      title: "Group 39",
      description: "Group up with friends and family to make the most of your time together."
    }
  ];

  return (
    <div className="w-[395px] min-h-screen bg-white mx-auto pb-8">
      {/*back to simulation*/}
      <button 
        onClick={() => navigate('/simulation')}
        className="absolute top-4 left-4 text-sm text-gray-500 hover:text-gray-700"
      >
        ← Back
      </button>

      <div className="px-4 pt-16">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Updated Health Score</h1>
        
        {/*score*/}
        <div className="bg-white rounded-[20px] p-8 shadow-lg border border-gray-100 mb-8">
          <div className="text-7xl font-bold text-green-600 mb-2 text-center">75</div>
        </div>

        {/*AI Coach recommendations button*/}
        <button
          onClick={() => navigate('/ai-coach')}
          className="w-full bg-[#B47D5A] text-white font-semibold py-4 px-6 rounded-[10px] shadow-md mb-8"
        >
          AI Coach Recommendations
        </button>

        {/*potential benefits*/}
        <h2 className="text-base font-medium text-gray-900 mb-4">Potential Benefits:</h2>
        <div className="space-y-4 mb-8">
          {tips.map((tip, index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
              <h3 className="font-medium text-gray-900 mb-1">{index + 1}. {tip.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{tip.description}</p>
            </div>
          ))}
        </div>

        {/*growth tips*/}
        <h2 className="text-base font-medium text-gray-900 mb-4">Growth Tips:</h2>
        <div className="space-y-3 mb-8">
          {tips.map((tip, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl">
              <h3 className="font-medium text-gray-900 mb-1">{tip.title}</h3>
              <p className="text-sm text-gray-500">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpdatedScoreScreen;