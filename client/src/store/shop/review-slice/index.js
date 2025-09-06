import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
};

//  Add Review
export const addReview = createAsyncThunk(
  "/order/addReview",
  async (formdata, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/review/add`,
        formdata
      );
      return response.data; // success case
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Something went wrong",
        }
      );
    }
  }
);

//  Get Reviews
export const getReviews = createAsyncThunk("/order/getReviews", async (id) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/shop/review/${id}`
  );
  return response.data;
});

//  Delete Review
export const deleteReview = createAsyncThunk(
  "/order/deleteReview",
  async ({ reviewId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/shop/review/delete`,
        { data: { reviewId, userId } }
      );
      return { ...response.data, reviewId }; // include reviewId for state update
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to delete review",
        }
      );
    }
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Reviews
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      })

      // Delete Review
      .addCase(deleteReview.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.reviews = state.reviews.filter(
            (review) => review._id !== action.payload.reviewId
          );
        }
      })
      .addCase(deleteReview.rejected, (state) => {
        // no state change if failed
      });
  },
});

export default reviewSlice.reducer;
