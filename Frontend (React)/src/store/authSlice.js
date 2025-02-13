// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../services/api';

// Async thunk for logging in the user
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
        // Adjust the API endpoint as needed.
        const response = await api.post('/api/auth/login', credentials);
        // Assume your backend returns an object with { user, token }
        return response.data.data;
    } catch (error) {
        console.log('Login error:', error);
        return thunkAPI.rejectWithValue(error.response.data.message || error.response.data.status);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, status: 'idle', error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.acctType = null;
      state.profile_status = null;
      state.status = "idle"
    },
    setAuthMessage: (state, action) => {
        state.successMessage = action.payload;
    },
    clearAuthMessage: (state) => {
        state.successMessage = null;
        state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.acctType = action.payload.profile_status.AcctType;
        state.profile_status = action.payload.profile_status.profile_status;
        state.refreshtoken = action.payload.refreshtoken;
        state.lastpage = action.payload.lastpage;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { logout,setAuthMessage, clearAuthMessage } = authSlice.actions;

export default authSlice.reducer;
