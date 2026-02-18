import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SimulationScreen = () => {
  const navigate = useNavigate();
  const [sliders, setSliders] = useState({
    rent: 0,
    stockSpending: 0,
    loanRepayments: 0,
    cashBuffer: 0
  });

  const handleSliderChange = (name, value) => {
    setSliders(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  return (
    <div className="w-[395px] min-h-screen bg-white mx-auto pb-8">
      {/*back to simulation selection*/}
      <button 
        onClick={() => navigate('/simulation-selection')}
        className="absolute top-4 left-4 text-sm text-gray-500 hover:text-gray-700"
      >
        ← Back
      </button>

      <div className="px-4 pt-16">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Adjust & Simulate</h1>
        
        {/*sliders*/}
        <div className="space-y-6 mb-8">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Rent:</span>
              <span className="text-sm font-medium text-gray-900">{sliders.rent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliders.rent}
              onChange={(e) => handleSliderChange('rent', e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Stock Spending:</span>
              <span className="text-sm font-medium text-gray-900">{sliders.stockSpending}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliders.stockSpending}
              onChange={(e) => handleSliderChange('stockSpending', e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Loan Repayments:</span>
              <span className="text-sm font-medium text-gray-900">{sliders.loanRepayments}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliders.loanRepayments}
              onChange={(e) => handleSliderChange('loanRepayments', e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Cash Buffer:</span>
              <span className="text-sm font-medium text-gray-900">{sliders.cashBuffer}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliders.cashBuffer}
              onChange={(e) => handleSliderChange('cashBuffer', e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/*see updated score button*/}
        <button
          onClick={() => navigate('/updated-score')}
          className="w-full bg-[#B47D5A] text-white font-semibold py-4 px-6 rounded-[10px] shadow-md mb-8"
        >
          See Updated Score
        </button>

        {/*uodated reslts preview*/}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Updated Results</h2>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-8">
          <div className="text-5xl font-bold text-green-600 mb-4">75</div>
          
          <h3 className="text-base font-medium text-gray-900 mb-3">Potential Benefits:</h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">1. Borrow ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.</p>
            <p className="text-sm text-gray-600">2. Closes option tincidunt sociosqu ad nostra, per inceptos himenaeos. Curabitur tempus urna ut turpis condimentum lobortis.</p>
            <p className="text-sm text-gray-600">3. Ut commodo efficitur neque.</p>
          </div>
        </div>

        {/*action steps*/}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Action Steps:</h2>
        <div className="space-y-3 mb-8">
          <p className="text-sm text-gray-600">1. Torem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.</p>
          <p className="text-sm text-gray-600">2. Closes option tincidunt sociosqu ad nostra, per inceptos himenaeos. Curabitur tempus urna ut turpis condimentum lobortis.</p>
          <p className="text-sm text-gray-600">3. Ut commodo efficitur neque.</p>
        </div>
      </div>
    </div>
  );
};

export default SimulationScreen;