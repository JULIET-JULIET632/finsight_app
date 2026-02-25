import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sanitizeInput } from '../utils/sanitize';
import { getCookie, generateCSRFToken } from '../utils/cookies';
import { getAuthToken, verifyToken } from '../utils/token';

const ResultsDashboard = () => {
  const navigate = useNavigate();
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(65);
  const [currency, setCurrency] = useState('KES');
  const [businessSector, setBusinessSector] = useState('');

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

        // Get currency and business sector from session storage
        const storedCurrency = sessionStorage.getItem('currency');
        const storedSector = sessionStorage.getItem('businessSector');
        
        if (storedCurrency) {
          setCurrency(sanitizeInput(storedCurrency));
        }
        
        if (storedSector) {
          setBusinessSector(sanitizeInput(storedSector));
        }

        // In a real app, you would fetch the actual score from an API with HTTPS
        // const response = await fetch('https://api.finsight.com/get-score', {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'X-CSRF-Token': csrfToken,
        //     'Content-Type': 'application/json'
        //   }
        // });
        
        // if (response.ok) {
        //   const data = await response.json();
        //   setScore(sanitizeInput(data.score));
        // } else {
        //   setError('Unable to fetch your score. Please try again.');
        // }

        setIsAuthenticated(true);
      } catch (err) {
        // User-friendly error message - no technical details exposed
        setError('Authentication failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [navigate]);

  // Score breakdown data with percentages
  const scoreBreakdown = [
    { label: 'Cash position', score: 15, max: 25, percentage: 60 },
    { label: 'Profit Margin', score: 5, max: 30, percentage: 17 },
    { label: 'Asset vs Debt', score: 22, max: 25, percentage: 88 },
    { label: 'Debt Coverage', score: 20, max: 20, percentage: 100 }
  ];

  // Function to determine color based on percentage
  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  // Get bar color based on percentage
  const getBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Get circle color based on score
  const getCircleBaseColor = () => {
    if (score >= 80) return '#10B981'; // green
    if (score >= 60) return '#F59E0B'; // yellow/orange
    if (score >= 40) return '#F97316'; // orange
    return '#EF4444'; // red
  };

  // Get pill color for Needs Improvement
  const getNeedsImprovementColor = () => {
    if (score >= 80) return '#10B981'; // green
    if (score >= 60) return '#F59E0B'; // yellow/orange
    if (score >= 40) return '#F97316'; // orange
    return '#EF4444'; // red
  };

  // Get background color for score pills
  const getPillColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-100 text-green-700';
    if (percentage >= 60) return 'bg-yellow-100 text-yellow-700';
    if (percentage >= 40) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  // Calculate conic gradient for circle fill based on score percentage
  const getCircleGradient = () => {
    const percentage = score; // score is out of 100
    const baseColor = getCircleBaseColor();
    const emptyColor = '#E5E7EB'; // light gray
    
    if (percentage >= 100) {
      return baseColor;
    }
    return `conic-gradient(${baseColor} 0deg ${percentage * 3.6}deg, ${emptyColor} ${percentage * 3.6}deg 360deg)`;
  };

  const handleClick = () => {
    // Generate new CSRF token for the next action
    generateCSRFToken();
    
    setIsButtonClicked(true);
    setTimeout(() => setIsButtonClicked(false), 200);
    navigate('/simulation-selection');
  };

  const getButtonColor = () => {
    if (isButtonClicked) return '#0F3E3A';
    if (isButtonHovered) return '#1A4A4A';
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

  // Show error state with user-friendly message
  if (error) {
    return (
      <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4" style={{ fontFamily: 'Poppins' }}>
        <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative flex items-center justify-center">
          <div className="text-center p-6">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => navigate('/welcome')}
              className="px-4 py-2 bg-[#2C6C71] text-white rounded-[10px] hover:bg-[#1A4A4A] transition-colors duration-200"
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

        <div className="px-6 pt-24 pb-8">
          {/* Score Circle with "Out of 100" INSIDE */}
          <div className="flex justify-center items-center mb-4">
            <div 
              className="w-36 h-36 rounded-full flex flex-col items-center justify-center relative"
              style={{ 
                background: score >= 100 ? getCircleBaseColor() : getCircleGradient(),
                padding: '4px'
              }}
            >
              {/* Inner white circle for clean background */}
              <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-[#2C6C71] leading-tight">{score}</span>
                <span className="text-xs text-gray-400">Out of 100</span>
              </div>
            </div>
          </div>
          
          {/* Needs Improvement - ROUNDED RECTANGLE with colored stroke */}
          <div className="flex justify-center mb-8">
            <div 
              className="px-6 py-2 rounded-full"
              style={{ 
                border: `2px solid ${getNeedsImprovementColor()}`,
                backgroundColor: 'transparent'
              }}
            >
              <span className="text-sm font-medium" style={{ color: getNeedsImprovementColor() }}>
                Needs Improvement
              </span>
            </div>
          </div>

          {/* Score Breakdown Section */}
          <h2 className="text-base font-semibold mb-4" style={{ color: '#998F8F' }}>Score Breakdown</h2>
          
          {/* Score Breakdown Card - #FFF8F8 with visual bars */}
          <div className="bg-[#FFF8F8] rounded-[20px] p-5 mb-8">
            <div className="space-y-5">
              {scoreBreakdown.map((item, index) => {
                const barColor = getBarColor(item.percentage);
                const percentage = item.percentage;
                
                return (
                  <div key={index} className="space-y-2">
                    {/* Label and values row */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{item.label}</span>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${getScoreColor(item.percentage)}`}>
                          {item.score}/{item.max}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full min-w-[45px] text-center ${getPillColor(item.percentage)}`}>
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Visual bar representation */}
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${barColor}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Currency and Business Sector Info (non-sensitive) */}
          {currency && businessSector && (
            <div className="text-xs text-gray-400 text-center mb-2">
              {businessSector} • {currency}
            </div>
          )}

          {/* Divider */}
          <hr className="border-t border-gray-200 mb-6" />

          {/* "Your score explained;" - CENTERED */}
          <h2 className="text-base font-medium text-gray-900 mb-4 text-center">Your score explained;</h2>
          
          {/* Explanation text card - #FFF8F8 */}
          <div className="bg-[#FFF8F8] rounded-[20px] p-5 mb-10">
            <div className="space-y-3 text-center">
              <p className="text-sm text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>

          {/* Simulate Improvements Button */}
          <div className="flex justify-center">
            <button
              onClick={handleClick}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              disabled={!isAuthenticated}
              className="font-semibold shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                width: '220px',
                height: '48px',
                borderRadius: '10px',
                backgroundColor: getButtonColor(),
                color: 'white',
                fontFamily: 'Poppins',
                fontSize: '14px'
              }}
            >
              Simulate Improvements
            </button>
          </div>
          
          {/* Bottom spacing */}
          <div className="h-4"></div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;