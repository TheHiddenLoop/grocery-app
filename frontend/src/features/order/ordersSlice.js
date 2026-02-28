import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { getOrdersApi, cancelOrderApi } from "./ordersApi";


export const getOrders = createAsyncThunk(
  "orders/get",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getOrdersApi();
      return data.orders;
    } catch (err) {
      const message = err?.message || "Failed to get orders";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const cancelOrderThunk = createAsyncThunk(
  "orders/cancel",
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await cancelOrderApi(orderId);
      toast.success("Order cancelled successfully");
      return orderId; 
    } catch (err) {
      const message = err?.message || "Failed to cancel order";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);


const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      if (state.status === "failed") state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // getOrders
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // cancelOrderThunk
      .addCase(cancelOrderThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(cancelOrderThunk.fulfilled, (state, action) => {
        const cancelledId = action.payload;
        const order = state.orders.find((o) => o._id === cancelledId);
        if (order) order.status = "CANCELLED";
      })
      .addCase(cancelOrderThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = orderSlice.actions;
export default orderSlice.reducer;