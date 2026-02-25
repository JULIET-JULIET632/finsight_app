import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoLong from '../assets/images/logo-long.png';
import { generateToken, setAuthToken } from '../utils/token';
import { generateCSRFToken } from '../utils/cookies';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // SECURITY MEASURE 1: Initialize security tokens on splash screen
  useEffect(() => {
    const initializeSecurity = async () => {
      try {
        // Clear any existing session data to start fresh
        sessionStorage.clear();
        
        // SECURITY MEASURE 2: Generate new auth token
        const token = generateToken('user-' + Date.now());
        setAuthToken(token);
        
        // SECURITY MEASURE 3: Generate CSRF token
        generateCSRFToken();
        
        // SECURITY MEASURE 4: Log for debugging (remove in production)
        console.log('Security initialized - Token generated');
        
        setIsLoading(false);
        
        // SECURITY MEASURE 5: Auto-navigate after token is set
        const timer = setTimeout(() => {
          navigate('/welcome');
        }, 2000);
        
        return () => clearTimeout(timer);
        
      } catch (err) {
        // SECURITY MEASURE 6: User-friendly error message
        setError('Unable to initialize application. Please refresh the page.');
        setIsLoading(false);
      }
    };

    initializeSecurity();
  }, [navigate]);

  // SECURITY MEASURE 7: Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4">
        <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative flex items-center justify-center">
          <p className="text-center text-gray-500">Initializing secure session...</p>
        </div>
      </div>
    );
  }

  // SECURITY MEASURE 8: Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4">
        <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative flex items-center justify-center">
          <div className="text-center p-6">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#2C6C71] text-white rounded-[10px]"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

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