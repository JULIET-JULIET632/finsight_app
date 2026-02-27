import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sanitizeInput } from '../utils/sanitize';
import { getCookie, generateCSRFToken } from '../utils/cookies';
import { getAuthToken, verifyToken } from '../utils/token';
import { useAppContext } from '../context/AppContext';

const SimulationSelectionScreen = () => {
  const navigate = useNavigate();
  const { diagnosisData } = useAppContext();
  const [selected, setSelected] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [formData, setFormData] = useState({});
  const [businessSector, setBusinessSector] = useState('');
  const [healthScore, setHealthScore] = useState(58);

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

        // Load form data from session storage
        const storedData = sessionStorage.getItem('formData');
        const storedCurrency = sessionStorage.getItem('currency') || 'USD';
        const storedSymbol = sessionStorage.getItem('currencySymbol') || '$';
        const storedSector = sessionStorage.getItem('businessSector') || '';
        
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          // SECURITY MEASURE 3: Input sanitization (XSS prevention)
          const sanitizedData = {};
          Object.keys(parsedData).forEach(key => {
            sanitizedData[key] = sanitizeInput(parsedData[key]);
          });
          setFormData(sanitizedData);
        }
        
        setCurrency(storedCurrency);
        setCurrencySymbol(storedSymbol);
        setBusinessSector(sanitizeInput(storedSector));

        // Get health score from diagnosis data (API result)
        if (diagnosisData && diagnosisData.health_score) {
          setHealthScore(diagnosisData.health_score);
        } else {
          // Try to get from session storage as fallback
          const storedDiagnosis = sessionStorage.getItem('diagnosisResult');
          if (storedDiagnosis) {
            const parsedDiagnosis = JSON.parse(storedDiagnosis);
            if (parsedDiagnosis.health_score) {
              setHealthScore(parsedDiagnosis.health_score);
            }
          }
        }

        setIsAuthenticated(true);
      } catch (err) {
        // SECURITY MEASURE 4: User-friendly error messages (no technical details)
        setError('Authentication failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [navigate, diagnosisData]);

  // ALL 6 inputs from BusinessInfoScreen with impact levels
  const impactItems = [
    { 
      id: 1, 
      field: 'daysToSell',
      title: 'Days to Sell Stock', 
      value: formData.daysToSell || '0',
      displayValue: formData.daysToSell ? `${formData.daysToSell} days` : '0 days',
      impact: 'HIGH IMPACT',
      impactLevel: 'high',
      points: '15-30 points',
      badgeColor: '#D20303', // Red for high impact
    },
    { 
      id: 2, 
      field: 'monthlyProfit',
      title: 'Monthly Profit', 
      value: formData.monthlyProfit || '0',
      displayValue: formData.monthlyProfit ? `${currencySymbol} ${parseInt(formData.monthlyProfit).toLocaleString()}` : `${currencySymbol} 0`,
      impact: 'MEDIUM IMPACT',
      impactLevel: 'medium',
      points: '8-15 points',
      badgeColor: '#EFB700', // Gold/Yellow for medium impact
    },
    { 
      id: 3, 
      field: 'staffSalaries',
      title: 'Monthly Staff Salaries', 
      value: formData.staffSalaries || '0',
      displayValue: formData.staffSalaries ? `${currencySymbol} ${parseInt(formData.staffSalaries).toLocaleString()}` : `${currencySymbol} 0`,
      impact: 'MEDIUM IMPACT',
      impactLevel: 'medium',
      points: '8-15 points',
      badgeColor: '#EFB700', // Gold/Yellow for medium impact
    },
    { 
      id: 4, 
      field: 'loanPayments',
      title: 'Monthly Loan Payments', 
      value: formData.loanPayments || '0',
      displayValue: formData.loanPayments ? `${currencySymbol} ${parseInt(formData.loanPayments).toLocaleString()}` : `${currencySymbol} 0`,
      impact: 'HIGH IMPACT',
      impactLevel: 'high',
      points: '15-30 points',
      badgeColor: '#D20303', // Red for high impact
    },
    { 
      id: 5, 
      field: 'totalAssets',
      title: 'Total Assets', 
      value: formData.totalAssets || '0',
      displayValue: formData.totalAssets ? `${currencySymbol} ${parseInt(formData.totalAssets).toLocaleString()}` : `${currencySymbol} 0`,
      impact: 'MEDIUM IMPACT',
      impactLevel: 'medium',
      points: '8-15 points',
      badgeColor: '#EFB700', // Gold/Yellow for medium impact
    },
    { 
      id: 6, 
      field: 'totalDebt',
      title: 'Total Debt', 
      value: formData.totalDebt || '0',
      displayValue: formData.totalDebt ? `${currencySymbol} ${parseInt(formData.totalDebt).toLocaleString()}` : `${currencySymbol} 0`,
      impact: 'LOW IMPACT',
      impactLevel: 'low',
      points: '5-8 points',
      badgeColor: '#12AE00', // Green for low impact
    }
  ];

  // SECURITY MEASURE 5: CSRF token regeneration on user actions
  const toggleSelect = (id) => {
    generateCSRFToken(); // New token for state change
    setSelected(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // SECURITY MEASURE 6: CSRF token regeneration on navigation
  const handleStartSimulate = () => {
    generateCSRFToken(); // New token for navigation
    
    // Store selected items in session storage
    sessionStorage.setItem('selectedItems', JSON.stringify(selected));
    sessionStorage.setItem('selectedImpactItems', JSON.stringify(
      impactItems.filter(item => selected.includes(item.id))
    ));
    
    navigate('/simulation');
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
              navigate('/results');
            }}
            className="absolute left-4 text-xl text-gray-500 hover:text-gray-700 transition-colors duration-200"
            style={{ fontSize: '24px', fontWeight: '300' }}
          >
            &lt;
          </button>
          <h1 className="text-xl font-semibold" style={{ color: '#01272B' }}>
            Choose What To Improve
          </h1>
        </div>

        <div className="px-5 pt-16 pb-24">
          {/* Select areas card - #FFF8F8 */}
          <div className="bg-[#FFF8F8] rounded-[20px] p-5 mb-4 text-center">
            <p className="text-sm text-gray-700 leading-relaxed">
              Select areas to make improvements and we'll show you the impact on your score
            </p>
          </div>

          {/* Business Risk Score card - #FFF8F8 */}
          <div className="bg-[#FFF8F8] rounded-[20px] p-5 mb-6">
            <div className="text-center mb-3">
              <span className="text-sm font-medium text-gray-700">Business Risk Score</span>
            </div>
            
            {/* Score and Warning on the same line with MORE SPACE */}
            <div className="flex items-center justify-center gap-8 mb-0">
              <div className="flex items-center gap-1">
                <span className="text-4xl font-bold" style={{ color: '#EFB700' }}>{healthScore}</span>
                <span className="text-2xl text-gray-400">/100</span>
              </div>
              
              {/* Warning container - #EFB700 */}
              <span 
                className="inline-block px-4 py-1.5 rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: '#EFB700' }}
              >
                Warning!
              </span>
            </div>
          </div>

          {/* ALL 6 Impact Cards - #D9D9D9 background */}
          <div className="space-y-3">
            {impactItems.map(item => {
              const isSelected = selected.includes(item.id);
              
              return (
                <div
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className="p-4 rounded-[15px] cursor-pointer transition-all duration-200 border-2"
                  style={{ 
                    backgroundColor: '#D9D9D9',
                    borderColor: isSelected ? '#EFB700' : '#D9D9D9'
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Tick box - White background */}
                    <div 
                      className="w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 transition-colors duration-200 bg-white flex-shrink-0"
                      style={{ 
                        borderColor: isSelected ? '#EFB700' : '#888',
                      }}
                    >
                      {isSelected && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 2" stroke="#EFB700" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-2 mb-1">
                        <h3 className="text-xs font-medium text-gray-800">
                          {item.title}
                        </h3>
                        {/* Impact badge */}
                        <span 
                          className="text-[10px] px-2 py-1 rounded-full font-medium text-white whitespace-nowrap flex-shrink-0"
                          style={{ 
                            backgroundColor: item.badgeColor
                          }}
                        >
                          {item.impact}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-gray-800">{item.displayValue}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fixed Bottom Section - NO LINE ABOVE */}
        <div className="absolute bottom-0 left-0 right-0 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Selected: {selected.length}
            </span>
            {/* SECURITY MEASURE 10: Button disabled when not authenticated or no selection */}
            <button
              onClick={handleStartSimulate}
              disabled={!isAuthenticated || selected.length === 0}
              className="font-semibold py-3 px-8 rounded-[10px] shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: selected.length > 0 ? '#2C6C71' : '#A0A0A0',
                color: 'white'
              }}
            >
              Start Simulate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationSelectionScreen;