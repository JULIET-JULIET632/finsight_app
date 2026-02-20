import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoLong from '../assets/images/logo-long.png';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleClick = () => {
    setIsButtonClicked(true);
    setTimeout(() => setIsButtonClicked(false), 200);
    navigate('/business-info');
  };

  const getButtonColor = () => {
    if (isButtonClicked) return '#B3763F'; // Darker orange when clicked
    if (isButtonHovered) return '#D48C4D'; // Dark orange when hovered
    return '#F3A361'; // Original orange
  };

  return (
    <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4" style={{ fontFamily: 'Poppins' }}>
      <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative">
        {/* Header with back arrow */}
        <div className="absolute top-4 left-0 right-0 flex items-center z-10">
          <button 
            onClick={() => navigate('/')}
            className="absolute left-4 text-xl text-gray-500 hover:text-gray-700 transition-colors duration-200"
            style={{ fontSize: '24px', fontWeight: '300' }}
          >
            &lt;
          </button>
        </div>

        <div className="px-6 pt-16 pb-8">
          {/* Logo CENTERED */}
          <div className="flex justify-center pt-12">
            <img src={logoLong} alt="FinSight" className="w-48 h-auto" />
          </div>

          {/* Main Content */}
          <div className="flex flex-col items-center justify-center px-6 mt-8">
            <h2 className="text-2xl font-bold text-center leading-tight mb-12" style={{ color: '#2C5F5F' }}>
              Check your business<br />health in minutes!
            </h2>
            
            {/* Start Health Check Button with hover and click effects */}
            <button
              onClick={handleClick}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              className="w-full font-semibold py-4 px-6 rounded-[10px] shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
              style={{ 
                backgroundColor: getButtonColor(),
                color: 'white', 
                fontFamily: 'Poppins',
                transition: 'background-color 0.2s, transform 0.1s'
              }}
            >
              Start Health Check
            </button>
          </div>

          {/* Bottom text */}
          <div className="pb-4 text-center mt-12">
            <p className="text-xs" style={{ 
              color: '#6B7280',
              textShadow: '0 2px 4px rgba(0,0,0,0.08)'
            }}>
              No login required. Your data is private
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;