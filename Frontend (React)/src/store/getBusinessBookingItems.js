// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../services/api';
// Async thunk for logging in the user
export const getBusinessBookingItem = createAsyncThunk(
  'get/bookingItem',
  async (credentials, thunkAPI) => {
    try {
        // Adjust the API endpoint as needed.
        const response = await api.get(`/api/booking/created-booking-item/${credentials}`);
        // Assume your backend returns an object with { user, token }
        return response.data.data.businessItems;
    } catch (error) {
        console.log('Login error:', error);
        return thunkAPI.rejectWithValue(error.response.data.message || error.response.data.status);
    }
  }
);

const getBusinessBookingItemSlice = createSlice({
  name: 'get-business-booking-item',
  initialState: { items: [], status: 'idle', itemsError: null },
  reducers: {
    clearBusinessBookingItem: (state) => {
        state.items = [];
        state.status = "idle";
        state.itemsError = null;
    },
    setBusinessBookingItem: (state, action) => {
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBusinessBookingItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getBusinessBookingItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(getBusinessBookingItem.rejected, (state, action) => {
        state.status = 'failed';
        state.itemsError = action.payload;
      });
  }
});

export const { clearBusinessBookingItem, setBusinessBookingItem } = getBusinessBookingItemSlice.actions;

export default getBusinessBookingItemSlice.reducer;
