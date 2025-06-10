import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//fetch accounts
const apiUrl = import.meta.env.VITE_BASE_URL;

const API_ENDPOINT = `${apiUrl}/api/products-front-page/fetch-all`;

// Thunk to fetch account from the API
export const fetchFrontPageProduct = createAsyncThunk(
  "fetchProduct/fetchFrontPageProduct",
  async () => {
    const response = await axios.get(API_ENDPOINT);
    return response.data;
  }
);

// account slice
const frontPageProductSlice = createSlice({
  name: "pageProducts",
  initialState: {
    pageProducts: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFrontPageProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFrontPageProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pageProducts = action.payload;
      })
      .addCase(fetchFrontPageProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default frontPageProductSlice.reducer;
