import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
    LoadingScreen:  true,
}

export const counterSlice = createSlice({
  name: "SetLoadingScreen",
  initialState: initialStateValue,
  reducers: {
    _load_screen_: (state, action) => {
      state.LoadingScreen = action.payload;
    },
  },
});

export const { _load_screen_ } = counterSlice.actions;

export default counterSlice.reducer;
