import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Fetch services from businesses
export const fetchBusinessServices = createAsyncThunk(
  "client/fetchServices",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/api/booking/get-all-Booking-Items");
      return response.data.data.allBookedItems;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch services");
    }
  }
);

// Book a service
export const bookService = createAsyncThunk(
  "client/bookService",
  async (service, thunkAPI) => {
    try {
      const response = await api.post(`/api/booking/book-item`, service); // accept clientProfileId, bookedItemId, bookingDetails
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to book service");
    }
  }
);

// Fetch client's booking history
export const fetchClientBookings = createAsyncThunk(
  "client/fetchBookings",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/api/booking");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch bookings");
    }
  }
);

const clientSlice = createSlice({
  name: "client",
  initialState: { services: [], bookings: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessServices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.services = action.payload;
      })
      .addCase(bookService.fulfilled, (state, action) => {
        console.log("Booking successful:", action.payload);
      })
      .addCase(fetchClientBookings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookings = action.payload;
      });
  },
});

export default clientSlice.reducer;
