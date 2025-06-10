import { createSlice } from "@reduxjs/toolkit";



// account slice
const onboarding = createSlice({
  name: "onboarding",
  initialState: {},
  reducers: {
    updateOnboardingStateValues: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },
  },
  extraReducers: () => {},
});

export const { updateOnboardingStateValues } = onboarding.actions;

export default onboarding.reducer;
