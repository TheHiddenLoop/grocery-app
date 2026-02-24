import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { codPaymentApi, stripePaymentApi } from "./paymentApi";

export const codPayment = createAsyncThunk(
  "payment/cod",
  async (product, { rejectWithValue }) => {
    try {
      const data = await codPaymentApi(product);
      console.log("here",product);
      
      toast.success(data.message);
      return data;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err.message);
    }
  }
);

export const stripePayment = createAsyncThunk(
  "payment/stripe",
  async (product, { rejectWithValue }) => {
    try {
      const data = await stripePaymentApi(product);

      if (data?.url) {
        window.location.href = data.url;
      }

      return data;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetPayment(state) {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // COD
      .addCase(codPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(codPayment.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(codPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(stripePayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(stripePayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(stripePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;