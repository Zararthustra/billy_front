import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice";
import { summarySlice } from "./summarySlice";
import { movementSlice } from "./movementSlice";

export default configureStore({
  reducer: {
    user: userSlice.reducer,
    summary: summarySlice.reducer,
    movements: movementSlice.reducer,
  },
});
