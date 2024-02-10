import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    user_name: "",
  },
  reducers: {
    set_name(state, action) {
      state.user_name = action.payload;
    },
  },
});

export const { set_name } = UserSlice.actions;

export default UserSlice.reducer;
