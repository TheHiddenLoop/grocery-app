import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProductApi, viewProductApi } from "./productApi";
import toast from "react-hot-toast";

export const viewProduct = createAsyncThunk(
  "product/view-product",
  async (id, thunkAPI) => {
    try {
      const data = await viewProductApi(id);
      console.log(data);

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);


export const getProduct = createAsyncThunk(
  "product/get",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getProductApi();
      return data.products;
    } catch (err) {
      const message = err?.message || "Failed to get products";

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
  initialState: {
    products: [],
    singleProduct: [],
    status: "idle",
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
      // get product
      .addCase(viewProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(viewProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.singleProduct = action.payload;
      })
      .addCase(viewProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      //all product

      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;