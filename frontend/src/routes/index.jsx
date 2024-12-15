import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Board from '../pages/Board';
import CreateBoard from '../pages/CreateBoard';
import EditBoard from '../pages/EditBoard';
import ProjectDetails from '../pages/ProjectDetails';
import ProjectSettings from '../pages/ProjectSettings';
import CookiePolicy from '../pages/legal/CookiePolicy';
import PrivacyPolicy from '../pages/legal/PrivacyPolicy';
import TermsOfService from '../pages/legal/TermsOfService';
import Security from '../pages/legal/Security';
import Features from '../pages/product/Features';
import Pricing from '../pages/product/Pricing';
import About from '../pages/company/About';
import Blog from '../pages/company/Blog';
import Careers from '../pages/company/Careers';
import ContactSales from '../pages/company/ContactSales';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user ? children : <Navigate to="/login" replace />;
};

// Public Route Component (accessible only when not logged in)
const PublicRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return !user ? children : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Public Routes */}
      <Route path="/product/features" element={<Features />} />
      <Route path="/product/pricing" element={<Pricing />} />

      <Route path="/company/about" element={<About />} />
      <Route path="/company/blog" element={<Blog />} />
      <Route path="/company/careers" element={<Careers />} />
      <Route path="/company/contact" element={<ContactSales />} />

      <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/legal/terms-of-service" element={<TermsOfService />} />
      <Route path="/legal/security" element={<Security />} />
      <Route path="/legal/cookie-policy" element={<CookiePolicy />} />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/boards" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/board/:boardId" element={<ProtectedRoute><Board /></ProtectedRoute>} />
      <Route path="/create-board" element={<ProtectedRoute><CreateBoard /></ProtectedRoute>} />
      <Route path="/edit-board/:boardId" element={<ProtectedRoute><EditBoard /></ProtectedRoute>} />
      <Route path="/project/:projectId" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
      <Route path="/project/:projectId/settings" element={<ProtectedRoute><ProjectSettings /></ProtectedRoute>} />

      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
