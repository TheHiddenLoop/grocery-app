import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginApi, meApi } from "./authApi";
import { toast } from "../../hooks/use-toast";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const loginAdmin = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginApi(credentials);

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      return data;
    } catch (err) {
      toast({
        title: "Login Failed",
        description: err.message,
        variant: "destructive",
      });

      return rejectWithValue(err.message);
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const data = await meApi();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // /ME
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
