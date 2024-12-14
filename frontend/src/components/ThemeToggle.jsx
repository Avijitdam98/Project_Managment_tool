import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        fixed bottom-8 right-8 p-3 rounded-full shadow-lg 
        transition-all duration-300 ease-in-out transform hover:scale-110
        ${darkMode 
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
          : 'bg-white text-gray-800 hover:bg-gray-100'
        }
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        ${darkMode ? 'focus:ring-yellow-400' : 'focus:ring-blue-500'}
      `}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <FaSun className="w-6 h-6" />
      ) : (
        <FaMoon className="w-6 h-6" />
      )}
    </button>
  );
};

export default ThemeToggle;
