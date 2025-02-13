// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../services/api';

// Async thunk for logging in the user
export const getBusinessBooking = createAsyncThunk(
  'get/business-booking',
  async (credentials, thunkAPI) => {
    try {
        // Adjust the API endpoint as needed.
        const response = await api.get(`/api/booking/get-business-bookings/${credentials}`);
        // Assume your backend returns an object with { user, token }
        return response.data.data;
    } catch (error) {
        console.log('Login error:', error);
        return thunkAPI.rejectWithValue(error.response.data.message || error.response.data.status);
    }
  }
);

const getBusinessBookingSlice = createSlice({
  name: 'get-business-booking',
  initialState: { businessBookings: null, status: 'idle', businessBookingsError: null },
  reducers: {
    clearBusinessBooking: (state) => {
        state.businessBookings = null;
        state.status = "idle";
        state.businessBookingsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBusinessBooking.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getBusinessBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.businessBookings = action.payload;
      })
      .addCase(getBusinessBooking.rejected, (state, action) => {
        state.status = 'failed';
        state.businessBookingsError = action.payload;
      });
  }
});

export const { clearBusinessBooking } = getBusinessBookingSlice.actions;

export default getBusinessBookingSlice.reducer;
