import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoLong from '../assets/images/logo-long.png';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4">
      <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative">
        <div className="h-[730px] flex items-center justify-center">
          <img src={logoLong} alt="FinSight" className="w-64 h-auto" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;