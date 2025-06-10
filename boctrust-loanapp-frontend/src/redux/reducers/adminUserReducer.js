import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiClient from "../../lib/axios";

//fetch admin

// Thunk to fetch admin from the API
export const fetchAdmins = createAsyncThunk(
  "admin/fetchAdmins",
  async (searchTerm) => {
   
    let pathUrl = `/admin/users`;
    if (searchTerm) {
      pathUrl = pathUrl + `?search=${searchTerm}`;
    }
    const response = await apiClient.get(pathUrl);
    return response.data;
  }
);
// Thunk to fetch admin with role Type
export const fetchAdminsByRole = createAsyncThunk(
  "admin/fetchAdminsByRole",
  async (roleId) => {
    const response = await apiClient.get(`/admin/users/${roleId}`);
    return response.data;
  }
);

export const fetchRolesAndPermisions = createAsyncThunk(
  "admin/fetchRolesAndPermisions",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get(`/role`);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const fetchPermissions = createAsyncThunk(
  "admin/fetchPermissions",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get(`/role/permission`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const addNewRole = createAsyncThunk(
  "admin/addNewRole",
  async (payload, thunkAPI) => {
    try {
      console.log("HEDA",payload)
      await apiClient.post(`/role`, payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Something went wrong"
      );
    }
  }
);
export const updateRole = createAsyncThunk(
  "admin/updateRole",
  async ({ payload, roleId }, thunkAPI) => {
    try {
      await apiClient.put(`/role/${roleId}`, payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// admin slice
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admins: [],
    filteredAdmins: [],
    rolesAndPermission: null,
    allPermisions: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.admins = action.payload;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAdminsByRole.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdminsByRole.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.filteredAdmins = action.payload;
      })
      .addCase(fetchAdminsByRole.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchRolesAndPermisions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRolesAndPermisions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rolesAndPermission = action.payload;
      })
      .addCase(fetchRolesAndPermisions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchPermissions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allPermisions = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewRole.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNewRole.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(addNewRole.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default adminSlice.reducer;
