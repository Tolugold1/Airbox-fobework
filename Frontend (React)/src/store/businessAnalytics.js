// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../services/api';

// Async thunk for logging in the user
export const getBusinessAnalytics = createAsyncThunk(
  'create/bookingItem',
  async (credentials, thunkAPI) => {
    try {
        // Adjust the API endpoint as needed.
        const response = await api.get(`/api/businessAnalytics/get-analytics/${credentials.businessId}/${credentials.timeframe}`);
        // Assume your backend returns an object with { user, token }
        return response.data.data;
    } catch (error) {
        console.log('Login error:', error);
        return thunkAPI.rejectWithValue(error.response.data.message || error.response.data.status);
    }
  }
);

const getBusinessAnalyticsSlice = createSlice({
  name: 'analytics',
  initialState: { analytics: null, status: 'idle', analyticsError: null },
  reducers: {
    clearAnalytics: (state) => {
        state.successMessage = null;
        state.analyticsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBusinessAnalytics.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getBusinessAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.analytics = action.payload;
      })
      .addCase(getBusinessAnalytics.rejected, (state, action) => {
        state.status = 'failed';
        state.analyticsError = action.payload;
      });
  }
});

export const { clearAnalytics } = getBusinessAnalyticsSlice.actions;

export default getBusinessAnalyticsSlice.reducer;
