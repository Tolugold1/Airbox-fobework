// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../services/api';

// Async thunk for logging in the user
export const getBusinessProfile = createAsyncThunk(
  'get/businessProfile',
  async (thunkAPI) => {
    try {
        // Adjust the API endpoint as needed.
        const response = await api.get('/api/business/get-profile');
        // Assume your backend returns an object with { user, token }
        return response.data.data;
    } catch (error) {
        console.log('Login error:', error);
        return thunkAPI.rejectWithValue(error.response.data.message || error.response.data.status);
    }
  }
);

const getBusinessProfileSlice = createSlice({
  name: 'get-business-profile',
  initialState: { businessProfile: null, status: 'idle', businessProfileError: null },
  reducers: {
    clearBusinessprofile: (state) => {
        state.businessProfile = null;
        state.status = "idle";
        state.businessProfileError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBusinessProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getBusinessProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.businessProfile = action.payload;
      })
      .addCase(getBusinessProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.businessProfileError = action.payload;
      });
  }
});

export const { clearBusinessprofile } = getBusinessProfileSlice.actions;

export default getBusinessProfileSlice.reducer;
