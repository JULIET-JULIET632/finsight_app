import React from 'react';
import { useNavigate } from 'react-router-dom';

const ResultsDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="w-[395px] min-h-screen bg-white mx-auto">
      {/*back to welcome page*/}
      <button 
        onClick={() => navigate('/welcome')}
        className="absolute top-4 left-4 text-sm text-gray-500 hover:text-gray-700"
      >
        ← Back
      </button>

      <div className="px-4 pt-16">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Your Business Health Score</h1>
        
        {/* Score Card */}
        <div className="bg-white rounded-[20px] p-8 shadow-lg border border-gray-100 mb-8">
          <div className="text-7xl font-bold text-gray-900 mb-2 text-center">62</div>
          <div className="text-base font-medium text-yellow-600 mb-3 text-center">Needs Improvement</div>
        </div>

        {/*core explanation*/}
        <h2 className="text-base font-medium text-gray-900 mb-4">Your core explained:</h2>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 mt-2 bg-gray-300 rounded-full flex-shrink-0"></div>
            <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 mt-2 bg-gray-300 rounded-full flex-shrink-0"></div>
            <p className="text-sm text-gray-600">Horem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 mt-2 bg-gray-300 rounded-full flex-shrink-0"></div>
            <p className="text-sm text-gray-600">Horem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 mt-2 bg-gray-300 rounded-full flex-shrink-0"></div>
            <p className="text-sm text-gray-600">Horem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>

        {/*button text*/}
        <button
          onClick={() => navigate('/simulation-selection')}
          className="w-full bg-[#B47D5A] text-white font-semibold py-4 px-6 rounded-[10px] shadow-md"
        >
          See What You Can Improve
        </button>
      </div>
    </div>
  );
};

export default ResultsDashboard;