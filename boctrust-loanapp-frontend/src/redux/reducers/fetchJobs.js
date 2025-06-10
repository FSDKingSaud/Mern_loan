import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    jobs: [],
    loading: false,
    error: null
};

const fetchJobsSlice = createSlice({
    name: "fetchJobs",
    initialState,
    reducers: {
        fetchJobsPending: (state) => {
            state.loading = true;
        },
        fetchJobsSuccess: (state, { payload }) => {
            state.jobs = payload;
            state.loading = false;
            state.error = null;
        },
        fetchJobsError: (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        }
    }
});

export const { fetchJobsPending, fetchJobsSuccess, fetchJobsError } = fetchJobsSlice.actions;

export default fetchJobsSlice.reducer;