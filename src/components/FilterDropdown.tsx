import React from 'react';
import { ChevronDown } from 'lucide-react';
import { FilterDropdownProps } from '../features/pokemon/types';


const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  placeholder = 'Select...'
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg
            bg-white appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            hover:border-gray-400 transition-colors
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
          `}
        >
          {!value && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className={`w-4 h-4 text-gray-400 ${disabled ? 'opacity-50' : ''}`} />
        </div>
      </div>
    </div>
  );
};

export default FilterDropdown;