import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "../../hooks/use-toast";
import { allOrdersApi } from "./oderApi";

const initialState = {
  loading: false,
  orders: [],
  error: null,
};


export const allOrders = createAsyncThunk(
  "order/get",
  async (_, { rejectWithValue }) => {
    try {
      const data = await allOrdersApi();      
      return data.orders;
    } catch (err) {
      const message = err?.message || "Failed to get all orders";

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });

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
      state.orders = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //all product

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
      });
  },
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
