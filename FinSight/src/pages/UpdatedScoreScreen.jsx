import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sanitizeInput } from '../utils/sanitize';
import { getCookie, generateCSRFToken } from '../utils/cookies';
import { getAuthToken, verifyToken } from '../utils/token';
import { useAppContext } from '../context/AppContext';

const UpdatedScoreScreen = () => {
  const navigate = useNavigate();
  const { simulationData, diagnosisData } = useAppContext();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data from simulation - initialize with defaults
  const [beforeScore, setBeforeScore] = useState(0);
  const [afterScore, setAfterScore] = useState(0);
  const [scoreImpact, setScoreImpact] = useState(0);
  const [statusText, setStatusText] = useState('');

  // Get score color based on value
  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#F97316';
    return '#EF4444';
  };

  const getStatusTextFromScore = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fairly Good';
    return 'At Risk';
  };

  const getStatusColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#F97316';
    return '#EF4444';
  };

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

        // Get original score from diagnosis (ResultsDashboard)
        let originalScore = 58;
        const storedDiagnosis = sessionStorage.getItem('diagnosisResult');
        
        if (diagnosisData && diagnosisData.health_score) {
          originalScore = diagnosisData.health_score;
          console.log('1️⃣ Original score from diagnosisData:', originalScore);
        } else if (storedDiagnosis) {
          try {
            const parsed = JSON.parse(storedDiagnosis);
            originalScore = parsed.health_score || 58;
            console.log('1️⃣ Original score from sessionStorage:', originalScore);
          } catch (e) {
            console.error('Error parsing storedDiagnosis:', e);
          }
        }

        // CRITICAL: Get simulation results - this is the score from the sliders!
        let newScore = originalScore;
        let impact = 0;
        const storedSimulation = sessionStorage.getItem('simulationResults');
        
        if (storedSimulation) {
          try {
            const parsed = JSON.parse(storedSimulation);
            console.log('2️⃣ RAW SIMULATION DATA FROM STORAGE:', parsed);
            
            // Use the currentScore from simulation (this is what user sees)
            if (parsed.newScore !== undefined) {
              newScore = parsed.newScore;
              console.log('3️⃣ USING newScore from simulation:', newScore);
            }
            
            if (parsed.scoreImpact !== undefined) {
              impact = parsed.scoreImpact;
            } else {
              impact = newScore - originalScore;
            }
            
            console.log('4️⃣ Final - Original:', originalScore, 'New:', newScore, 'Impact:', impact);
            
          } catch (e) {
            console.error('Error parsing storedSimulation:', e);
          }
        } else if (simulationData && simulationData.newScore) {
          console.log('2️⃣ Using simulationData from context:', simulationData);
          newScore = simulationData.newScore;
          impact = simulationData.scoreImpact || (newScore - originalScore);
        } else {
          console.log('⚠️ No simulation data found, using original score');
        }
        
        // Set all the values
        setBeforeScore(originalScore);
        setAfterScore(newScore);
        setScoreImpact(impact);
        setStatusText(getStatusTextFromScore(newScore));
        
        console.log('5️⃣ FINAL STATE:', {
          beforeScore: originalScore,
          afterScore: newScore,
          scoreImpact: impact,
          statusText: getStatusTextFromScore(newScore)
        });

        setIsAuthenticated(true);
      } catch (err) {
        console.error('❌ Error in validateSession:', err);
        setError('Authentication failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [navigate, simulationData, diagnosisData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4">
        <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative flex items-center justify-center">
          <p className="text-center text-gray-500">Loading your updated score...</p>
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
        {/* Header with back arrow */}
        <div className="absolute top-6 left-0 right-0 flex items-center justify-center z-10">
          <button 
            onClick={() => {
              generateCSRFToken();
              navigate('/simulation');
            }}
            className="absolute left-4 text-xl text-gray-500 hover:text-gray-700"
            style={{ fontSize: '24px', fontWeight: '300' }}
          >
            &lt;
          </button>
          <h1 className="text-2xl font-semibold" style={{ color: '#01272B' }}>
            Updated Health Score
          </h1>
        </div>

        <div className="px-6 pt-24 pb-8">
          {/* Score Circle - Shows AFTER score (what user got from sliders) */}
          <div className="flex justify-center items-center mb-2">
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center relative"
              style={{ 
                background: `conic-gradient(${getScoreColor(afterScore)} 0deg ${afterScore * 3.6}deg, #E5E7EB ${afterScore * 3.6}deg 360deg)`,
                padding: '4px'
              }}
            >
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <span className="text-4xl font-bold text-[#2C6C71]">{afterScore}</span>
              </div>
            </div>
          </div>
          
          {/* Out of 100 */}
          <div className="text-center mb-2">
            <span className="text-base text-gray-400">Out of 100</span>
          </div>
          
          {/* Status and Points */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span 
              className="text-lg font-medium px-4 py-1.5 rounded-full border-2"
              style={{ 
                color: getStatusColor(afterScore),
                borderColor: getStatusColor(afterScore),
                backgroundColor: 'transparent'
              }}
            >
              {statusText}
            </span>
            <span 
              className="text-lg font-bold px-4 py-1.5 rounded-full border-2"
              style={{ 
                color: scoreImpact >= 0 ? '#12AE00' : '#EF4444',
                borderColor: scoreImpact >= 0 ? '#12AE00' : '#EF4444',
                backgroundColor: 'transparent'
              }}
            >
              {scoreImpact >= 0 ? '+' : ''}{scoreImpact}pts
            </span>
          </div>

          {/* Before Vs After Card */}
          <div className="border-2 rounded-[20px] p-5 mb-8" style={{ borderColor: '#998F8F' }}>
            <h2 className="text-base font-medium mb-3" style={{ color: '#998F8F' }}>Before Vs After</h2>
            
            {/* Before - Original score */}
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
            
            {/* After - Score from simulation sliders */}
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

          {/* View Recommendations Button */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                generateCSRFToken();
                navigate('/ai-coach');
              }}
              disabled={!isAuthenticated}
              className="font-semibold py-3 px-6 shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              style={{ 
                backgroundColor: '#2C6C71',
                color: 'white', 
                borderRadius: '10px',
                fontSize: '14px',
                minWidth: '180px'
              }}
            >
              View Recommendations
            </button>
          </div>
          
          <div className="h-4"></div>
        </div>
      </div>
    </div>
  );
};

export default UpdatedScoreScreen;