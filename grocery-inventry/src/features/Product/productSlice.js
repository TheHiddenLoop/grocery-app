import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addProductApi, deleteProductApi, editProductApi, getProductApi } from "./productApi";
import { toast } from "../../hooks/use-toast";

const initialState = {
  loading: false,
  product: [],
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

      return data.product || data;
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

export const updateProduct = createAsyncThunk(
  "product/update",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await editProductApi(formData);

      toast({
        title: "Product Edited!",
        description: data.message,
      });

      return data.product || data;
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


export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteProductApi(id);

      toast({
        title: "Product Deleted!",
        description: data.message,
      });

      return data.product._id;
    } catch (err) {
      const message = err?.message || "Failed to delete product";

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });

      return rejectWithValue(message);
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
  initialState,
  reducers: {
    resetProduct(state) {
      state.loading = false;
      state.product = [];
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
        state.product.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //edit product

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;

        const updatedProduct = action.payload;

        const index = state.product.findIndex(
          (item) => item._id === updatedProduct._id
        );

        if (index !== -1) {
          state.product[index] = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //delete product

      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = state.product.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //all product

      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProduct } = productSlice.actions;
export default productSlice.reducer;
