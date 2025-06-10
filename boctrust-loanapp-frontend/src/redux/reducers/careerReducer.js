import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

//fetch wiki post
const apiUrl = import.meta.env.VITE_BASE_URL;
  
const API_ENDPOINT = `${apiUrl}/api/career/careers`;

// Thunk to fetch wiki from the API
export const fetchCareer = createAsyncThunk('career/fetchCareer', async () => {
    const response = await axios.get(API_ENDPOINT);
    console.log(response, "response")
  return response.data;
});

// career slice
const careerSlice = createSlice({
  name: 'careers',
  initialState: {
    careers: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCareer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCareer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.careers = action.payload;
      })
      .addCase(fetchCareer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default careerSlice.reducer;
