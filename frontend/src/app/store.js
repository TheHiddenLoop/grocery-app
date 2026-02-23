import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/auth/authSlice.js"
import productReducer from "../features/product/productSlice.js"
import cartReducer from "../features/cart/cartSlice";
import paymentReducer from "../features/payment/paymentSlice.js"
import addressReducer from "../features/address/addressSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    payment: paymentReducer,
    address: addressReducer
  },
});