import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../lib/axios"; // Import your API client

// Thunk for logout
export const performLogout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      // Clear any tokens or user data stored in localStorage or sessionStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // Optionally, call an API endpoint to invalidate the session
      await apiClient.post("/logout");

      // Dispatch the logout action to update Redux state
      dispatch(logoutUser());
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    authLoading: false,
  },
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload?.user || action.payload?.customer;
      state.token = action.payload?.user?.token || action.payload?.customer?.token;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(performLogout.pending, (state) => {
        state.authLoading = true; // Set loading state
      })
      .addCase(performLogout.fulfilled, (state) => {
        state.authLoading = false;
        state.user = null; // Clear user
        state.token = null; // Clear token
      })
      .addCase(performLogout.rejected, (state) => {
        state.authLoading = false; // Handle error state
      });
  },
});

export const { loginUser, logoutUser, setToken, setUser, setAuthLoading } =
  authSlice.actions;
export default authSlice.reducer;
