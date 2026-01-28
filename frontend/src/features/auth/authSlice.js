import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { check, loginApi, logout, signupApi, updateProfile } from "./authApi";
import toast from "react-hot-toast";

export const signup = createAsyncThunk(
  "auth/signup",
  async (formData, thunkAPI) => {
    try {
      const data = await signupApi(formData);
      toast.success(data.message);
      return data;
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (formData, thunkAPI) => {
    try {
      const data = await loginApi(formData);
      toast.success(data.message);      
      return data;
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, thunkAPI) => {
    try {
      return await check();
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const updateProfileAuth = createAsyncThunk(
  "auth/update-profile",
  async (formData, thunkAPI) => {
    try {
      const data = await updateProfile(formData);
      toast.success(data.message);
      return data;
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const logoutAuth = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const data = await logout();
    toast.success(data.message);
      return data;
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle",       
    statusCheck: "idle", 
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // signup
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // login
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // check auth
      .addCase(checkAuth.pending, (state) => {
        state.statusCheck = "loading";
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.statusCheck = "succeeded";
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.statusCheck = "failed";
        state.user = null;
      })
      //update profile
      .addCase(updateProfileAuth.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProfileAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(updateProfileAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      //logout
      .addCase(logoutAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutAuth.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null;
      })
      .addCase(logoutAuth.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default authSlice.reducer;