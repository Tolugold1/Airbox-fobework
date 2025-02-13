// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../services/api';

// Async thunk for logging in the user
export const createBookingItem = createAsyncThunk(
  'create/bookingItem',
  async (credentials, thunkAPI) => {
    try {
        // Adjust the API endpoint as needed.
        const response = await api.post('/api/booking/create-booking-item', credentials);
        // Assume your backend returns an object with { user, token }
        return response.data.data;
    } catch (error) {
        console.log('Login error:', error);
        return thunkAPI.rejectWithValue(error.response.data.message || error.response.data.status);
    }
  }
);

const createBookingItemSlice = createSlice({
  name: 'create-booking-item',
  initialState: { createBusinessBookingItem: null, status: 'idle', createBusinessBookingItemError: null },
  reducers: {
    clearBookingItem: (state) => {
        state.successMessage = null;
        state.createBusinessBookingItemError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBookingItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createBookingItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.createBusinessBookingItem = action.payload;
      })
      .addCase(createBookingItem.rejected, (state, action) => {
        state.status = 'failed';
        state.createBusinessBookingItemError = action.payload;
      });
  }
});

export const { clearBookingItem } = createBookingItemSlice.actions;

export default createBookingItemSlice.reducer;
