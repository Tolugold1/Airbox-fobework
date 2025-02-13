// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../services/api';

// Async thunk for logging in the user
export const createBusinessProfile = createAsyncThunk(
  'get/businessProfile',
  async (credentials, thunkAPI) => {
    try {
        // Adjust the API endpoint as needed.
        const response = await api.post('/api/business/create-profile', credentials);
        // Assume your backend returns an object with { user, token }
        return response.data.data;
    } catch (error) {
        console.log('Login error:', error);
        return thunkAPI.rejectWithValue(error.response.data.message || error.response.data.status);
    }
  }
);

const createBusinessProfileSlice = createSlice({
  name: 'create-business-profile',
  initialState: { createProfileBusiness: null, status: 'idle', createProfileBusinessError: null },
  reducers: {
    setProfile: (state, action) => {
        state.clientProfile = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBusinessProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createBusinessProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.createProfileBusiness = action.payload;
      })
      .addCase(createBusinessProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.createProfileBusinessError = action.payload;
      });
  }
});


export default createBusinessProfileSlice.reducer;
