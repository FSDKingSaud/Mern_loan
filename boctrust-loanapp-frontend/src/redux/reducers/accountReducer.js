import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import apiClient from '../../lib/axios';

//fetch accounts
  
const API_ENDPOINT = `/account/accounts`;

// Thunk to fetch account from the API
export const fetchAccount = createAsyncThunk('account/fetchAccount', async () => {
    const response = await apiClient.get(API_ENDPOINT);
  return response.data;
});


// Thunk to fetch customers bankone account from the API
export const fetchCustomerAccounts = createAsyncThunk(
  "account/fetchCustomerAccounts",
  async (customerId) => {
    const response = await apiClient.get(`/bankone/getCustomerAccountsByBankoneId/${customerId}`);

    return response.data.Accounts;
  }
);

// account slice
const accountSlice = createSlice({
  name: 'account',
  initialState: {
    accounts: [],
    customerAccounts: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccount.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accounts = action.payload;
      })
      .addCase(fetchAccount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })


      .addCase(fetchCustomerAccounts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCustomerAccounts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.customerAccounts = action.payload;
      })
      .addCase(fetchCustomerAccounts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      ;
  },
});

export default accountSlice.reducer;
