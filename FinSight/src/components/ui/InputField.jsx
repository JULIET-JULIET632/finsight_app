import React from 'react';

const InputField = ({ label, name, value, onChange, placeholder, type = "text", unit = "" }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-4 border border-gray-200 rounded-[10px] focus:outline-none focus:border-[#3A361] focus:ring-1 focus:ring-[#3A361] transition-all"
        />
        {unit && (
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputField;