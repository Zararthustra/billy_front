import { createSlice } from "@reduxjs/toolkit";

export const monthSlice = createSlice({
  name: "month",
  initialState: [
    {
      date: 1,
      lib: "",
      value: 0,
      solde: 0,
      recurrent: false,
    },
  ],
  reducers: {
    addRow: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { addRow } = monthSlice.actions;
