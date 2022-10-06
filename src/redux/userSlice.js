import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    id: 1,
    name: "Isabelle",
    password: "totoleharricot",
  },
  reducers: {
    update: (state, action) => {
        state.name = action.payload.name
        state.password = action.payload.password
    }
  },
});

export const { update } = userSlice.actions;