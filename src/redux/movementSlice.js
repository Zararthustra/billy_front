import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Host } from "../utils/host";

const URL = Host + "/movements";

const initialState = {
  movements: [],
  status: "idle",
  error: null,
};

export const retrieveMovements = createAsyncThunk(
  "movements/retrieveMovements",
  async () => {
    const response = await axios.get(URL);
    return response.data;
  }
);

export const createMovements = createAsyncThunk(
  "movements/createMovements",
  async (movements) => {
    const promises = [];

    for (const movement of movements) {
      const response = axios.post(URL, movement);
      promises.push(response);
    }

    const responses = await Promise.all(promises);
    const actualDatas = responses.map((result) => result.data);

    return actualDatas;
  }
);

export const updateMovements = createAsyncThunk(
  "movements/updateMovements",
  async (row) => {
    const response = await axios.put(URL + "/" + row.id, row);
    return response.data;
  }
);

export const deleteMovements = createAsyncThunk(
  "movements/deleteMovements",
  async (row) => {
    const response = await axios.delete(URL + "/" + row.id);
    return response.data;
  }
);

export const movementSlice = createSlice({
  name: "movements", //movements
  initialState,
  reducers: {
    addRows: (state, action) => {
      const payload = action.payload;
      payload.map((item) => state.push(item));
    },
    deleteRow: (state, action) => {
      return state.filter((item) => item.id !== action.payload.id);
    },
    updateRow: (state, action) => {
      const stateIndex = state.movements.findIndex(
        (item) => item.id === action.payload.id
      );
      state.movements[stateIndex] = action.payload.row;
    },
  },
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
        state.movements = state.movements.concat(action.payload);
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
        const tmp = state.movements.filter(
          (item) => item.id !== action.payload.id
        );
        state.movements = tmp;
      })
      .addCase(deleteMovements.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addRows, deleteRow, updateRow } = movementSlice.actions;
