import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sanitizeInput } from '../utils/sanitize';
import { getCookie, generateCSRFToken } from '../utils/cookies';
import { getAuthToken, verifyToken } from '../utils/token';
import downloadScoreAsPDF from '../utils/download';

const AICoachScreen = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloadHovered, setIsDownloadHovered] = useState(false);
  const [isAssessmentHovered, setIsAssessmentHovered] = useState(false);
  
  const score = 64;
  const businessType = sessionStorage.getItem('businessSector') || 'Business';
  const simulationData = JSON.parse(sessionStorage.getItem('simulationData') || '{}');

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

  // SECURITY MEASURE 4: Handle download with authentication
  const handleDownloadPDF = () => {
    if (!isAuthenticated) {
      setError('Please authenticate before downloading');
      return;
    }

    // SECURITY MEASURE 5: CSRF token regeneration on action
    generateCSRFToken();
    
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

  // SECURITY MEASURE 6: Handle new assessment with token regeneration
  const handleNewAssessment = () => {
    generateCSRFToken();
    // Clear session data but keep authentication
    sessionStorage.removeItem('formData');
    sessionStorage.removeItem('selectedItems');
    sessionStorage.removeItem('simulationData');
    sessionStorage.removeItem('simulationResults');
    navigate('/business-info');
  };

  // Get button color for Download Report (same as other pages)
  const getDownloadButtonColor = () => {
    if (isDownloadHovered) return '#1A4A4A';
    return '#2C6C71';
  };

  // SECURITY MEASURE 7: Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4" style={{ fontFamily: 'Poppins' }}>
        <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative flex items-center justify-center">
          <p className="text-center text-gray-500">Loading AI recommendations...</p>
        </div>
      </div>
    );
  }

  // SECURITY MEASURE 8: Error state
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
        {/* SECURITY MEASURE 9: Back button with CSRF token */}
        <div className="absolute top-6 left-0 right-0 flex items-center justify-center z-10">
          <button 
            onClick={() => {
              generateCSRFToken();
              navigate('/updated-score');
            }}
            className="absolute left-4 text-xl text-gray-500 hover:text-gray-700 transition-colors duration-200"
            style={{ fontSize: '24px', fontWeight: '300' }}
          >
            &lt;
          </button>
          <h1 className="text-xl font-semibold" style={{ color: '#01272B' }}>
            AI Coach Recommendations
          </h1>
        </div>

        <div className="px-5 pt-20 pb-6">
          {/* Subtitle */}
          <p className="text-xs text-gray-500 text-center mb-6">
            Personalised guidance based on your financial profile
          </p>

          {/* Projected Score Card */}
          <div className="bg-[#FFF8F8] rounded-[20px] p-5 mb-8 border-2" style={{ borderColor: '#D9D9D9' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: '#998F8F' }}>Projected Score</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold" style={{ color: '#EFB700' }}>{score}</span>
                <span className="text-xl text-gray-400">/100</span>
              </div>
              <span className="text-sm" style={{ color: '#EFB700' }}>Fairly Good</span>
            </div>
          </div>

          {/* Action Steps Card */}
          <div className="bg-[#FFF8F8] rounded-[20px] p-5 mb-6 border-2" style={{ borderColor: '#D9D9D9' }}>
            <h2 className="text-base font-semibold text-gray-800 mb-3">Action Steps:</h2>
            <div className="space-y-3">
              <p className="text-xs text-gray-700 leading-relaxed">
                <span className="font-bold text-gray-900">1.</span> Focus on reducing your single highest-cost expense within the next 30 days.
              </p>
              <p className="text-xs text-gray-700 leading-relaxed">
                <span className="font-bold text-gray-900">2.</span> Increase monthly revenue by 10% before taking on additional debt.
              </p>
              <p className="text-xs text-gray-700 leading-relaxed">
                <span className="font-bold text-gray-900">3.</span> Build a minimum cash reserve equivalent to 2 months of operating expenses.
              </p>
            </div>
          </div>

          {/* Growth Tips Card */}
          <div className="bg-[#FFF8F8] rounded-[20px] p-5 mb-6 border-2" style={{ borderColor: '#D9D9D9' }}>
            <h2 className="text-base font-semibold text-gray-800 mb-3">Growth Tips:</h2>
            <div className="space-y-3">
              <p className="text-xs text-gray-700 leading-relaxed">
                <span className="font-bold text-gray-900">•</span> Negotiate longer payment terms with your top 3 suppliers this quarter.
              </p>
              <p className="text-xs text-gray-700 leading-relaxed">
                <span className="font-bold text-gray-900">•</span> Audit your product/service pricing against current market rates.
              </p>
              <p className="text-xs text-gray-700 leading-relaxed">
                <span className="font-bold text-gray-900">•</span> Join a local business association for access to group purchasing and training.
              </p>
            </div>
          </div>

          {/* Disclaimer Text */}
          <p className="text-[10px] text-gray-400 text-center leading-relaxed mb-6 px-2">
            These recommendations are generated from your self-reported data. They do not constitute professional financial advice. Consult a qualified financial advisor before making major business decisions.
          </p>

          {/* Buttons Container */}
          <div className="space-y-3">
            {/* Download Report Button - SAME AS OTHER PAGES (10px border radius) */}
            <button
              onClick={handleDownloadPDF}
              onMouseEnter={() => setIsDownloadHovered(true)}
              onMouseLeave={() => setIsDownloadHovered(false)}
              disabled={!isAuthenticated}
              className="w-full font-semibold py-3 px-4 rounded-[10px] shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: getDownloadButtonColor(),
                color: 'white'
              }}
            >
              Download Report
            </button>

            {/* Start New Assessment Button - A LITTLE ROUNDED (15px) */}
            <button
              onClick={handleNewAssessment}
              onMouseEnter={() => setIsAssessmentHovered(true)}
              onMouseLeave={() => setIsAssessmentHovered(false)}
              disabled={!isAuthenticated}
              className="w-full font-semibold py-3 px-4 rounded-[15px] transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-2"
              style={{ 
                backgroundColor: isAssessmentHovered ? '#F5F5F5' : 'white',
                color: '#2C6C71',
                borderColor: '#2C6C71',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              Start New Assessment
            </button>
          </div>

          {/* Bottom spacing */}
          <div className="h-4"></div>
        </div>
      </div>
    </div>
  );
};

export default AICoachScreen;