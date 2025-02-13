// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import BusinessDashboard from './pages/BusinessDashboard';
import ClientDashboard from './pages/ClientDashboard';
import ProtectedRoute from './components/protectedRoute';
import ServicePage from './pages/BusinessServicePage';
import ClientProfilePage from "./pages/clientProfile";
import BusinessHOC from './layout/businessHOC';
import BusinessProfilePage from "./pages/businessProfile";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Routes */}
        <Route element={<BusinessHOC />}>
          <Route element={<ProtectedRoute requiredRole="Official" />}>
            <Route path="/business-dashboard" element={<BusinessDashboard />} />
            <Route path="/business-service" element={<ServicePage />} />
            <Route path="/business-profile" element={<BusinessProfilePage />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute requiredRole="Client" />}>
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/client-profile" element={<ClientProfilePage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
