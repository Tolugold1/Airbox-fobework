import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { FiArrowLeft } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';
import { setAuthMessage, clearAuthMessage } from '../store/authSlice';
import { clearClientBookingItem } from "../store/getClientBookings";
import { clearClientprofile } from "../store/getClientProfile";
import { clearBusinessprofile } from "../store/getBusinessProfile";
import { clearBusinessBooking } from "../store/getBusinessBookings";
import { clearBusinessBookingItem } from "../store/getBusinessBookingItems";
import { clearAnalytics } from "../store/businessAnalytics";
import { loginUserOAuth, clearOAuthMessage } from "../store/goggleOauth";


const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let { acctType, error } = useSelector((state) => state.auth);
  const [ acctTypeT, setAcctType ] = useState(null);

  const google = useSelector((state) => state.google);

  useEffect(() => {
    dispatch(clearClientprofile());
    dispatch(clearClientBookingItem());
    dispatch(clearAnalytics());
    dispatch(clearBusinessBookingItem());
    dispatch(clearBusinessBooking());
    dispatch(clearBusinessprofile());
  }, []);

  console.log("error", error);
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        toast.error(error, {
          position: "top-center",
        });
      }, 50);
      dispatch(clearAuthMessage());
    }

    if (google.error) {
      setTimeout(() => {
        toast.error(error, {
          position: "top-center",
        });
      }, 50);
      dispatch(clearOAuthMessage());
    }
  }, [error]);

  const handleGoogleSignIn = async () => {
    try {
      if (acctTypeT == null) {
        toast("Please select the account type you would like to log in to", {
          position: "top-center"
        })
      } else {
        if (acctTypeT == "Official") {
          await dispatch(loginUserOAuth("Official"));
        } else {
          await dispatch(loginUserOAuth("Client"));
        }
      }
    } catch (error) {
      console.error('Error during Google sign-in:', error)
      // dispatch the error

    }
  }
  console.log("acctType", acctType);

  const onSubmit = async (data) => {
    try {
      data.acctType = acctTypeT;
      // Dispatch the login action
      const resultAction = await dispatch(loginUser(data));
      console.log('resultAction:', resultAction);
      if (resultAction.payload.status == 'Sign in successful' && resultAction.payload.statusCode == 200) {
        // Redirect based on the checkbox (isBusiness) value.
        if (data.acctType == "Official" && acctType == "Official") {
          navigate('/business-dashboard');
        } else if ( data.acctType == "Client"  && acctType == "Client"){
          navigate('/client-dashboard');
        }
      } else {
        // Handle errors (you could show a toast or error message here)
        console.error('Failed to login:', resultAction.error.message);
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
        <h2 className="text-2xl font-bold text-white text-center">Sign In</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          {/* Username / Email Field */}
          <div className="mb-4">
            <label className="block text-gray-400">Email/Username:</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-2 bg-[#1a1a2e] text-white rounded border border-gray-600 focus:border-pink-500 focus:ring focus:ring-pink-500 outline-none"
              {...register('username', { required: 'Email/Username is required' })}
              placeholder="Enter your email or username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-gray-400">Password:</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-2 bg-[#1a1a2e] text-white rounded border border-gray-600 focus:border-pink-500 focus:ring focus:ring-pink-500 outline-none"
              {...register('password', { required: 'Password is required' })}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Checkbox to Select Business or Client */}
          <div className='flex items-center justify-between'>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="isBusiness"
                name="check"
                className="mr-2"
                checked={acctTypeT == "Official"}
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
                checked={acctTypeT == "Client"}
                onChange={() => setAcctType("Client")}
              />
              <label htmlFor="isClient" className="text-gray-400">
                Login as Client
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-orange-400 py-2 rounded text-white font-semibold hover:opacity-90"
          >
            Login
          </button>
        </form>

                {/* Google Sign-In Button */}
        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center bg-white text-gray-700 py-2 rounded font-semibold hover:bg-gray-100 shadow-md transition"
          >
            <FcGoogle className="mr-2 text-2xl" />
            Sign in with Google
          </button>
        </div>

        {/* Forgot Password */}
        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-pink-400">
            Forgot Password?
          </Link>
        </div>

        {/* Signup Redirect */}
        <p className="text-gray-400 text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-pink-400 font-semibold">Sign Up</Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
