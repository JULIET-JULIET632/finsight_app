import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AICoachScreen = () => {
  const navigate = useNavigate();
  const [isHomeHovered, setIsHomeHovered] = useState(false);

  return (
    <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4" style={{ fontFamily: 'Poppins' }}>
      <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative">
        {/* Home button with hover effect */}
        <button 
          onClick={() => navigate('/welcome')}
          onMouseEnter={() => setIsHomeHovered(true)}
          onMouseLeave={() => setIsHomeHovered(false)}
          className="absolute top-3 right-4 text-sm font-medium z-20 transition-all duration-200"
          style={{ 
            color: isHomeHovered ? '#1A4A4A' : '#2C6C71',
            fontFamily: 'Poppins',
            transform: isHomeHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          Home
        </button>

        {/* Header with back arrow and title */}
        <div className="absolute top-6 left-0 right-0 flex items-center justify-center z-10">
          <button 
            onClick={() => navigate('/updated-score')}
            className="absolute left-4 text-xl text-gray-500 hover:text-gray-700 transition-colors duration-200"
            style={{ fontSize: '24px', fontWeight: '300' }}
          >
            &lt;
          </button>
          <h1 className="text-xl font-semibold" style={{ color: '#01272B', fontFamily: 'Poppins' }}>
            AI Coach Recommendations
          </h1>
        </div>

        <div className="px-4 pt-28 pb-12">
          {/* AI Coach Content */}
          <div className="space-y-8">
            {/* Actions Card */}
            <div className="bg-[#FFF8F8] rounded-[20px] p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-medium text-gray-900 mb-4">Actions:</h2>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-medium text-gray-900">1.</span> Torem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-medium text-gray-900">2.</span> Closes option tincidunt sociosqu ad nostra, per inceptos himenaeos. Curabitur tempus urna ut turpis condimentum lobortis.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-medium text-gray-900">3.</span> Ut commodo efficitur neque.
                </p>
              </div>
            </div>

            {/* Recommendations Card */}
            <div className="bg-[#FFF8F8] rounded-[20px] p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-medium text-gray-900 mb-4">Recommendations:</h2>
              <div className="space-y-5">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Short-term:</h3>
                  <p className="text-sm text-gray-600">Reduce discretionary spending by 15% to improve cash flow immediately.</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Medium-term:</h3>
                  <p className="text-sm text-gray-600">Renegotiate supplier contracts to lower cost of goods sold.</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Long-term:</h3>
                  <p className="text-sm text-gray-600">Build emergency fund covering 3-6 months of operating expenses.</p>
                </div>
              </div>
            </div>

            {/* Coach Note Card - update text if needed */}
                <div className="bg-[#FFF8F8] rounded-[20px] p-6 shadow-sm border border-gray-100">
                <h2 className="text-base font-medium text-gray-900 mb-3">Coach Note:</h2>
                <p className="text-sm text-gray-600 italic leading-relaxed">
                    "Based on your financial data, focusing on reducing loan repayments and optimizing inventory will have the fastest impact on your risk score."
                </p>
                </div>
          </div>
          
          {/* Bottom spacing */}
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
};

export default AICoachScreen;