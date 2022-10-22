import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Host } from "../utils/host";

const URL = Host + "/summary";

const initialState = {
  summary: [],
  status: "idle",
  error: null,
};

export const retrieveSummary = createAsyncThunk(
  "summary/retrieveSummary",
  async () => {
    const response = await axios.get(URL);
    return response.data;
  }
);

export const createSummary = createAsyncThunk(
  "summary/createSummary",
  async (month) => {
    const response = await axios.post(URL, month);
    return response.data;
  }
);

export const updateSummary = createAsyncThunk(
  "summary/updateSummary",
  async (month) => {
    const response = await axios.put(URL + "/" + month.id, {
      sold: month.sold,
    });

    return response.data;
  }
);

export const summarySlice = createSlice({
  name: "summary",
  initialState,
  reducers: {
    updateSold: (state, action) => {
      const payload = action.payload;
      const yearIndex = state.summary.findIndex(
        (item) => item.year === payload.year
      );
      const monthIndex = state.summary[yearIndex].months.findIndex(
        (item) => item === payload.month
      );
      state.summary[yearIndex].solds[monthIndex] = payload.sold;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(retrieveSummary.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createSummary.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateSummary.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(retrieveSummary.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.summary = action.payload;
      })
      .addCase(createSummary.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.summary.push(action.payload);
      })
      .addCase(updateSummary.fulfilled, (state, action) => {
        state.status = "succeeded";
        const summaryIndex = state.summary.findIndex(
          (item) => item.id === action.payload.id
        );
        state.summary[summaryIndex] = action.payload;
      })
      .addCase(retrieveSummary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createSummary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateSummary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateSold } = summarySlice.actions;
