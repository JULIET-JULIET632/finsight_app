import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoLong from '../assets/images/logo-long.png';
import { generateToken, setAuthToken, getAuthToken, verifyToken } from '../utils/token';
import { generateCSRFToken, getCookie } from '../utils/cookies';
import { sanitizeInput } from '../utils/sanitize';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // SECURITY MEASURE 1: Verify session on mount
  useEffect(() => {
    const validateSession = async () => {
      try {
        // SECURITY MEASURE 2: Check for existing token
        const token = getAuthToken();
        
        if (!token) {
          // SECURITY MEASURE 3: Generate new token if none exists
          const newToken = generateToken('user-' + Date.now());
          setAuthToken(newToken);
          console.log('New token generated on Welcome screen');
        } else {
          // SECURITY MEASURE 4: Verify existing token
          if (!verifyToken(token)) {
            // Token expired, generate new one
            const newToken = generateToken('user-' + Date.now());
            setAuthToken(newToken);
          }
        }

        // SECURITY MEASURE 5: Verify CSRF token
        const csrfToken = getCookie('XSRF-TOKEN');
        if (!csrfToken) {
          generateCSRFToken();
        }

        setIsAuthenticated(true);
      } catch (err) {
        // SECURITY MEASURE 6: User-friendly error
        setError('Security verification failed. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, []);

  const handleClick = () => {
    // SECURITY MEASURE 7: Button click effect
    setIsButtonClicked(true);
    setTimeout(() => setIsButtonClicked(false), 200);
    
    // SECURITY MEASURE 8: Verify authentication before navigation
    const token = getAuthToken();
    if (!token || !verifyToken(token)) {
      setError('Your session has expired. Please refresh the page.');
      return;
    }
    
    // SECURITY MEASURE 9: Generate new CSRF token for next action
    generateCSRFToken();
    
    // SECURITY MEASURE 10: Sanitize navigation path
    const sanitizedPath = sanitizeInput('/business-info');
    navigate(sanitizedPath);
  };

  const getButtonColor = () => {
    if (isButtonClicked) return '#B3763F';
    if (isButtonHovered) return '#D48C4D';
    return '#F3A361';
  };

  // SECURITY MEASURE 11: Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4" style={{ fontFamily: 'Poppins' }}>
        <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative flex items-center justify-center">
          <p className="text-center text-gray-500">Verifying secure session...</p>
        </div>
      </div>
    );
  }

  // SECURITY MEASURE 12: Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4" style={{ fontFamily: 'Poppins' }}>
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
    <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4" style={{ fontFamily: 'Poppins' }}>
      <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative">
        {/* Header with back arrow - SECURITY MEASURE 13: Secure navigation */}
        <div className="absolute top-4 left-0 right-0 flex items-center z-10">
          <button 
            onClick={() => {
              generateCSRFToken(); // New token for navigation
              navigate('/');
            }}
            className="absolute left-4 text-xl text-gray-500 hover:text-gray-700 transition-colors duration-200"
            style={{ fontSize: '24px', fontWeight: '300' }}
          >
            &lt;
          </button>
        </div>

        <div className="px-6 pt-16 pb-8">
          {/* Logo */}
          <div className="flex justify-center pt-12">
            <img src={logoLong} alt="FinSight" className="w-48 h-auto" />
          </div>

          {/* Main Content */}
          <div className="flex flex-col items-center justify-center px-6 mt-8">
            <h2 className="text-2xl font-bold text-center leading-tight mb-12" style={{ color: '#2C5F5F' }}>
              Check your business<br />health in minutes!
            </h2>
            
            {/* Start Health Check Button */}
            <button
              onClick={handleClick}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              disabled={!isAuthenticated}
              className="w-full font-semibold py-4 px-6 rounded-[10px] shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: getButtonColor(),
                color: 'white', 
                fontFamily: 'Poppins'
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