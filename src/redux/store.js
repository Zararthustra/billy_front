import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice";
import { summarySlice } from "./summarySlice";
import { monthSlice } from "./monthSlice";

export default configureStore({
  reducer: {
    user: userSlice.reducer,
    summary: summarySlice.reducer,
    month: monthSlice.reducer,
  },
});
