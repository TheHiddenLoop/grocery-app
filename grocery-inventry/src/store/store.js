import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/Product/productSlice";
import authReducer from "../features/auth/authSlice";
import orderReducer from "../features/order/orderSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice"

export const store = configureStore({
  reducer: {
    product: productReducer,
    auth : authReducer,
    orders: orderReducer,
    dashboard: dashboardReducer,
  },
});
