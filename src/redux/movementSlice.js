import { createSlice } from "@reduxjs/toolkit";

export const movementSlice = createSlice({
  name: "month",
  initialState: [
    {
      year: 2022,
      month: 10,
      date: 4,
      lib: "Exemple 1",
      value: 12,
      solde: 0,
      recurrent: false,
    },
    {
      year: 2022,
      month: 10,
      date: 1,
      lib: "Exemple 2",
      value: -45,
      solde: 0,
      recurrent: true,
    },
    {
      year: 2022,
      month: 11,
      date: 1,
      lib: "Exemple 3",
      value: 175,
      solde: 0,
      recurrent: true,
    },
    {
      year: 2023,
      month: 1,
      date: 1,
      lib: "Exemple 4",
      value: 1836,
      solde: 0,
      recurrent: false,
    },
  ],
  reducers: {
    addRows: (state, action) => {
      const payload = action.payload
      payload.map((item) => state.push(item))
    },
  },
});

export const { addRows } = movementSlice.actions;
