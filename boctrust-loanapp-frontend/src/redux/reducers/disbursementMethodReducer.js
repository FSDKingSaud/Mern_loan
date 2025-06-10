import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../lib/axios';

//fetch disbursement
const apiUrl = import.meta.env.VITE_BASE_URL;
  
const API_ENDPOINT = `/disbursement/disbursements`;

// Thunk to fetch disbursement from the API
export const fetchDisbursements = createAsyncThunk('disbursement/fetchDisbursements', async () => {
    const response = await apiClient.get(API_ENDPOINT);
  return response.data;
});

// disbursement slice
const disbursementSlice = createSlice({
  name: 'disbursement',
  initialState: {
    disbursements: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDisbursements.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDisbursements.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.disbursements = action.payload;
      })
      .addCase(fetchDisbursements.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default disbursementSlice.reducer;
