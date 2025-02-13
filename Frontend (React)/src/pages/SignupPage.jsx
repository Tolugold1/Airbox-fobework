import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { FiArrowLeft } from "react-icons/fi";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const SignupPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [ acctType, setAcctType ] = useState(null);

  const onSubmit = async (data) => {
    try {
      data.acctType = acctType;
      // Dispatch the login action
      const resultAction = await api.post('/api/auth/signup', data);
      console.log('resultAction:', resultAction.data);
      if (resultAction.data.status == 'User registered successfully, An OTP has been sent to your email for confirmation') {

        toast.success("Sign up successful! Please check your email to verify your account.", {
          position: "top-center",
          autoClose: 5000,
        });
    
        setTimeout(() => {
          navigate("/login"); // Redirect after 3 seconds
        }, 3000);
      } else {
        // Handle errors (you could show a toast or error message here)
        console.error('Failed to signup:', resultAction);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e] p-4">
      {/* Back to Home Button */}
      <Link to="/" className="absolute top-4 left-4 text-gray-400 hover:text-pink-400 flex items-center">
        <FiArrowLeft className="mr-2" /> Home
      </Link>

      <div className="bg-[#29293f] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white text-center">Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-gray-400">Full Name:</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-2 bg-[#1a1a2e] text-white rounded border border-gray-600 focus:border-pink-500 focus:ring focus:ring-pink-500 outline-none"
              {...register("name", { required: "Full Name is required" })}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-400">Email:</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-2 bg-[#1a1a2e] text-white rounded border border-gray-600 focus:border-pink-500 focus:ring focus:ring-pink-500 outline-none"
              {...register("email", { required: "Email is required" })}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-400">Password:</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-2 bg-[#1a1a2e] text-white rounded border border-gray-600 focus:border-pink-500 focus:ring focus:ring-pink-500 outline-none"
              {...register("password", { required: "Password is required" })}
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-400">Confirm Password:</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-2 bg-[#1a1a2e] text-white rounded border border-gray-600 focus:border-pink-500 focus:ring focus:ring-pink-500 outline-none"
              {...register("confirmPassword", { required: "Confirm Password is required" })}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>

          {/* Account Type Selection */}
          <div className='flex items-center justify-between'>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="isBusiness"
                name="check"
                className="mr-2"
                checked={acctType == "Official"}
                onChange={() => setAcctType("Official")}
              />
              <label htmlFor="isBusiness" className="text-gray-400">
                Login as Business
              </label>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="isClient"
                name="check"
                className="mr-2"
                checked={acctType == "Client"}
                onChange={() => setAcctType("Client")}
              />
              <label htmlFor="isClient" className="text-gray-400">
                Login as Client
              </label>
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-orange-400 py-2 rounded text-white font-semibold hover:opacity-90"
          >
            Sign Up
          </button>
        </form>

        {/* Google Sign-Up Button */}
        <div className="mt-4">
          <button
            className="w-full flex items-center justify-center bg-white text-gray-700 py-2 rounded font-semibold hover:bg-gray-100 shadow-md transition"
          >
            <FcGoogle className="mr-2 text-2xl" />
            Sign up with Google
          </button>
        </div>

        {/* Redirect to Login */}
        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-400 font-semibold">Log In</Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignupPage;
