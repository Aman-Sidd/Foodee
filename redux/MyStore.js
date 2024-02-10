import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./UserSlice";

const MyStore = configureStore({
  reducer: {
    user: UserReducer,
  },
});

export default MyStore;
