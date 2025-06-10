import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "user",
  initialState: {
    unreadNotifications: null,
  },
  reducers: {
    addUnreadNotification: (state, action) => {
      if (state.unreadNotifications) {
        const found = state.unreadNotifications.find(
          (item) => item._id == action.payload._id
        );
        if (!found) {
          state.unreadNotifications.push(action.payload);
        }
      } else {
        state.unreadNotifications = [action.payload];
      }
    },
    emptyUnreadNotifications: (state) => {
      state.unreadNotifications = null;
    },
  },
});

export const { addUnreadNotification, emptyUnreadNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
