import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sanitizeInput } from '../utils/sanitize';
import { getCookie, generateCSRFToken } from '../utils/cookies';
import { getAuthToken, verifyToken } from '../utils/token';

const UpdatedScoreScreen = () => {
  const navigate = useNavigate();
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const score = 65;
  const beforeScore = 81;
  const afterScore = 64;

  // SECURITY MEASURE 1: Authentication check on mount
  useEffect(() => {
    const validateSession = async () => {
      try {
        const token = getAuthToken();
        if (!token || !verifyToken(token)) {
          setError('Your session has expired. Please start over.');
          setTimeout(() => navigate('/welcome'), 3000);
          return;
        }

        // SECURITY MEASURE 2: CSRF token verification
        const csrfToken = getCookie('XSRF-TOKEN');
        if (!csrfToken) {
          generateCSRFToken();
        }

        setIsAuthenticated(true);
      } catch (err) {
        // SECURITY MEASURE 3: User-friendly error messages
        setError('Authentication failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [navigate]);

  // Get circle color based on score
  const getCircleColor = () => {
    if (score >= 80) return '#10B981'; // green
    if (score >= 60) return '#EFB700'; // gold/yellow
    if (score >= 40) return '#F97316'; // orange
    return '#EF4444'; // red
  };

  // Calculate conic gradient for circle fill based on score percentage
  const getCircleGradient = () => {
    const percentage = score; // score is out of 100
    const baseColor = getCircleColor();
    const emptyColor = '#E5E7EB'; // light gray
    
    if (percentage >= 100) {
      return baseColor;
    }
    return `conic-gradient(${baseColor} 0deg ${percentage * 3.6}deg, ${emptyColor} ${percentage * 3.6}deg 360deg)`;
  };

  const handleClick = () => {
    // SECURITY MEASURE 4: CSRF token regeneration on navigation
    generateCSRFToken();
    navigate('/ai-coach');
  };

  const getButtonColor = () => {
    if (isButtonHovered) return '#1A4A4A';
    return '#2C6C71';
  };

  // SECURITY MEASURE 5: Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4" style={{ fontFamily: 'Poppins' }}>
        <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative flex items-center justify-center">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // SECURITY MEASURE 6: Error state with user-friendly message
  if (error) {
    return (
      <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4" style={{ fontFamily: 'Poppins' }}>
        <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative flex items-center justify-center">
          <div className="text-center p-6">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => navigate('/welcome')}
              className="px-4 py-2 bg-[#2C6C71] text-white rounded-[10px]"
            >
              Go to Welcome
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4" style={{ fontFamily: 'Poppins' }}>
      <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative">
        {/* SECURITY MEASURE 7: CSRF token on back navigation */}
        <div className="absolute top-6 left-0 right-0 flex items-center justify-center z-10">
          <button 
            onClick={() => {
              generateCSRFToken();
              navigate('/simulation');
            }}
            className="absolute left-4 text-xl text-gray-500 hover:text-gray-700 transition-colors duration-200"
            style={{ fontSize: '24px', fontWeight: '300' }}
          >
            &lt;
          </button>
          <h1 className="text-2xl font-semibold" style={{ color: '#01272B' }}>
            Updated Health Score
          </h1>
        </div>

        <div className="px-6 pt-24 pb-8">
          {/* Score Circle - Same as Results Screen */}
          <div className="flex justify-center items-center mb-4">
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center relative"
              style={{ 
                background: score >= 100 ? getCircleColor() : getCircleGradient(),
                padding: '4px'
              }}
            >
              {/* Inner white circle for clean background */}
              <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-[#2C6C71]">{score}</span>
                <span className="text-xs text-gray-400">/100</span>
              </div>
            </div>
          </div>
          
          {/* Fairly Good and +3pts on same line with borders */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span 
              className="text-lg font-medium px-4 py-1.5 rounded-full border-2"
              style={{ 
                color: '#EFB700',
                borderColor: '#EFB700',
                backgroundColor: 'transparent'
              }}
            >
              Fairly Good
            </span>
            <span 
              className="text-lg font-bold px-4 py-1.5 rounded-full border-2"
              style={{ 
                color: '#12AE00',
                borderColor: '#12AE00',
                backgroundColor: 'transparent'
              }}
            >
              +3pts
            </span>
          </div>

          {/* Before Vs After Card with Border #998F8F */}
          <div className="border-2 rounded-[20px] p-5 mb-8" style={{ borderColor: '#998F8F' }}>
            <h2 className="text-base font-medium mb-3" style={{ color: '#998F8F' }}>Before Vs After</h2>
            
            {/* Before Simulation Dash */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm" style={{ color: '#D9D9D9' }}>Before Simulation</span>
                <span className="text-sm font-semibold" style={{ color: '#998F8F' }}>{beforeScore}/100</span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#D9D9D9' }}>
                <div 
                  className="h-full rounded-full" 
                  style={{ 
                    width: `${beforeScore}%`,
                    backgroundColor: '#998F8F'
                  }}
                ></div>
              </div>
            </div>
            
            {/* After Simulation Dash */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm" style={{ color: '#D9D9D9' }}>After Simulation</span>
                <span className="text-sm font-semibold" style={{ color: '#12AE00' }}>{afterScore}/100</span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#D9D9D9' }}>
                <div 
                  className="h-full rounded-full" 
                  style={{ 
                    width: `${afterScore}%`,
                    backgroundColor: '#12AE00'
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Potential Benefits Card */}
          <div className="bg-[#FFF8F8] rounded-[20px] p-6 mb-6 border-2" style={{ borderColor: '#D9D9D9' }}>
            <h2 className="text-base font-medium text-gray-900 mb-4 text-center">Potential Benefits;</h2>
            <div className="space-y-4 text-center">
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-medium text-gray-900">1.</span> A more stable foundation to build upon.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-medium text-gray-900">2.</span> Reduced risk of defaulting on existing obligations.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-medium text-gray-900">3.</span> First steps toward long-term financial sustainability.
              </p>
            </div>
          </div>

          {/* View Recommendations Button - ONE LINE with reduced font size */}
          <div className="flex justify-center">
            <button
              onClick={handleClick}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              disabled={!isAuthenticated}
              className="font-semibold py-3 px-6 shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              style={{ 
                backgroundColor: getButtonColor(),
                color: 'white', 
                borderRadius: '10px',
                width: 'auto',
                minWidth: '180px',
                fontSize: '14px' // Reduced font size to fit in one line
              }}
            >
              View Recommendations
            </button>
          </div>
          
          {/* Bottom spacing */}
          <div className="h-4"></div>
        </div>
      </div>
    </div>
  );
};

export default UpdatedScoreScreen;