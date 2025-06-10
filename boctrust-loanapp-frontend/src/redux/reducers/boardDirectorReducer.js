import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//fetch accounts
const apiUrl = import.meta.env.VITE_BASE_URL;

const API_ENDPOINT = `${apiUrl}/api/board-member/fetch-all`;

// Thunk to fetch account from the API
export const fetchDirectors = createAsyncThunk(
  "directors/fetchDirectors",
  async () => {
    const response = await axios.get(API_ENDPOINT);
    return response.data;
  }
);

// account slice
const directorsSlice = createSlice({
  name: "directors",
  initialState: {
    directors: [],
    status: "idle",
    error: null,
  },
  
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDirectors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDirectors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.directors = action.payload;
      })
      .addCase(fetchDirectors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default directorsSlice.reducer;
