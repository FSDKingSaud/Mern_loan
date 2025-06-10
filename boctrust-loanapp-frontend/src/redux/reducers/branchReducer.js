import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

//fetch branches
const apiUrl = import.meta.env.VITE_BASE_URL;
  
const API_ENDPOINT = `${apiUrl}/api/branch/branches`;

// Thunk to fetch branch from the API
export const fetchBranches = createAsyncThunk('branch/fetchBranches', async () => {
    const response = await axios.get(API_ENDPOINT);
  return response.data;
});

// product slice
const branchSlice = createSlice({
  name: 'branch',
  initialState: {
    branches: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.branches = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default branchSlice.reducer;
