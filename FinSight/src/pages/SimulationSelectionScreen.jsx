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
  const [impactItems, setImpactItems] = useState([]);

  // Map backend field names to display names
  const mapFieldToDisplay = (field) => {
    const fieldMap = {
      inventory_days: 'Days to Sell Stock',
      monthly_cash_surplus: 'Monthly Profit',
      monthly_wages: 'Monthly Staff Salaries',
      monthly_loan_payment: 'Monthly Loan Payments',
      total_assets: 'Total Assets',
      total_debt: 'Total Debt',
    };
    return fieldMap[field] || field;
  };

  // Format display values
  const formatDisplayValue = (field, value, symbol) => {
    if (!value) return field === 'inventory_days' ? '0 days' : `${symbol} 0`;
    const numValue = parseInt(value, 10);
    const formattedNum = numValue.toLocaleString();
    if (field === 'inventory_days') {
      return `${formattedNum} days`;
    }
    return `${symbol} ${formattedNum}`;
  };

  // Map backend field to form field
  const getFormFieldName = (backendField) => {
    const mapping = {
      'inventory_days': 'daysToSell',
      'monthly_cash_surplus': 'monthlyProfit',
      'monthly_wages': 'staffSalaries',
      'monthly_loan_payment': 'loanPayments',
      'total_assets': 'totalAssets',
      'total_debt': 'totalDebt',
    };
    return mapping[backendField] || backendField;
  };

  // Get score color based on value
  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#F97316';
    return '#EF4444';
  };

  // Get status text based on score
  const getStatusText = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Warning';
    return 'At Risk';
  };

  // Get impact multiplier for points
  const getImpactPoints = (impactLevel) => {
    switch(impactLevel) {
      case 'high': return '15-30 points';
      case 'medium': return '8-15 points';
      case 'low': return '5-8 points';
      default: return '5-8 points';
    }
  };

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

        const csrfToken = getCookie('XSRF-TOKEN');
        if (!csrfToken) {
          generateCSRFToken();
        }

        // Load form data from session storage
        const storedData = sessionStorage.getItem('formData');
        const storedCurrency = sessionStorage.getItem('currency') || 'USD';
        const storedSymbol = sessionStorage.getItem('currencySymbol') || '$';
        const storedSector = sessionStorage.getItem('businessSector') || '';
        
        let parsedData = {};
        if (storedData) {
          parsedData = JSON.parse(storedData);
          const sanitizedData = {};
          Object.keys(parsedData).forEach(key => {
            sanitizedData[key] = sanitizeInput(parsedData[key]);
          });
          setFormData(sanitizedData);
        }
        
        setCurrency(storedCurrency);
        setCurrencySymbol(storedSymbol);
        setBusinessSector(sanitizeInput(storedSector));

        // Get health score and impacts from diagnosis data
        let score = 58;
        if (diagnosisData && diagnosisData.health_score) {
          score = diagnosisData.health_score;
          setHealthScore(score);

          // BUILD IMPACT ITEMS FROM API RESPONSE
          if (diagnosisData.impacts) {
            const impacts = diagnosisData.impacts;
            const items = [];
            console.log('API Impacts received:', impacts);

            // Add HIGH impact items (MASSIVE effect on score)
            impacts.high_impact?.forEach((field) => {
              items.push({
                id: items.length + 1,
                field,
                title: mapFieldToDisplay(field),
                value: parsedData[getFormFieldName(field)] || '0',
                displayValue: formatDisplayValue(field, parsedData[getFormFieldName(field)], storedSymbol),
                impact: 'HIGH IMPACT',
                impactLevel: 'high',
                badgeColor: '#D20303',
                points: '15-30 points',
                description: 'Fixing this will dramatically improve your score'
              });
            });

            // Add MEDIUM impact items (MODERATE effect on score)
            impacts.medium_impact?.forEach((field) => {
              items.push({
                id: items.length + 1,
                field,
                title: mapFieldToDisplay(field),
                value: parsedData[getFormFieldName(field)] || '0',
                displayValue: formatDisplayValue(field, parsedData[getFormFieldName(field)], storedSymbol),
                impact: 'MEDIUM IMPACT',
                impactLevel: 'medium',
                badgeColor: '#EFB700',
                points: '8-15 points',
                description: 'Fixing this will moderately improve your score'
              });
            });

            // Add LOW impact items (MINOR effect on score)
            impacts.low_impact?.forEach((field) => {
              items.push({
                id: items.length + 1,
                field,
                title: mapFieldToDisplay(field),
                value: parsedData[getFormFieldName(field)] || '0',
                displayValue: formatDisplayValue(field, parsedData[getFormFieldName(field)], storedSymbol),
                impact: 'LOW IMPACT',
                impactLevel: 'low',
                badgeColor: '#12AE00',
                points: '5-8 points',
                description: 'Fixing this will slightly improve your score'
              });
            });

            setImpactItems(items);
            console.log('Built impact items:', items);
          }
        } else {
          // Try to get from session storage as fallback
          const storedDiagnosis = sessionStorage.getItem('diagnosisResult');
          if (storedDiagnosis) {
            const parsedDiagnosis = JSON.parse(storedDiagnosis);
            if (parsedDiagnosis.health_score) {
              setHealthScore(parsedDiagnosis.health_score);
            }
            if (parsedDiagnosis.impacts) {
              const impacts = parsedDiagnosis.impacts;
              const items = [];
              
              impacts.high_impact?.forEach((field) => {
                items.push({
                  id: items.length + 1,
                  field,
                  title: mapFieldToDisplay(field),
                  value: parsedData[getFormFieldName(field)] || '0',
                  displayValue: formatDisplayValue(field, parsedData[getFormFieldName(field)], storedSymbol),
                  impact: 'HIGH IMPACT',
                  impactLevel: 'high',
                  badgeColor: '#D20303',
                  points: '15-30 points'
                });
              });

              impacts.medium_impact?.forEach((field) => {
                items.push({
                  id: items.length + 1,
                  field,
                  title: mapFieldToDisplay(field),
                  value: parsedData[getFormFieldName(field)] || '0',
                  displayValue: formatDisplayValue(field, parsedData[getFormFieldName(field)], storedSymbol),
                  impact: 'MEDIUM IMPACT',
                  impactLevel: 'medium',
                  badgeColor: '#EFB700',
                  points: '8-15 points'
                });
              });

              impacts.low_impact?.forEach((field) => {
                items.push({
                  id: items.length + 1,
                  field,
                  title: mapFieldToDisplay(field),
                  value: parsedData[getFormFieldName(field)] || '0',
                  displayValue: formatDisplayValue(field, parsedData[getFormFieldName(field)], storedSymbol),
                  impact: 'LOW IMPACT',
                  impactLevel: 'low',
                  badgeColor: '#12AE00',
                  points: '5-8 points'
                });
              });

              setImpactItems(items);
            }
          }
        }

        setIsAuthenticated(true);
      } catch (err) {
        setError('Authentication failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [navigate, diagnosisData]);

  const toggleSelect = (id) => {
    generateCSRFToken();
    setSelected(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleStartSimulate = () => {
    generateCSRFToken();
    
    // Store selected items in session storage
    sessionStorage.setItem('selectedItems', JSON.stringify(selected));
    sessionStorage.setItem('selectedImpactItems', JSON.stringify(
      impactItems.filter(item => selected.includes(item.id))
    ));
    
    navigate('/simulation');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4">
        <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative flex items-center justify-center">
          <p className="text-center text-gray-500">Loading impact analysis...</p>
        </div>
      </div>
    );
  }

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
        <div className="absolute top-6 left-0 right-0 flex items-center justify-center z-10">
          <button 
            onClick={() => {
              generateCSRFToken();
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
          <div className="bg-[#FFF8F8] rounded-[20px] p-5 mb-4 text-center">
            <p className="text-sm text-gray-700 leading-relaxed">
              Select areas to make improvements and we'll show you the impact on your score
            </p>
          </div>

          {/* Business Risk Score card */}
          <div className="bg-[#FFF8F8] rounded-[20px] p-5 mb-6">
            <div className="text-center mb-3">
              <span className="text-sm font-medium text-gray-700">Business Risk Score</span>
            </div>
            
            <div className="flex items-center justify-center gap-8 mb-0">
              <div className="flex items-center gap-1">
                <span className="text-4xl font-bold" style={{ color: getScoreColor(healthScore) }}>
                  {healthScore}
                </span>
                <span className="text-2xl text-gray-400">/100</span>
              </div>
              
              {healthScore < 60 && (
                <span 
                  className="inline-block px-4 py-1.5 rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: getScoreColor(healthScore) }}
                >
                  {getStatusText(healthScore)}!
                </span>
              )}
            </div>
          </div>

          {/* Impact Cards - DYNAMIC from API */}
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
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-2 mb-1">
                        <h3 className="text-xs font-medium text-gray-800">
                          {item.title}
                        </h3>
                        <span 
                          className="text-[10px] px-2 py-1 rounded-full font-medium text-white whitespace-nowrap flex-shrink-0"
                          style={{ backgroundColor: item.badgeColor }}
                        >
                          {item.impact}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-gray-800">{item.displayValue}</p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {item.impactLevel === 'high' ? '🔴 Fixing this will dramatically improve your score' :
                         item.impactLevel === 'medium' ? '🟡 Fixing this will moderately improve your score' :
                         '🟢 Fixing this will slightly improve your score'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Selected: {selected.length}
            </span>
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