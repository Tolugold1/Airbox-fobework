// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import getClientBookingItemSlice from './getClientBookings';
import getClientProfileSlice from './getClientProfile';
import getBusinessProfileSlice from './getBusinessProfile';
import getBusinessBookingItemSlice from './getBusinessBookingItems';
import createBookingItemSlice from './createBookingItem';
import getBusinessBookingSlice from './getBusinessBookings';
import getBusinessAnalyticsSlice from './businessAnalytics';
import createSlice from "./clientSlice";
import createClientProfile from "./createClientProfile";
import googleAuthSlice from "./goggleOauth"
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import logger from 'redux-logger';


// Define persist configuration for redux-persist
const persistConfig = {
    key: 'root',
    storage,
    whitelist: [
        'auth', 
        "getClientBookingItem", 
        "getClientProfile", 
        "getBusinessProfile", 
        "getBusinessBookingItem",
        "createBookingItem", 
        "getBusinessBooking",
        "getBusinessAnalytics",
        "client",
        "createClientProfile",
        "google"
    ] // Only persist the auth reducer; add others as needed.
};

// Combine your reducers
const rootReducer = combineReducers({
    auth: authReducer,
    getClientBookingItem: getClientBookingItemSlice,
    getClientProfile: getClientProfileSlice,
    getBusinessProfile: getBusinessProfileSlice,
    getBusinessBookingItem: getBusinessBookingItemSlice,
    createBookingItem: createBookingItemSlice,
    getBusinessBooking: getBusinessBookingSlice,
    getBusinessAnalytics: getBusinessAnalyticsSlice,
    client: createSlice,
    createClientProfile: createClientProfile,
    google: googleAuthSlice
    // Add additional reducers here
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with persisted reducer and logger middleware.
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check for redux-persist non-serializable data
      serializableCheck: false,
    }).concat(logger),
});

// Create the persistor for use with PersistGate
export const persistor = persistStore(store);

export default store;