import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCartApi,
  addToCartApi,
  updateCartApi,
  removeFromCartApi,
  clearCartApi,
} from "./cartApi";
import toast from "react-hot-toast";


export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCartApi();
      return data.cartItems;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/add",
  async (productId, { rejectWithValue }) => {
    try {
      const data = await addToCartApi(productId);
      toast.success(data.message);
      return data.cartItems;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/update",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const data = await updateCartApi(productId, quantity);
      return data.cartItems;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (productId, { rejectWithValue }) => {
    try {
      const data = await removeFromCartApi(productId);
      toast.success("Item removed");
      return data.cartItems;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      const data = await clearCartApi();
      toast.success("Cart cleared");
      return data.cartItems;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err.message);
    }
  }
);


const countItems = (cartItems = []) => cartItems.length;

const countTotalQuantity = (cartItems = []) =>
  cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);


const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    itemCount: 0,      
    totalQuantity: 0,  
    loading: false,
    error: null,
  },
  reducers: {
    resetCart(state) {
      state.cartItems = [];
      state.itemCount = 0;
      state.totalQuantity = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.loading = false;
          state.cartItems = action.payload ?? [];
          state.itemCount = countItems(state.cartItems);
          state.totalQuantity = countTotalQuantity(state.cartItems);
        }
      )

      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;


export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectItemCount = (state) => state.cart.itemCount;    
export const selectTotalQuantity = (state) => state.cart.totalQuantity; 