import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//fetch accounts
const apiUrl = import.meta.env.VITE_BASE_URL;

const API_ENDPOINT = `${apiUrl}/api/site-content/content`;

// Thunk to fetch account from the API
export const fetchContent = createAsyncThunk(
  "siteContent/fetchContent",
  async () => {
    const response = await axios.get(API_ENDPOINT);
    return response.data;
  }
);

// account slice
const siteContentSlice = createSlice({
  name: "siteContent",
  initialState: {
    siteContent: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.siteContent = action.payload;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default siteContentSlice.reducer;
