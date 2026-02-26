import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "../../hooks/use-toast";
import {allOrdersApi, updateOrderStatusApi, cancelOrderApi} from "./oderApi.js"

const initialState = {
  loading: false,
  updating: false, 
  orders: [],
  error: null,
};


export const allOrders = createAsyncThunk(
  "order/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await allOrdersApi();
      return data.orders;
    } catch (err) {
      const message = err?.message || "Failed to get all orders";
      toast({ title: "Error", description: message, variant: "destructive" });
      return rejectWithValue(message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const data = await updateOrderStatusApi({ orderId, status });
      return data.order; 
    } catch (err) {
      const message = err?.message || "Failed to update order status";
      toast({ title: "Error", description: message, variant: "destructive" });
      return rejectWithValue(message);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "order/cancel",
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await cancelOrderApi(orderId);
      return data.order; 
    } catch (err) {
      const message = err?.message || "Failed to cancel order";
      toast({ title: "Error", description: message, variant: "destructive" });
      return rejectWithValue(message);
    }
  }
);


const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetOrder(state) {
      state.loading = false;
      state.updating = false;
      state.orders = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(allOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(allOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(allOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateOrderStatus.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updating = false;
        const updatedOrder = action.payload;
        if (updatedOrder?._id) {
          const idx = state.orders.findIndex((o) => o._id === updatedOrder._id);
          if (idx !== -1) {
            state.orders[idx] = updatedOrder;
          }
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      .addCase(cancelOrder.pending, (state) => {
        state.updating = true;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.updating = false;
        const updatedOrder = action.payload;
        if (updatedOrder?._id) {
          const idx = state.orders.findIndex((o) => o._id === updatedOrder._id);
          if (idx !== -1) {
            state.orders[idx] = updatedOrder;
          }
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;