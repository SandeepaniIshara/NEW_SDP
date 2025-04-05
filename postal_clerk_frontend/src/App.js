import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './authContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Login from './components/login/Login';
import Register from './components/signup/Register';
import Dashboard from './components/dashboard/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MailManagement from './pages/MailManagement';
import BillPayment from './pages/BillPayment';
import Sidebar from './components/sidebar/Sidebar';
import AddMail from './components/MailManagement/AddMail';
import AddBill from './components/BillPayment/AddBill';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={5000} />
        <Sidebar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Single Mail Management Route */}
          <Route path="/mailManagement" element={
            <ProtectedRoute>
              <MailManagement />
            </ProtectedRoute>
          } />
          <Route path="/mailManagement/add" element={
            <ProtectedRoute>
              <AddMail />
            </ProtectedRoute>
          } />
          <Route path="/mailManagement/edit/:id" element={
            <ProtectedRoute>
              <AddMail />
            </ProtectedRoute>
          } />
          <Route path="/billPayment" element={
            <ProtectedRoute>
              <BillPayment />
           </ProtectedRoute>
          } />
          <Route path="/billPayment/add" element={
            <ProtectedRoute>
              <AddBill />
            </ProtectedRoute>
          } />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;