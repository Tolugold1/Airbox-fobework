// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../services/api';

// Async thunk for logging in the user
export const getClientBookingItem = createAsyncThunk(
  'get/bookingItem',
  async (credentials, thunkAPI) => {
    try {
        // Adjust the API endpoint as needed.
        const response = await api.get('/api/booking/get-client-bookings', credentials);
        // Assume your backend returns an object with { user, token }
        return response.data.data;
    } catch (error) {
        console.log('Login error:', error);
        return thunkAPI.rejectWithValue(error.response.data.message || error.response.data.status);
    }
  }
);

const getClientBookingItemSlice = createSlice({
  name: 'get-client-booking-item',
  initialState: { clientBooking: null, status: 'idle', clientBookingError: null },
  reducers: {
    clearClientBookingItem: (state) => {
        state.successMessage = null;
        state.clientBookingError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClientBookingItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getClientBookingItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.clientBooking = action.payload;
      })
      .addCase(getClientBookingItem.rejected, (state, action) => {
        state.status = 'failed';
        state.clientBookingError = action.payload;
      });
  }
});

export const { clearClientBookingItem } = getClientBookingItemSlice.actions;

export default getClientBookingItemSlice.reducer;
