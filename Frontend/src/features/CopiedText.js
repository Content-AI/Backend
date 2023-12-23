import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = {
    CopiedText:  false,
}

export const counterSlice = createSlice({
 name: 'SetCopiedText',
 initialState: initialStateValue,
 reducers: {
    _copy_text_: (state,action) => {
        state.CopiedText = action.payload
       },
    _reset_copy_text_: (state,action) => {
        state.CopiedText = action.payload
    }
 },
})

export const {_copy_text_,_reset_copy_text_} = counterSlice.actions

export default counterSlice.reducer
