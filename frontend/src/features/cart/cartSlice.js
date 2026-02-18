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
      toast.success("Added to cart 🛒");
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
      toast.success("Cart updated");
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


const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [], 
    loading: false,
    error: null,
  },
  reducers: {
    resetCart(state) {
      state.cartItems = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") &&
          action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.loading = false;
          state.cartItems = action.payload;
        }
      )

      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
