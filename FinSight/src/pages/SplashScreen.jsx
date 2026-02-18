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
    <div className="w-[395px] h-[730px] bg-white mx-auto flex items-center justify-center">
      <img src={logoLong} alt="FinSight" className="w-48 h-auto" />
    </div>
  );
};

export default SplashScreen;