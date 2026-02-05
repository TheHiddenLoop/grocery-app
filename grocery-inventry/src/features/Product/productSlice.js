import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addProductApi } from "./productApi";
import { toast } from "../../hooks/use-toast";

const initialState = {
  loading: false,
  product: null,
  error: null,
};

export const addProduct = createAsyncThunk(
  "product/add",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const data = await addProductApi(formData);

      toast({
        title: "Product Added!",
        description: data.message,
      });

      return data;
    } catch (err) {
      const message = err?.message || "Failed to add product";

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });

      return rejectWithValue(message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetProduct(state) {
      state.loading = false;
      state.product = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetProduct } = productSlice.actions;
export default productSlice.reducer;
