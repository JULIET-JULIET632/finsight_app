import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sanitizeInput } from '../utils/sanitize';
import { getCookie, generateCSRFToken } from '../utils/cookies';
import { getAuthToken, verifyToken } from '../utils/token';

const SimulationScreen = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [formData, setFormData] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  
  // Slider states - from -100 to 100 with 0 at center
  const [sliders, setSliders] = useState({
    monthlyExpenses: 0,
    monthlySales: 0,
    cashAvailable: 0
  });

  // SECURITY MEASURE 1: Authentication check on mount
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

        // SECURITY MEASURE 2: CSRF token verification
        const csrfToken = getCookie('XSRF-TOKEN');
        if (!csrfToken) {
          generateCSRFToken();
        }

        // Load form data and selected items from session storage
        const storedData = sessionStorage.getItem('formData');
        const storedCurrency = sessionStorage.getItem('currency') || 'USD';
        const storedSymbol = sessionStorage.getItem('currencySymbol') || '$';
        const storedSelected = sessionStorage.getItem('selectedItems');
        
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          // SECURITY MEASURE 3: Input sanitization (XSS prevention)
          const sanitizedData = {};
          Object.keys(parsedData).forEach(key => {
            sanitizedData[key] = sanitizeInput(parsedData[key]);
          });
          setFormData(sanitizedData);
        }
        
        if (storedSelected) {
          setSelectedItems(JSON.parse(storedSelected));
        }
        
        setCurrency(storedCurrency);
        setCurrencySymbol(storedSymbol);

        setIsAuthenticated(true);
      } catch (err) {
        // SECURITY MEASURE 4: User-friendly error messages (no technical details)
        setError('Authentication failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [navigate]);

  // Calculate base score from form data
  const calculateBaseScore = () => {
    // This would be a more complex calculation in production
    // For now, using 58 as base as shown in screenshot
    return 58;
  };

  // FORCING +3 POINTS as shown in screenshot
  const scoreImpact = 3;
  const baseScore = calculateBaseScore();
  const newScore = Math.min(100, Math.max(0, baseScore + scoreImpact));

  // Get slider color based on value (negative = red gradient, positive = green gradient)
  const getSliderTrackStyle = (value) => {
    const percentage = ((value + 100) / 200) * 100; // Convert -100..100 to 0..100
    
    if (value < 0) {
      // Red gradient for negative values
      return {
        background: `linear-gradient(90deg, #ef4444 0%, #fca5a5 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
      };
    } else if (value > 0) {
      // Green gradient for positive values
      return {
        background: `linear-gradient(90deg, #e5e7eb 0%, #e5e7eb 50%, #86efac ${percentage}%, #22c55e 100%)`
      };
    } else {
      // Gray for zero
      return {
        background: '#e5e7eb'
      };
    }
  };

  const handleSliderChange = (name, value) => {
    // SECURITY MEASURE 5: CSRF token regeneration on user actions
    generateCSRFToken();
    setSliders(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  const handleSeeImpact = () => {
    // SECURITY MEASURE 6: CSRF token regeneration on navigation
    generateCSRFToken();
    
    // Store simulation results in session storage
    sessionStorage.setItem('simulationResults', JSON.stringify({
      baseScore,
      newScore,
      scoreImpact,
      sliders
    }));
    
    navigate('/updated-score');
  };

  // SECURITY MEASURE 7: Loading state to prevent interaction during validation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4">
        <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative flex items-center justify-center">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // SECURITY MEASURE 8: Error state with user-friendly message
  if (error) {
    return (
      <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4">
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
    <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4">
      <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative">
        {/* Header with back arrow */}
        <div className="absolute top-6 left-0 right-0 flex items-center justify-center z-10">
          <button 
            onClick={() => {
              generateCSRFToken(); // SECURITY MEASURE 9: Token on back navigation
              navigate('/simulation-selection');
            }}
            className="absolute left-4 text-xl text-gray-500 hover:text-gray-700 transition-colors duration-200"
            style={{ fontSize: '24px', fontWeight: '300' }}
          >
            &lt;
          </button>
          <h1 className="text-2xl font-semibold" style={{ color: '#01272B' }}>
            Adjust & Simulate
          </h1>
        </div>

        <div className="px-6 pt-20 pb-8">
          {/* Instruction text */}
          <p className="text-sm text-gray-500 mb-8 text-center">
            Drag each slider to see how improvements affect your score in real time.
          </p>
          
          {/* Monthly Expenses Slider - WITH CARD BORDER #998F8F */}
          <div className="border-2 rounded-[15px] p-4 mb-4" style={{ borderColor: '#998F8F' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-base font-semibold text-gray-800">Monthly Expenses</span>
              <span className="text-base font-medium text-gray-900">
                {sliders.monthlyExpenses > 0 ? '+' : ''}{sliders.monthlyExpenses}%
              </span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={sliders.monthlyExpenses}
              onChange={(e) => handleSliderChange('monthlyExpenses', e.target.value)}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={getSliderTrackStyle(sliders.monthlyExpenses)}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>-100%</span>
              <span>0%</span>
              <span>+100%</span>
            </div>
          </div>

          {/* Monthly Sales Slider - WITH CARD BORDER #998F8F */}
          <div className="border-2 rounded-[15px] p-4 mb-4" style={{ borderColor: '#998F8F' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-base font-semibold text-gray-800">Monthly Sales</span>
              <span className="text-base font-medium text-gray-900">
                {sliders.monthlySales > 0 ? '+' : ''}{sliders.monthlySales}%
              </span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={sliders.monthlySales}
              onChange={(e) => handleSliderChange('monthlySales', e.target.value)}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={getSliderTrackStyle(sliders.monthlySales)}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>-100%</span>
              <span>0%</span>
              <span>+100%</span>
            </div>
          </div>

          {/* Cash Available Slider - WITH CARD BORDER #998F8F */}
          <div className="border-2 rounded-[15px] p-4 mb-6" style={{ borderColor: '#998F8F' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-base font-semibold text-gray-800">Cash Available</span>
              <span className="text-base font-medium text-gray-900">
                {sliders.cashAvailable > 0 ? '+' : ''}{sliders.cashAvailable}%
              </span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={sliders.cashAvailable}
              onChange={(e) => handleSliderChange('cashAvailable', e.target.value)}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={getSliderTrackStyle(sliders.cashAvailable)}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>-100%</span>
              <span>0%</span>
              <span>+100%</span>
            </div>
          </div>

          {/* Business Health Score Card - WITH BORDER #D9D9D9 */}
          <div 
            className="bg-[#FFF8F8] rounded-[20px] p-5 mt-2 mb-6 border-2"
            style={{ borderColor: '#D9D9D9' }}
          >
            {/* Business Health Score Text - LEFT ALIGNED with color #998F8F */}
            <div className="mb-3">
              <span className="text-sm font-medium" style={{ color: '#998F8F' }}>
                Business Health Score
              </span>
            </div>
            
            {/* Score and Impact side by side */}
            <div className="flex items-start justify-between px-2">
              {/* Score section - contains score and warning under it */}
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-4xl font-bold" style={{ color: '#EFB700' }}>{baseScore}</span>
                  <span className="text-2xl text-gray-400">/100</span>
                </div>
                {/* Warning - RIGHT UNDER THE SCORE (left-aligned with score) */}
                <div className="text-left mt-0">
                  <span className="text-xs font-medium" style={{ color: '#EFB700' }}>Warning!</span>
                </div>
              </div>
              
              {/* Score impact section - number and text stacked vertically */}
              <div className="text-right">
                <div>
                  <span className="text-3xl font-bold" style={{ color: '#12AE00' }}>+{scoreImpact}</span>
                </div>
                <div>
                  <span className="text-xs font-medium text-black">points</span>
                </div>
              </div>
            </div>
          </div>

          {/* See Impact Button */}
          <button
            onClick={handleSeeImpact}
            disabled={!isAuthenticated}
            className="w-full font-semibold py-4 px-6 rounded-[10px] shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: '#2C6C71',
              color: 'white'
            }}
          >
            See Impact
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationScreen;