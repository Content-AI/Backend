import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = {
    ListTokenGeneratedByUser:  false,
}

export const counterSlice = createSlice({
 name: 'SetListTokenGeneratedByUser',
 initialState: initialStateValue,
 reducers: {
    _save_generated_token_: (state,action) => {
        state.ListTokenGeneratedByUser = action.payload
    }
 },
})

export const {_save_generated_token_} = counterSlice.actions

export default counterSlice.reducer
