import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addProductApi, getProductApi } from "./productApi";
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

export const updateProduct  = ()=>{
  console.log("hello");
  
}

export const deleteProduct  = ()=>{
  console.log("hello");
  
}

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
