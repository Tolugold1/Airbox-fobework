// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../services/api';

// Async thunk for logging in the user
export const createClientProfile = createAsyncThunk(
  'get/clientProfile',
  async (credentials, thunkAPI) => {
    try {
        // Adjust the API endpoint as needed.
        const response = await api.post('/api/client/create-profile', credentials);
        // Assume your backend returns an object with { user, token }
        return response.data.data;
    } catch (error) {
        console.log('Login error:', error);
        return thunkAPI.rejectWithValue(error.response.data.message || error.response.data.status);
    }
  }
);

const createClientProfileSlice = createSlice({
  name: 'create-client-profile',
  initialState: { createProfileClient: null, status: 'idle', createProfileClientError: null },
  reducers: {
    // updateProfile: (state, action) => {
    //     state.clientProfile = action.payload;
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createClientProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createClientProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.createProfileClient = action.payload;
      })
      .addCase(createClientProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.createProfileClientError = action.payload;
      });
  }
});

// export const { updateProfile } = createClientProfileSlice.actions;

export default createClientProfileSlice.reducer;
