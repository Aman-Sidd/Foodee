import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    user_name: "",
    food_type: "",
  },
  reducers: {
    set_user_info(state, action) {
      state.user_name = action.payload.name;
      state.food_type = action.payload.foodType;
    },
  },
});

export const { set_user_info } = UserSlice.actions;

export default UserSlice.reducer;
