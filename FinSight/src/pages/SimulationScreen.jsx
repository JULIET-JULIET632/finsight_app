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
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleSliderChange = (name, value) => {
    setSliders(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  // Calculate simulated score
  const calculateScore = () => {
    const baseScore = 58;
    const improvement = 
      (sliders.rent * 0.2) + 
      (sliders.stockSpending * 0.15) + 
      (sliders.loanRepayments * 0.3) + 
      (sliders.cashBuffer * 0.1);
    const newScore = Math.min(100, Math.round(baseScore + improvement));
    return newScore;
  };

  const simulatedScore = calculateScore();

  const getSliderColor = (value) => {
    if (value >= 70) return '#10B981';
    if (value >= 40) return '#F59E0B';
    return '#2C6C71';
  };

  const handleClick = () => {
    setIsButtonClicked(true);
    setTimeout(() => setIsButtonClicked(false), 200);
    // Store simulation data in session storage
    sessionStorage.setItem('simulationData', JSON.stringify(sliders));
    sessionStorage.setItem('simulatedScore', simulatedScore);
    navigate('/updated-score');
  };

  const getButtonColor = () => {
    if (isButtonClicked) return '#0F3E3A';
    if (isButtonHovered) return '#1A4A4A';
    return '#2C6C71';
  };

  return (
    <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4" style={{ fontFamily: 'Poppins' }}>
      <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative">
        {/* Header with back arrow */}
        <div className="absolute top-6 left-0 right-0 flex items-center justify-center z-10">
          <button 
            onClick={() => navigate('/simulation-selection')}
            className="absolute left-4 text-xl text-gray-500 hover:text-gray-700 transition-colors duration-200"
            style={{ fontSize: '24px', fontWeight: '300' }}
          >
            &lt;
          </button>
          <h1 className="text-2xl font-semibold" style={{ color: '#01272B', fontFamily: 'Poppins' }}>
            Adjust & Simulate
          </h1>
        </div>

        <div className="px-6 pt-24 pb-12">
          {/* Sliders Section */}
          <div className="space-y-12 mb-12">
            {/* Rent */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-base font-bold text-[#7A5231]">Rent</span>
                <span className="text-base font-medium text-gray-900">{sliders.rent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliders.rent}
                onChange={(e) => handleSliderChange('rent', e.target.value)}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${getSliderColor(sliders.rent)} 0%, ${getSliderColor(sliders.rent)} ${sliders.rent}%, #E5E7EB ${sliders.rent}%, #E5E7EB 100%)`
                }}
              />
            </div>

            {/* Stock Spending */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-base font-bold text-[#7A5231]">Stock Spending</span>
                <span className="text-base font-medium text-gray-900">{sliders.stockSpending}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliders.stockSpending}
                onChange={(e) => handleSliderChange('stockSpending', e.target.value)}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${getSliderColor(sliders.stockSpending)} 0%, ${getSliderColor(sliders.stockSpending)} ${sliders.stockSpending}%, #E5E7EB ${sliders.stockSpending}%, #E5E7EB 100%)`
                }}
              />
            </div>

            {/* Loan Repayments */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-base font-bold text-[#7A5231]">Loan Repayments</span>
                <span className="text-base font-medium text-gray-900">{sliders.loanRepayments}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliders.loanRepayments}
                onChange={(e) => handleSliderChange('loanRepayments', e.target.value)}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${getSliderColor(sliders.loanRepayments)} 0%, ${getSliderColor(sliders.loanRepayments)} ${sliders.loanRepayments}%, #E5E7EB ${sliders.loanRepayments}%, #E5E7EB 100%)`
                }}
              />
            </div>

            {/* Cash Buffer */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-base font-bold text-[#7A5231]">Cash Buffer</span>
                <span className="text-base font-medium text-gray-900">{sliders.cashBuffer}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliders.cashBuffer}
                onChange={(e) => handleSliderChange('cashBuffer', e.target.value)}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${getSliderColor(sliders.cashBuffer)} 0%, ${getSliderColor(sliders.cashBuffer)} ${sliders.cashBuffer}%, #E5E7EB ${sliders.cashBuffer}%, #E5E7EB 100%)`
                }}
              />
            </div>
          </div>

          {/* Simulated Score Container */}
          <div 
            className="flex items-center justify-center mb-12"
            style={{
              width: '300px',
              height: '60px',
              borderRadius: '10px',
              backgroundColor: '#F7C296',
              marginLeft: 'auto',
              marginRight: 'auto',
              boxShadow: 'inset 0 4px 6px -2px rgba(0, 0, 0, 0.25)'
            }}
          >
            <span className="text-base font-bold text-white">Simulated Score: </span>
            <span className="text-2xl font-bold ml-2 text-white">{simulatedScore}</span>
          </div>
          
          {/* See Impact Button */}
          <div className="flex justify-center">
            <button
              onClick={handleClick}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              className="font-semibold py-4 px-6 rounded-[10px] shadow-md text-center transition-all duration-200 transform hover:scale-105 active:scale-95"
              style={{
                width: '250px',
                backgroundColor: getButtonColor(),
                color: 'white',
                fontFamily: 'Poppins'
              }}
            >
              See Impact
            </button>
          </div>
          
          {/* Bottom spacing */}
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
};

export default SimulationScreen;