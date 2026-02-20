import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResultsDashboard = () => {
  const navigate = useNavigate();
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // Score: 62
  const score = 62;

  // Circle color based on score
  const getCircleColor = () => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Text color based on score
  const getTextColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  // Status text based on score
  const getStatusText = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Needs Improvement';
    if (score >= 40) return 'Warning';
    return 'At Risk';
  };

  const handleClick = () => {
    setIsButtonClicked(true);
    setTimeout(() => setIsButtonClicked(false), 200);
    navigate('/simulation-selection');
  };

  const getButtonColor = () => {
    if (isButtonClicked) return '#0F3E3A';
    if (isButtonHovered) return '#1A4A4A';
    return '#2C6C71';
  };

  return (
    <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4" style={{ fontFamily: 'Poppins' }}>
      <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative">
        {/* Header with back arrow and title side by side */}
        <div className="absolute top-6 left-0 right-0 flex items-center justify-center z-10">
          <button 
            onClick={() => navigate('/business-info')}
            className="absolute left-4 text-xl text-gray-500 hover:text-gray-700 transition-colors duration-200"
            style={{ fontSize: '24px', fontWeight: '300' }}
          >
            &lt;
          </button>
          <h1 className="text-xl font-semibold" style={{ color: '#01272B', fontFamily: 'Poppins' }}>
            Your Business Risk Score
          </h1>
        </div>

        <div className="px-4 pt-24 pb-12">
          {/* Score Circle */}
          <div className="flex justify-center mb-5">
            <div className={`w-32 h-32 rounded-full ${getCircleColor()} flex items-center justify-center`}>
              <span className="text-4xl font-bold text-[#01272B]">{score}</span>
            </div>
          </div>
          
          {/* Status Text */}
          <div className="flex justify-center mb-10">
            <span className={`text-base font-medium ${getTextColor()}`}>{getStatusText()}</span>
          </div>

          {/* Divider line */}
          <hr className="border-t border-gray-200 mb-8" />

          {/* "Your score explained;" */}
          <h2 className="text-base font-medium text-gray-900 mb-5 text-center">Your score explained;</h2>
          
          {/* Card with text */}
          <div className="bg-[#FFF8F8] rounded-[20px] p-6 mb-10">
            <div className="space-y-4">
              <p className="text-sm text-black text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className="text-sm text-black text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className="text-sm text-black text-center">Lorem ipsum dolor sit amet, consectetur adipiscing eli.</p>
              <p className="text-sm text-black text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          </div>

          {/* Simulate Improvements Button */}
          <div className="flex justify-center">
            <button
              onClick={handleClick}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              className="font-semibold shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
              style={{
                width: '256px',
                height: '58px',
                borderRadius: '20px',
                paddingTop: '14px',
                paddingRight: '20px',
                paddingBottom: '14px',
                paddingLeft: '20px',
                backgroundColor: getButtonColor(),
                color: 'white',
                fontFamily: 'Poppins'
              }}
            >
              Simulate Improvements
            </button>
          </div>
          
          {/* Bottom spacing */}
          <div className="h-6"></div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;