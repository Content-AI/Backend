// mySlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  text: null,
  length: 0,
};

const mySlice = createSlice({
  name: 'SetEditorText',
  initialState,
  reducers: {
    setText: (state, action) => {
      state.text = action.payload;
      if(action.payload){
        state.length = action.payload.length;
      }else{state.length=0}
    },
  },
});

export const { setText } = mySlice.actions;
export default mySlice.reducer;
