import React from 'react';
import { useNavigate } from 'react-router-dom';

const AICoachScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="w-[395px] min-h-screen bg-white mx-auto pb-8">
      {/*back to updated score and home button*/}
      <div className="flex justify-between items-center absolute top-4 left-4 right-4">
        <button 
          onClick={() => navigate('/updated-score')}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back
        </button>
        <button 
          onClick={() => navigate('/welcome')}
          className="text-sm text-[#B47D5A] hover:opacity-80"
        >
          Home
        </button>
      </div>

      <div className="px-4 pt-16">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">AI Coach Recommendations</h1>
        
        {/* AI coach*/}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h2 className="text-base font-medium text-gray-900 mb-3">Actions:</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">1. Torem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.</p>
              <p className="text-sm text-gray-600">2. Closes option tincidunt sociosqu ad nostra, per inceptos himenaeos. Curabitur tempus urna ut turpis condimentum lobortis.</p>
              <p className="text-sm text-gray-600">3. Ut commodo efficitur neque.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h2 className="text-base font-medium text-gray-900 mb-3">Recommendations:</h2>
            <div className="space-y-4">
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

          <div className="bg-gray-50 rounded-xl p-5">
            <h2 className="text-base font-medium text-gray-900 mb-3">Coach Note:</h2>
            <p className="text-sm text-gray-600 italic">
              "Based on your financial data, focusing on reducing loan repayments and optimizing inventory will have the fastest impact on your health score."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoachScreen;