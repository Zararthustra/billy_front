import { createSlice } from "@reduxjs/toolkit";

export const movementSlice = createSlice({
  name: "movement",
  initialState: [
    {
      id: 1,
      year: 2022,
      month: 10,
      date: 4,
      lib: "Exemple 1",
      value: 12,
      solde: 0,
      recurrent: false,
    },
    {
      id: 2,
      year: 2022,
      month: 10,
      date: 1,
      lib: "Exemple 2",
      value: -45,
      solde: 0,
      recurrent: true,
    },
    {
      id: 3,
      year: 2022,
      month: 11,
      date: 1,
      lib: "Exemple 3",
      value: 175,
      solde: 0,
      recurrent: true,
    },
    {
      id: 4,
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
      const payload = action.payload;
      payload.map((item) => state.push(item));
    },
    deleteRow: (state, action) => {
      return state.filter((item) => item.id !== action.payload.id);
    },
    updateRow: (state, action) => {
      const stateIndex = state.findIndex(
        (item) => item.id === action.payload.id
      );
      state[stateIndex] = action.payload.row;
    },
  },
});

export const { addRows, deleteRow, updateRow } = movementSlice.actions;
