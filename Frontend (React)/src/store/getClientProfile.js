// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../services/api';

// Async thunk for logging in the user
export const getClientProfile = createAsyncThunk(
  'get/clientProfile',
  async (credentials, thunkAPI) => {
    try {
        // Adjust the API endpoint as needed.
        const response = await api.get('/api/client/get-profile', credentials);
        // Assume your backend returns an object with { user, token }
        return response.data.data;
    } catch (error) {
        console.log('Login error:', error);
        return thunkAPI.rejectWithValue(error.response.data.message || error.response.data.status);
    }
  }
);

const getClientProfileSlice = createSlice({
  name: 'get-client-profile',
  initialState: { clientProfile: null, status: 'idle', clientProfileError: null },
  reducers: {
    clearClientprofile: (state) => {
        state.clientProfile = null;
        state.status = "idle";
        state.clientProfileError = null;
    },
    updateProfile: (state, action) => {
        state.clientProfile = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClientProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getClientProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.clientProfile = action.payload;
      })
      .addCase(getClientProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.clientProfileError = action.payload;
      });
  }
});

export const { clearClientprofile, updateProfile } = getClientProfileSlice.actions;

export default getClientProfileSlice.reducer;
