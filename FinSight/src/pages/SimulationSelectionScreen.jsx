import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SimulationSelectionScreen = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const impactItems = [
    { id: 1, title: 'Loan Repayments', amount: 'USD 2000 / Month', impact: 'High Impact' },
    { id: 2, title: 'Rent', amount: 'USD 1500 / Month', impact: 'High Impact' },
    { id: 3, title: 'Stock Spending', amount: 'USD 1000 / Month', impact: 'Medium Impact' },
    { id: 4, title: 'Cash Buffer', amount: 'USD 800 / Month', impact: 'Medium Impact' },
    { id: 5, title: 'Cash Buffer', amount: 'USD 800 / Month', impact: 'Low Impact' }
  ];

  const toggleSelect = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-[395px] min-h-screen bg-white mx-auto">
      {/*back to results*/}
      <button 
        onClick={() => navigate('/results')}
        className="absolute top-4 left-4 text-sm text-gray-500 hover:text-gray-700"
      >
        ← Back
      </button>

      <div className="px-4 pt-16">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Choose What To Improve</h1>
        <p className="text-sm text-gray-500 mb-6">
          Select areas to make improvements and we'll show you the impact on your score.
        </p>

        {/*score warning*/}
        <div className="bg-orange-50 rounded-[20px] p-5 border border-orange-100 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Business Health Score</span>
            <span className="text-lg font-bold text-orange-600">58 / 100</span>
          </div>
          <div className="w-full h-2 bg-orange-100 rounded-full mb-3">
            <div className="w-[58%] h-2 bg-orange-400 rounded-full"></div>
          </div>
          <p className="text-xs text-red-500 font-medium">
            Warning: Your score is currently affected by high expenses and low cash flow.
          </p>
        </div>

        {/*recommended to adjust*/}
        <h2 className="text-sm font-medium text-gray-700 mb-3">Recommended To Adjust</h2>
        <div className="space-y-3 mb-24">
          {impactItems.map(item => (
            <div
              key={item.id}
              onClick={() => toggleSelect(item.id)}
              className={`p-5 rounded-[20px] border-2 cursor-pointer transition-all ${
                selected.includes(item.id) 
                  ? 'border-orange-400 bg-orange-50' 
                  : 'border-gray-100'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  item.impact === 'High Impact' ? 'bg-red-100 text-red-700' :
                  item.impact === 'Medium Impact' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {item.impact}
                </span>
              </div>
              <p className="text-base font-semibold text-gray-900">{item.amount}</p>
            </div>
          ))}
        </div>
      </div>

      {/*start simulate button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[395px] mx-auto p-4 bg-white border-t border-gray-100">
        <div className="flex items-center justify-between mb-2 px-2">
          <span className="text-sm text-gray-500">Selected: {selected.length}</span>
        </div>
        <button
          onClick={() => navigate('/simulation')}
          className="w-full bg-[#B47D5A] text-white font-semibold py-4 px-6 rounded-[10px] shadow-md"
        >
          Start Simulate
        </button>
      </div>
    </div>
  );
};

export default SimulationSelectionScreen;