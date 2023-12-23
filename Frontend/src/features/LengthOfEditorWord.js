import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = {
    LengthOfEditorWord:  {
        preLen:0,
        nowLen:0
    }
}

export const counterSlice = createSlice({
 name: 'SetLengthOfEditorWord',
 initialState: initialStateValue,
 reducers: {
    _pre_len_text_: (state,action) => {
        state.LengthOfEditorWord.preLen = action.payload
       },
    _now_len_text_: (state,action) => {
        state.LengthOfEditorWord.nowLen = action.payload
       }
 },
})

export const {_pre_len_text_,_now_len_text_} = counterSlice.actions

export default counterSlice.reducer
