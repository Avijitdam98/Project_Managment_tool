import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import store from './store/store';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ThemeToggle from './components/ThemeToggle';
import AppRoutes from './routes';

// Custom ToastContainer wrapper to handle theme
const ThemedToastContainer = () => {
  const { darkMode } = useTheme();
  
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={darkMode ? 'dark' : 'light'}
      toastClassName={() => `
        relative flex p-4 min-h-10 rounded-lg justify-between overflow-hidden cursor-pointer
        ${darkMode 
          ? 'bg-gray-800 text-gray-100' 
          : 'bg-white text-gray-900'
        }
        shadow-lg
      `}
      bodyClassName={() => `
        text-sm font-medium block p-3
        ${darkMode ? 'text-gray-200' : 'text-gray-700'}
      `}
      progressClassName={() => `
        Toastify__progress-bar--animated
        ${darkMode 
          ? 'bg-blue-500' 
          : 'bg-blue-600'
        }
      `}
    />
  );
};

const AppContent = () => {
  const { darkMode } = useTheme();
  const location = useLocation();
  
  return (
    <div className="relative min-h-screen">
      {/* Background Gradient */}
      <div className={`
        fixed inset-0 transition-colors duration-300 -z-10
        ${darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
        }
      `} />
      
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative flex flex-col min-h-screen"
      >
        {/* Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 container mx-auto px-6 sm:px-8 lg:px-12 py-8 mt-16 bg-background">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <AppRoutes />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Toast Container */}
        <ThemedToastContainer />
      </motion.div>
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;