import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { logout } from '../store/authSlice';
import { setSearchQuery } from '../store/boardSlice';
import {
  FaHome,
  FaTasks,
  FaUserCircle,
  FaBell,
  FaSearch,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import Logo from './Logo';
import { ThemeToggle } from './theme-toggle';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setLocalSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-menu') && !event.target.closest('.mobile-menu')) {
        setShowProfileMenu(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const debouncedSearch = useCallback((callback, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(...args), delay);
    };
  }, []);

  const debouncedDispatch = useCallback(
    debouncedSearch((query) => {
      dispatch(setSearchQuery(query));
    }, 300),
    [dispatch]
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setLocalSearchQuery(query);
    debouncedDispatch(query);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setShowProfileMenu(false);
    setIsMobileMenuOpen(false);
  };

  if (!user) {
    return (
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md dark:bg-gray-800' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md dark:bg-gray-800' : 'bg-white dark:bg-gray-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <NavLink to="/" icon={FaHome} text="Home" />
              <NavLink to="/dashboard" icon={FaTasks} text="Boards" />
            </div>
          </div>

          {/* Search Bar - Hidden on Mobile */}
          <div className="hidden md:flex flex-1 max-w-md px-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search boards..."
                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button>

            {/* Desktop Profile Menu */}
            <div className="hidden md:block relative profile-menu">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <FaUserCircle className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                )}
                <span className="text-gray-800 dark:text-white">{user.name}</span>
              </button>

              {/* Desktop Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <FaUserCircle />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
              {/* Mobile Search */}
              <div className="px-2 py-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search boards..."
                    className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              {/* Mobile Navigation Links */}
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <FaHome />
                  <span>Home</span>
                </div>
              </Link>
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <FaTasks />
                  <span>Boards</span>
                </div>
              </Link>
              
              {/* Mobile Profile Options */}
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <FaUserCircle />
                  <span>Profile</span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <div className="flex items-center space-x-2">
                  <FaSignOutAlt />
                  <span>Logout</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// NavLink component for consistent styling
const NavLink = ({ to, icon: Icon, text }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
      }`}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <Icon className="text-xl" />
      </motion.div>
      <motion.span
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {text}
      </motion.span>
    </Link>
  );
};

export default Navbar;