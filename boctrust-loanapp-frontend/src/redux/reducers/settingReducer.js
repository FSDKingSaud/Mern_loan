import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//fetch accounts
const apiUrl = import.meta.env.VITE_BASE_URL;

const API_ENDPOINT = `${apiUrl}/api/settings/settings`;

// Thunk to fetch account from the API
export const fetchSetting = createAsyncThunk(
  "setting/fetchSetting",
  async () => {
    const response = await axios.get(API_ENDPOINT);
    return response.data;
  }
);

// account slice
const settingSlice = createSlice({
  name: "settings",
  initialState: {
    settings: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSetting.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSetting.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.settings = action.payload;
      })
      .addCase(fetchSetting.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default settingSlice.reducer;
