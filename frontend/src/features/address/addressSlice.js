import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAddressesApi,
  addAddressApi,
  deleteAddressApi,
} from "./addressApi";

export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAddressesApi();
      return data.addresses;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const data = await addAddressApi(addressData);
      return data.address;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      await deleteAddressApi(addressId);
      return addressId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    selectedAddressId: null,
    loading: false,
    error: null,
  },
  reducers: {
    selectAddress(state, action) {
      state.selectedAddressId = action.payload;
    },
    clearAddressError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        const firstAddress = action.payload?.[0] || null;
        state.addresses = firstAddress ? [firstAddress] : [];
        state.selectedAddressId = firstAddress?._id || null;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = [action.payload];
        state.selectedAddressId = action.payload._id;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = [];
        state.selectedAddressId = null;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { selectAddress, clearAddressError } =
  addressSlice.actions;

export default addressSlice.reducer;