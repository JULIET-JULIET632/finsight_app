import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SimulationSelectionScreen = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const impactItems = [
    { id: 1, title: 'Loan Repayments', amount: 'USD 2000 / Month', impact: 'High Impact' },
    { id: 2, title: 'Rent', amount: 'USD 1500 / Month', impact: 'High Impact' },
    { id: 3, title: 'Stock Spending', amount: 'USD 1000 / Month', impact: 'Medium Impact' },
    { id: 4, title: 'Cash Buffer', amount: 'USD 800 / Month', impact: 'Medium Impact' }
  ];

  const toggleSelect = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Current score: 58
  const currentScore = 58;

  return (
    <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4" style={{ fontFamily: 'Poppins' }}>
      <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative">
        {/* Header with back arrow */}
        <div className="absolute top-6 left-0 right-0 flex items-center justify-center z-10">
          <button 
            onClick={() => navigate('/results')}
            className="absolute left-4 text-xl text-gray-500 hover:text-gray-700 transition-colors duration-200"
            style={{ fontSize: '24px', fontWeight: '300' }}
          >
            &lt;
          </button>
          <h1 className="text-xl font-semibold" style={{ color: '#01272B', fontFamily: 'Poppins' }}>
            Choose What To Improve
          </h1>
        </div>

        <div className="px-5 pt-24 pb-20"> {/* Reduced pb-24 to pb-20 */}
          {/* Select areas card - #FFF8F8 */}
          <div className="bg-[#FFF8F8] rounded-[20px] p-5 mb-4 text-center">
            <p className="text-sm text-gray-700 leading-relaxed" style={{ fontFamily: 'Poppins' }}>
              Select areas to make improvements and we'll show you the impact on your score
            </p>
          </div>

          {/* Business Risk Score card - #FFF8F8 */}
          <div className="bg-[#FFF8F8] rounded-[20px] p-5 mb-6">
            <div className="text-center mb-2">
              <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Poppins' }}>Business Risk Score</span>
            </div>
            <div className="flex items-center justify-center gap-1 mb-3">
              <span className="text-4xl font-bold text-[#F3A361]">58</span>
              <span className="text-2xl text-gray-400">/100</span>
            </div>
            
            {/* Warning container - same color as High Impact badges */}
            <div className="flex justify-center mb-3">
              <span 
                className="inline-block px-4 py-1.5 rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: '#F3A361' }}
              >
                Warning!
              </span>
            </div>
            
            <p className="text-xs text-gray-600 text-center leading-relaxed px-2" style={{ fontFamily: 'Poppins' }}>
              Your score is mainly affected by high expenses and low cash buffer
            </p>
          </div>

          {/* Recommended To Adjust - with long dash starting from colon side */}
          <div className="mb-4">
            <h2 className="text-base font-medium text-gray-800 mb-3" style={{ fontFamily: 'Poppins' }}>
              Recommended To Adjust
            </h2>
            <div className="flex items-center">
              <p className="text-xs text-black font-medium whitespace-nowrap" style={{ fontFamily: 'Poppins' }}>
                High Impact on your score:
              </p>
              <div className="flex-1 ml-2">
                <div className="h-px bg-gray-400 w-full"></div>
              </div>
            </div>
          </div>
          
          {/* Impact Cards - #D9D9D9 - REDUCED SPACE AT BOTTOM */}
          <div className="space-y-3 mb-4"> {/* Reduced from mb-24 to mb-4 */}
            {impactItems.map(item => (
              <div
                key={item.id}
                onClick={() => toggleSelect(item.id)}
                className="p-4 rounded-[15px] cursor-pointer transition-all duration-200 border-2"
                style={{ 
                  backgroundColor: '#D9D9D9',
                  borderColor: selected.includes(item.id) ? '#F3A361' : '#D9D9D9'
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Tick box - WHITE BACKGROUND ONLY */}
                  <div 
                    className="w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 transition-colors duration-200 bg-white"
                    style={{ 
                      borderColor: selected.includes(item.id) ? '#F3A361' : '#888',
                    }}
                  >
                    {selected.includes(item.id) && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 2" stroke="#F3A361" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-medium text-gray-800" style={{ fontFamily: 'Poppins' }}>
                        {item.title}
                      </h3>
                      {/* Impact badge - #F3A361 for High Impact, lighter for Medium */}
                      <span 
                        className="text-xs px-3 py-1 rounded-full font-medium text-white"
                        style={{ 
                          backgroundColor: item.impact === 'High Impact' ? '#F3A361' : '#F5B27B',
                          fontSize: '10px'
                        }}
                      >
                        {item.impact}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{item.amount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed Bottom Section - NO LINE ABOVE, just button */}
        <div className="absolute bottom-0 left-0 right-0 bg-white p-4"> {/* Removed border-t */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600" style={{ fontFamily: 'Poppins' }}>
              Selected: {selected.length}
            </span>
            <button
              onClick={() => navigate('/simulation')}
              className="font-semibold py-3 px-8 rounded-[10px] shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
              style={{ 
                backgroundColor: '#2C6C71',
                color: 'white',
                fontFamily: 'Poppins'
              }}
            >
              Start Simulate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationSelectionScreen;