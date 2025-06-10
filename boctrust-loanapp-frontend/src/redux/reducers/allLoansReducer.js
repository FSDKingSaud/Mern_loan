import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// fetch loans loan
const apiUrl = import.meta.env.VITE_BASE_URL;
  
const API_ENDPOINT = `${apiUrl}/api/loans/all`;

// Thunk to fetch loans loan from the API
export const fetchAllLoans = createAsyncThunk('loans/fetchLoan', async () => {
    const response = await axios.get(API_ENDPOINT);
  return response.data;
});

// loans slice
const allLoanSlice = createSlice({
  name: 'loans',
  initialState: {
    loans: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllLoans.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllLoans.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loans = action.payload;
      })
      .addCase(fetchAllLoans.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default allLoanSlice.reducer;
