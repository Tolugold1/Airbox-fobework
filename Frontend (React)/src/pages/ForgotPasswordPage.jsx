// src/pages/ForgotPasswordPage.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const [message, setMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      await api.post('/api/forgot-password', data);
      setMessage('Password reset instructions have been sent to your email.');
    } catch (error) {
      console.error('Error during password reset:', error);
      setMessage('Error processing your request.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        {message && <p className="mb-4 text-center">{message}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-1">Email:</label>
            <input
              type="email"
              className="w-full border border-gray-300 p-2 rounded"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
