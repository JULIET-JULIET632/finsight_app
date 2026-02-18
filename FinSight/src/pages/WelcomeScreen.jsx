import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoLong from '../assets/images/logo-long.png';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="w-[395px] h-[730px] bg-white mx-auto flex flex-col">
      {/*Logo*/}
      <div className="flex justify-center pt-20"> {/* INCREASED from pt-12 to pt-20 */}
        <img src={logoLong} alt="FinSight" className="w-48 h-auto" />
      </div>

      {/*main content*/}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-16">
        <h2 className="text-2xl font-bold text-center leading-tight mb-12" style={{ color: '#2C5F5F' }}>
          Check your business<br />health in minutes!
        </h2>
        
        <button 
          onClick={() => navigate('/business-info')}
          className="w-full bg-[#B47D5A] text-white font-semibold py-4 px-6 rounded-[10px] shadow-md"
        >
          Start Health Check
        </button>
      </div>

      {/*bottom text with shadow*/}
      <div className="pb-8 text-center">
        <p className="text-xs" style={{ 
          color: '#6B7280',
          textShadow: '0 2px 4px rgba(0,0,0,0.08)'
        }}>
          No login required. Your data is private
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;