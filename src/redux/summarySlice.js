import { createSlice } from "@reduxjs/toolkit";

export const summarySlice = createSlice({
  name: "summary",
  initialState: [
    {
      year: new Date().getFullYear(),
      months: [new Date().getMonth() + 1],
      solds: [0],
    },
  ],
  reducers: {
    addMonth: (state, action) => {
      if (action.payload.year > state.at(-1).year) {
        state.push({
          year: action.payload.year,
          months: [action.payload.month],
          solds: [action.payload.sold],
        });
      } else {
        state.at(-1).months = [...state.at(-1).months, action.payload.month];
        state.at(-1).solds = [...state.at(-1).solds, action.payload.sold];
      }
    },
    updateSold: (state, action) => {
      const payload = action.payload;
      const yearIndex = state.findIndex((item) => item.year === payload.year);
      const monthIndex = state[yearIndex].months.findIndex(
        (item) => item === payload.month
      );
      state[yearIndex].solds[monthIndex] = payload.sold;
    },
  },
});

export const { addMonth, updateSold } = summarySlice.actions;
