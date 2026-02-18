import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BusinessInfoScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessType: 'Retail',
    country: 'Kenya',
    daysToSell: '',
    monthlyProfit: '',
    staffSalaries: '',
    loanPayments: '',
    totalAssets: '',
    totalDebt: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/results');
  };

  return (
    <div className="w-[395px] min-h-screen bg-white mx-auto">
      {/* Back button */}
      <button 
        onClick={() => navigate('/welcome')}
        className="absolute top-4 left-4 text-sm text-gray-500 hover:text-gray-700"
      >
        ← Back
      </button>

      <div className="px-4 pt-16">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Business Information</h1>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/*business type dropdown*/}
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Business Type</label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className="w-full p-3.5 border border-gray-200 rounded-[10px] focus:outline-none focus:border-gray-400 bg-white appearance-none"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
            >
              <option value="Retail">Retail</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Services">Services</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Construction">Construction</option>
            </select>
          </div>

          {/*countries dropdown*/}
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-3.5 border border-gray-200 rounded-[10px] focus:outline-none focus:border-gray-400 bg-white appearance-none"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
            >
              <option value="Kenya">Kenya</option>
              <option value="Uganda">Uganda</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Rwanda">Rwanda</option>
              <option value="South Africa">South Africa</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Ghana">Ghana</option>
              <option value="Ethiopia">Ethiopia</option>
            </select>
          </div>

          {/*days to sell stock*/}
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Days to Sell Stock</label>
            <input
              type="text"
              name="daysToSell"
              value={formData.daysToSell}
              onChange={handleChange}
              placeholder="10"
              className="w-full p-3.5 border border-gray-200 rounded-[10px] focus:outline-none focus:border-gray-400"
            />
          </div>

          {/*monthly profit */}
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Monthly Profit</label>
            <input
              type="text"
              name="monthlyProfit"
              value={formData.monthlyProfit}
              onChange={handleChange}
              placeholder="USD 800"
              className="w-full p-3.5 border border-gray-200 rounded-[10px] focus:outline-none focus:border-gray-400"
            />
          </div>

          {/*sum of staff salaries*/}
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Sum of Staff Salaries</label>
            <input
              type="text"
              name="staffSalaries"
              value={formData.staffSalaries}
              onChange={handleChange}
              placeholder="USD 800"
              className="w-full p-3.5 border border-gray-200 rounded-[10px] focus:outline-none focus:border-gray-400"
            />
          </div>

          {/*loan payments*/}
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Loan Payments</label>
            <input
              type="text"
              name="loanPayments"
              value={formData.loanPayments}
              onChange={handleChange}
              placeholder="USD 250"
              className="w-full p-3.5 border border-gray-200 rounded-[10px] focus:outline-none focus:border-gray-400"
            />
          </div>

          {/*total assets*/}
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Total Assets</label>
            <input
              type="text"
              name="totalAssets"
              value={formData.totalAssets}
              onChange={handleChange}
              placeholder="USD 5000"
              className="w-full p-3.5 border border-gray-200 rounded-[10px] focus:outline-none focus:border-gray-400"
            />
          </div>

          {/*total debt*/}
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Total Debt</label>
            <input
              type="text"
              name="totalDebt"
              value={formData.totalDebt}
              onChange={handleChange}
              placeholder="USD 2000"
              className="w-full p-3.5 border border-gray-200 rounded-[10px] focus:outline-none focus:border-gray-400"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#B47D5A] text-white font-semibold py-4 px-6 rounded-[10px] shadow-md"
            >
              Check Health
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessInfoScreen;