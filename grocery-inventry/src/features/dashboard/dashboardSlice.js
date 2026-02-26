import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "../../hooks/use-toast";
import { getDashboardStatsApi } from "./dashboardApi";

const initialState = {
  loading: false,
  stats: {
    totalProducts: 0,
    outOfStockProducts: 0,
    lowStockProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  },
  recentOrders: [],
  lowStockProductsList: [],
  error: null,
};


export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getDashboardStatsApi();      
      return data; 
    } catch (err) {
      const message = err?.message || "Failed to load dashboard";
      toast({ title: "Error", description: message, variant: "destructive" });
      return rejectWithValue(message);
    }
  }
);


const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.recentOrders = action.payload.recentOrders;
        state.lowStockProductsList = action.payload.lowStockProductsList;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;