// src/components/ProtectedRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ requiredRole }) => {
  const { acctType, status } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  console.log('acctType:', acctType);
  console.log('status:', status);

  // If no acctType is logged in, redirect to login.
  if (status !== "succeeded") {
    return navigate('/login');
  }

  // If a role is required but the acctType doesn't match, redirect to the home page.
  if (requiredRole && acctType !== requiredRole) {
    return navigate('/login');
  } else {
    return (
        <Outlet />
    );
  }
};

export default ProtectedRoute;
