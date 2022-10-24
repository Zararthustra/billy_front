import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Host } from "../utils/host";

const registerURL = Host + "/register";
const tokenURL = Host + "/token/";
const refreshURL = Host + "/token/refresh/";

const initialState = {
  user: null,
  status: "idle",
  error: null,
};

export const createUser = createAsyncThunk("user/createUser", async (user) => {
  const response = await axios.post(registerURL, user);
  return response.data;
});

export const getTokenUser = createAsyncThunk(
  "user/getTokenUser",
  async (user) => {
    const response = await axios.post(tokenURL, user);
    return response.data;
  }
);

export const refreshTokenUser = createAsyncThunk(
  "user/refreshTokenUser",
  async (user) => {
    const response = await axios.post(refreshURL, user);
    return response.data;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        // state.user = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getTokenUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getTokenUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = {
          ...action.meta.arg,
          access: action.payload.access,
          refresh: action.payload.refresh,
        };
      })
      .addCase(getTokenUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(refreshTokenUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(refreshTokenUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = {
          ...action.meta.arg,
          access: action.payload.access,
          refresh: action.payload.refresh,
        };
      })
      .addCase(refreshTokenUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
