import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Host } from "../utils/host";
import { getLocalStorage } from "../utils/localStorage";

const URL = Host + "/movements";
const authHeader = () => {
  return {
    headers: {
      authorization: "Bearer " + getLocalStorage("access"),
    },
  };
};

const initialState = {
  movements: [],
  status: "idle",
  error: null,
};

export const retrieveMovements = createAsyncThunk(
  "movements/retrieveMovements",
  async () => {
    const response = await axios.get(URL, authHeader());
    const userData = response.data
    return userData;
  }
);

export const createMovements = createAsyncThunk(
  "movements/createMovements",
  async (movement) => {
    const response = await axios.post(URL, movement, authHeader());
    return response.data;
  }
);

export const updateMovements = createAsyncThunk(
  "movements/updateMovements",
  async (row) => {
    const response = await axios.put(URL + "/" + row.id, row, authHeader());
    return response.data;
  }
);

export const deleteMovements = createAsyncThunk(
  "movements/deleteMovements",
  async (row) => {
    const response = await axios.delete(URL + "/" + row.id, authHeader());
    return response.data;
  }
);

export const movementSlice = createSlice({
  name: "movements", //movements
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(retrieveMovements.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(retrieveMovements.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.movements = action.payload;
      })
      .addCase(retrieveMovements.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createMovements.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createMovements.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.movements.push(action.payload);
      })
      .addCase(createMovements.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateMovements.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateMovements.fulfilled, (state, action) => {
        state.status = "succeeded";
        const movementIndex = state.movements.findIndex(
          (item) => item.id === action.payload.id
        );
        state.movements[movementIndex] = action.payload;
      })
      .addCase(updateMovements.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteMovements.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteMovements.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.movements = state.movements.filter(
          (item) => item.id !== action.meta.arg.id
        );
      })
      .addCase(deleteMovements.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
