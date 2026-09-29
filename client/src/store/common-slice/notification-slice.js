import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  notificationList: [],
  unreadCount: 0,
  isLoading: false,
};

export const fetchNotifications = createAsyncThunk(
  "/notifications/fetchNotifications",
  async ({ userId, role }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/common/notifications/get/${userId}/${role}`
    );
    return response.data;
  }
);

export const markNotificationsRead = createAsyncThunk(
  "/notifications/markNotificationsRead",
  async ({ userId, role }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/common/notifications/mark-as-read/${userId}/${role}`
    );
    return response.data;
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addLiveNotification: (state, action) => {
      // Prepend the new live notification
      state.notificationList.unshift(action.payload);
      state.unreadCount += 1;
    },
    resetUnreadBadge: (state) => {
      state.unreadCount = 0;
      state.notificationList = state.notificationList.map((item) => ({
        ...item,
        isRead: true,
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notificationList = action.payload?.data || [];
        state.unreadCount = action.payload?.unreadCount || 0;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(markNotificationsRead.fulfilled, (state) => {
        state.unreadCount = 0;
        state.notificationList = state.notificationList.map((item) => ({
          ...item,
          isRead: true,
        }));
      });
  },
});

export const { addLiveNotification, resetUnreadBadge } = notificationSlice.actions;

export default notificationSlice.reducer;
