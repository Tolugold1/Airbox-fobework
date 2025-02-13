// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../services/api';
import { backend_url } from "../baseUrl"

// Async thunk for logging in the user
export const loginUserOAuth = createAsyncThunk(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
        // Adjust the API endpoint as needed.
        let url = credentials == "Official" ? '/api/Oauth/google2' : '/api/Oauth/google'
        // const response = await api.get(url);
        window.open(backend_url + `${url}`, "_self");
        // Assume your backend returns an object with { user, token }
        console.log("response", response);
        return response.data.data;
    } catch (error) {
        console.log('Login error:', error);
        return thunkAPI.rejectWithValue(error.response.data.message || error.response.data.status);
    }
  }
);

const googleAuthSlice = createSlice({
  name: 'google',
  initialState: { user: null, token: null, status: 'idle', error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    setAuthMessage: (state, action) => {
        state.successMessage = action.payload;
    },
    clearOAuthMessage: (state) => {
        state.successMessage = null;
        state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserOAuth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUserOAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.acctType = action.payload.profile_status.AcctType;
        state.profile_status = action.payload.profile_status.profile_status;
        state.refreshtoken = action.payload.refreshtoken;
      })
      .addCase(loginUserOAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { logout, setAuthMessage, clearOAuthMessage } = googleAuthSlice.actions;

export default googleAuthSlice.reducer;
