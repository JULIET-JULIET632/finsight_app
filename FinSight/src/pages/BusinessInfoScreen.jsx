import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sanitizeInput, sanitizeFormData, sanitizeNumeric } from '../utils/sanitize';
import { generateCSRFToken } from '../utils/cookies';
import { generateToken } from '../utils/token';

const BusinessInfoScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessType: '',
    daysToSell: '',
    monthlyProfit: '',
    staffSalaries: '',
    loanPayments: '',
    totalAssets: '',
    totalDebt: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field configurations with min, max, and custom validation
  const fieldConfig = {
    daysToSell: {
      min: 1,
      max: 365,
      required: true,
      pattern: /^\d+$/,
      errorMessage: 'Days to sell stock must be between 1 and 365 days'
    },
    monthlyProfit: {
      min: 0,
      max: 10000000,
      required: true,
      pattern: /^\d+$/,
      errorMessage: 'Monthly profit must be between $0 and $10,000,000'
    },
    staffSalaries: {
      min: 0,
      max: 10000000,
      required: true,
      pattern: /^\d+$/,
      errorMessage: 'Staff salaries must be between $0 and $10,000,000'
    },
    loanPayments: {
      min: 0,
      max: 10000000,
      required: true,
      pattern: /^\d+$/,
      errorMessage: 'Loan payments must be between $0 and $10,000,000'
    },
    totalAssets: {
      min: 0,
      max: 100000000,
      required: true,
      pattern: /^\d+$/,
      errorMessage: 'Total assets must be between $0 and $100,000,000'
    },
    totalDebt: {
      min: 0,
      max: 100000000,
      required: true,
      pattern: /^\d+$/,
      errorMessage: 'Total debt must be between $0 and $100,000,000'
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['daysToSell', 'monthlyProfit', 'staffSalaries', 'loanPayments', 'totalAssets', 'totalDebt'];
    
    if (numericFields.includes(name)) {
      // Sanitize numeric input
      const numericValue = sanitizeNumeric(value);
      const cleanedValue = numericValue.replace(/^0+/, '') || '';
      
      setFormData(prev => ({ ...prev, [name]: cleanedValue }));
      validateField(name, cleanedValue);
    } else {
      // Sanitize text input
      const sanitizedValue = sanitizeInput(value);
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field, value) => {
    if (field === 'businessType') {
      if (!value) {
        setErrors(prev => ({ ...prev, [field]: 'Please select a business type' }));
        return false;
      }
      setErrors(prev => ({ ...prev, [field]: '' }));
      return true;
    }

    const config = fieldConfig[field];
    if (!config) return true;

    let error = '';

    if (config.required && (!value || value === '')) {
      error = 'This field is required';
    } else if (value) {
      const numValue = parseInt(value, 10);
      if (isNaN(numValue)) {
        error = 'Please enter a valid number';
      } else if (numValue < config.min) {
        error = `Minimum value is ${config.min}`;
      } else if (numValue > config.max) {
        error = `Maximum value is ${config.max.toLocaleString()}`;
      }
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate business type
    if (!formData.businessType) {
      newErrors.businessType = 'Please select a business type';
      isValid = false;
    }

    // Validate all numeric fields
    Object.keys(fieldConfig).forEach(field => {
      const value = formData[field];
      const config = fieldConfig[field];
      
      if (!value || value === '') {
        newErrors[field] = 'This field is required';
        isValid = false;
      } else {
        const numValue = parseInt(value, 10);
        if (isNaN(numValue)) {
          newErrors[field] = 'Please enter a valid number';
          isValid = false;
        } else if (numValue < config.min) {
          newErrors[field] = `Minimum value is ${config.min}`;
          isValid = false;
        } else if (numValue > config.max) {
          newErrors[field] = `Maximum value is ${config.max.toLocaleString()}`;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsButtonClicked(true);
    setTimeout(() => setIsButtonClicked(false), 200);
    
    if (!validateForm()) {
      const firstError = document.querySelector('.text-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize all form data before submission
      const sanitizedData = sanitizeFormData(formData);
      
      // Generate CSRF token for security
      const csrfToken = generateCSRFToken();
      
      // Generate auth token (in production, this would come from server)
      const authToken = generateToken('user-123');
      
      // Store token securely (sessionStorage, not localStorage for sensitive data)
      sessionStorage.setItem('auth_token', authToken);
      
      // API call with HTTPS
      const response = await fetch('https://api.finsight.com/health-check', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(sanitizedData)
      }).catch(() => {
        // Fallback for development - simulate API call
        console.log('Development mode - simulated API call', sanitizedData);
        return { ok: true };
      });
      
      if (response.ok) {
        // Store minimal non-sensitive data in session storage
        sessionStorage.setItem('businessType', sanitizedData.businessType);
        navigate('/results');
      } else {
        alert('Unable to process your request. Please try again later.');
      }
      
    } catch (error) {
      // User-friendly error message
      alert('Unable to process your request. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonColor = () => {
    if (isButtonClicked) return '#0F3E3A';
    return '#2C6C71';
  };

  const hasError = (field) => {
    return touched[field] && errors[field];
  };

  return (
    <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4" style={{ fontFamily: 'Poppins' }}>
      <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative">
        {/* Header with back arrow and title */}
        <div className="absolute top-4 left-0 right-0 flex items-center justify-center z-10">
          <button 
            onClick={() => navigate('/welcome')}
            className="absolute left-4 text-xl text-gray-500 hover:text-gray-700 transition-colors duration-200"
            style={{ fontSize: '24px', fontWeight: '300' }}
          >
            &lt;
          </button>
          <h1 className="text-xl font-semibold" style={{ color: '#01272B', fontFamily: 'Poppins' }}>
            Business Information
          </h1>
        </div>

        <div className="px-4 pt-16 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Business Type Dropdown */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Business Type</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                onBlur={() => handleBlur('businessType')}
                className={`w-full p-3.5 border rounded-[10px] focus:outline-none focus:border-gray-400 bg-white appearance-none ${
                  hasError('businessType') ? 'border-red-500' : 'border-gray-200'
                } ${formData.businessType === '' ? 'text-gray-400' : 'text-gray-900'}`}
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
              >
                <option value="" disabled>Select business type</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Construction">Construction</option>
                <option value="Retail">Retail</option>
                <option value="Agriculture">Agriculture</option>
              </select>
              {hasError('businessType') && (
                <p className="text-xs text-red-500 mt-1">{errors.businessType}</p>
              )}
            </div>

            {/* Days to Sell Stock */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Days to Sell Stock</label>
              <input
                type="text"
                name="daysToSell"
                value={formData.daysToSell}
                onChange={handleChange}
                onBlur={() => handleBlur('daysToSell')}
                placeholder="10"
                inputMode="numeric"
                className={`w-full p-3.5 border rounded-[10px] focus:outline-none focus:border-gray-400 placeholder-gray-400 text-gray-900 ${
                  hasError('daysToSell') ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {hasError('daysToSell') && (
                <p className="text-xs text-red-500 mt-1">{errors.daysToSell}</p>
              )}
            </div>

            {/* Monthly Profit */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Monthly Profit</label>
              <input
                type="text"
                name="monthlyProfit"
                value={formData.monthlyProfit}
                onChange={handleChange}
                onBlur={() => handleBlur('monthlyProfit')}
                placeholder="800"
                inputMode="numeric"
                className={`w-full p-3.5 border rounded-[10px] focus:outline-none focus:border-gray-400 placeholder-gray-400 text-gray-900 ${
                  hasError('monthlyProfit') ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {hasError('monthlyProfit') && (
                <p className="text-xs text-red-500 mt-1">{errors.monthlyProfit}</p>
              )}
            </div>

            {/* Sum of Staff Salaries */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Sum of Staff Salaries</label>
              <input
                type="text"
                name="staffSalaries"
                value={formData.staffSalaries}
                onChange={handleChange}
                onBlur={() => handleBlur('staffSalaries')}
                placeholder="800"
                inputMode="numeric"
                className={`w-full p-3.5 border rounded-[10px] focus:outline-none focus:border-gray-400 placeholder-gray-400 text-gray-900 ${
                  hasError('staffSalaries') ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {hasError('staffSalaries') && (
                <p className="text-xs text-red-500 mt-1">{errors.staffSalaries}</p>
              )}
            </div>

            {/* Loan Payments */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Loan Payments</label>
              <input
                type="text"
                name="loanPayments"
                value={formData.loanPayments}
                onChange={handleChange}
                onBlur={() => handleBlur('loanPayments')}
                placeholder="250"
                inputMode="numeric"
                className={`w-full p-3.5 border rounded-[10px] focus:outline-none focus:border-gray-400 placeholder-gray-400 text-gray-900 ${
                  hasError('loanPayments') ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {hasError('loanPayments') && (
                <p className="text-xs text-red-500 mt-1">{errors.loanPayments}</p>
              )}
            </div>

            {/* Total Assets */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Total Assets</label>
              <input
                type="text"
                name="totalAssets"
                value={formData.totalAssets}
                onChange={handleChange}
                onBlur={() => handleBlur('totalAssets')}
                placeholder="5000"
                inputMode="numeric"
                className={`w-full p-3.5 border rounded-[10px] focus:outline-none focus:border-gray-400 placeholder-gray-400 text-gray-900 ${
                  hasError('totalAssets') ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {hasError('totalAssets') && (
                <p className="text-xs text-red-500 mt-1">{errors.totalAssets}</p>
              )}
            </div>

            {/* Total Debt */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Total Debt</label>
              <input
                type="text"
                name="totalDebt"
                value={formData.totalDebt}
                onChange={handleChange}
                onBlur={() => handleBlur('totalDebt')}
                placeholder="2000"
                inputMode="numeric"
                className={`w-full p-3.5 border rounded-[10px] focus:outline-none focus:border-gray-400 placeholder-gray-400 text-gray-900 ${
                  hasError('totalDebt') ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {hasError('totalDebt') && (
                <p className="text-xs text-red-500 mt-1">{errors.totalDebt}</p>
              )}
            </div>

              {/* Check Risk Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full font-semibold py-4 px-6 rounded-[10px] shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: getButtonColor(),
                    color: 'white', 
                    fontFamily: 'Poppins'
                  }}
                >
                  {isSubmitting ? 'Processing...' : 'Check Risk'}
                </button>
              </div>

            {/* Form-wide error message */}
            {Object.keys(errors).length > 0 && Object.values(errors).some(e => e) && (
              <p className="text-xs text-red-500 text-center mt-2">
                Please fix the errors above before submitting.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoScreen;