import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Logo = ({ className = 'h-8 w-auto' }) => {
  const { darkMode } = useTheme();

  return (
    <div className={`flex items-center ${className}`}>
      <svg
        className="h-full"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Container */}
        <rect
          x="8"
          y="8"
          width="48"
          height="48"
          rx="12"
          fill={darkMode ? '#3B82F6' : '#2563EB'}
        />
        
        {/* Project Blocks */}
        <rect
          x="16"
          y="16"
          width="14"
          height="14"
          rx="4"
          fill={darkMode ? '#BFDBFE' : '#DBEAFE'}
        />
        <rect
          x="34"
          y="16"
          width="14"
          height="14"
          rx="4"
          fill={darkMode ? '#1E3A8A' : '#1D4ED8'}
        />
        <rect
          x="16"
          y="34"
          width="14"
          height="14"
          rx="4"
          fill={darkMode ? '#1E3A8A' : '#1D4ED8'}
        />
        <rect
          x="34"
          y="34"
          width="14"
          height="14"
          rx="4"
          fill={darkMode ? '#BFDBFE' : '#DBEAFE'}
        />

        {/* Connection Lines */}
        <path
          d="M30 23h4"
          stroke={darkMode ? '#BFDBFE' : '#DBEAFE'}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M23 30v4"
          stroke={darkMode ? '#BFDBFE' : '#DBEAFE'}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M41 30v4"
          stroke={darkMode ? '#BFDBFE' : '#DBEAFE'}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M30 41h4"
          stroke={darkMode ? '#BFDBFE' : '#DBEAFE'}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className={`ml-3 text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        ProFlow
      </span>
      <span className={`ml-1 text-sm font-medium ${darkMode ? 'text-blue-200' : 'text-blue-600'}`}>
        Pro
      </span>
    </div>
  );
};

export default Logo;
