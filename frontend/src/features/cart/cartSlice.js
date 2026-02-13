import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addCartApi } from "./cartApi"
import toast from "react-hot-toast";

export const addToCart = createAsyncThunk(
  "cart/add",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const { cartItems } = getState().cart;

      const updatedCart = {
        ...cartItems,
        [productId]: (cartItems[productId] || 0) + 1,
      };

      const data = await addCartApi(updatedCart);
      return data.cartItems;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: {},
    loading: false,
    error: null,
  },
  reducers: {
    setCartFromServer: (state, action) => {
      state.cartItems = action.payload || {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error("Cart update failed");
      });
  },
});

export const { setCartFromServer } = cartSlice.actions;
export default cartSlice.reducer;
