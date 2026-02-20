import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import downloadScoreAsPDF from '../utils/download';
import { getCookie, setClientCookie, generateCSRFToken } from '../utils/cookies';
import { getAuthToken, verifyToken } from '../utils/token';
import { sanitizeInput } from '../utils/sanitize';

const UpdatedScoreScreen = () => {
  const navigate = useNavigate();
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isDownloadHovered, setIsDownloadHovered] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const score = 75;
  const businessType = sessionStorage.getItem('businessType') || 'Not specified';
  const simulationData = JSON.parse(sessionStorage.getItem('simulationData') || '{}');

  // Check authentication and tokens on component mount
  useEffect(() => {
    const validateSession = async () => {
      try {
        // Check for auth token
        const token = getAuthToken();
        if (!token || !verifyToken(token)) {
          setError('Your session has expired. Please start over.');
          setTimeout(() => navigate('/welcome'), 3000);
          return;
        }

        // Verify CSRF token
        const csrfToken = getCookie('XSRF-TOKEN');
        if (!csrfToken) {
          // Generate new CSRF token if not present
          generateCSRFToken();
        }

        // Sanitize business type
        const sanitizedBusinessType = sanitizeInput(businessType);
        if (sanitizedBusinessType !== businessType) {
          setError('Invalid data detected');
          return;
        }

        setIsAuthenticated(true);
      } catch (err) {
        setError('Authentication failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [navigate, businessType]);

  // Color-oriented function for the score
  const getScoreColor = () => {
    if (score >= 80) return 'text-[#0F3E3A]';
    if (score >= 60) return 'text-[#2C6C71]';
    if (score >= 40) return 'text-[#B47D5A]';
    return 'text-[#B22222]';
  };

  const handleClick = () => {
    setIsButtonClicked(true);
    setTimeout(() => setIsButtonClicked(false), 200);
    
    // Generate new CSRF token for the next action
    generateCSRFToken();
    navigate('/ai-coach');
  };

  const handleDownloadPDF = () => {
    // Validate before download
    if (!isAuthenticated) {
      setError('Please authenticate before downloading');
      return;
    }

    // Sanitize data before passing to PDF generator
    const sanitizedBusinessType = sanitizeInput(businessType);
    const sanitizedScore = parseInt(score) || 0;
    
    downloadScoreAsPDF(
      sanitizedScore, 
      sanitizedBusinessType, 
      new Date().toLocaleDateString(), 
      simulationData
    );
  };

  const getButtonColor = () => {
    if (isButtonClicked) return '#0F3E3A';
    if (isButtonHovered) return '#1A4A4A';
    return '#2C6C71';
  };

  const getDownloadButtonColor = () => {
    if (isDownloadHovered) return '#1A4A4A';
    return '#2C6C71';
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4" style={{ fontFamily: 'Poppins' }}>
        <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative flex items-center justify-center">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
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
        {/* Header with back arrow */}
        <div className="absolute top-6 left-0 right-0 flex items-center justify-center z-10">
          <button 
            onClick={() => navigate('/simulation')}
            className="absolute left-4 text-xl text-gray-500 hover:text-gray-700 transition-colors duration-200"
            style={{ fontSize: '24px', fontWeight: '300' }}
          >
            &lt;
          </button>
          <h1 className="text-2xl font-semibold" style={{ color: '#01272B', fontFamily: 'Poppins' }}>
            Updated Risk Score
          </h1>
        </div>

        <div className="px-6 pt-24 pb-12">
          {/* Score */}
          <div className="flex justify-center mb-6">
            <span className={`text-7xl font-black ${getScoreColor()}`}>75</span>
          </div>
          
          {/* Fairly Good! pill */}
          <div className="flex justify-center mb-8">
            <span 
              className="inline-block py-2 text-sm font-medium text-white text-center"
              style={{ 
                backgroundColor: '#F5B27B',
                borderRadius: '10px',
                paddingLeft: '40px',
                paddingRight: '40px',
                minWidth: '180px'
              }}
            >
              Fairly Good!
            </span>
          </div>

          {/* Potential Benefits */}
          <h2 className="text-base font-medium text-gray-900 mb-4 text-center">Potential Benefits;</h2>
          
          {/* Benefits Card */}
          <div className="bg-[#FFF8F8] rounded-[20px] p-6 shadow-md mb-6">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-medium text-gray-900">1.</span> Borem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-medium text-gray-900">2.</span> Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.
                </p>
              </div>
            </div>
          </div>

          {/* Download Button - PDF only */}
          <div className="flex justify-center mb-4">
            <button
              onClick={handleDownloadPDF}
              onMouseEnter={() => setIsDownloadHovered(true)}
              onMouseLeave={() => setIsDownloadHovered(false)}
              className="text-xs font-medium py-2 px-5 shadow-sm transition-all duration-200 transform hover:scale-105 active:scale-95 tracking-wide"
              style={{ 
                backgroundColor: getDownloadButtonColor(),
                color: 'white', 
                fontFamily: 'Poppins',
                opacity: 0.9,
                letterSpacing: '0.3px',
                border: 'none',
                outline: 'none',
                borderRadius: '10px'
              }}
              disabled={!isAuthenticated}
            >
              DOWNLOAD PDF REPORT
            </button>
          </div>

          {/* Recommendations Button */}
          <button
            onClick={handleClick}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className="w-full font-semibold py-4 px-6 shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
            style={{ 
              backgroundColor: getButtonColor(),
              color: 'white', 
              fontFamily: 'Poppins',
              borderRadius: '10px'
            }}
            disabled={!isAuthenticated}
          >
            Recommendations
          </button>
          
          {/* Bottom spacing */}
          <div className="h-6"></div>
        </div>
      </div>
    </div>
  );
};

export default UpdatedScoreScreen;