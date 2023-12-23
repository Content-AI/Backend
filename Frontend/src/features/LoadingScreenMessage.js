import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = {
    LoadingScreenMessage:  null,
}

export const counterSlice = createSlice({
 name: 'SetLoadingScreenMessage',
 initialState: initialStateValue,
 reducers: {
    _message_: (state,action) => {
        state.LoadingScreenMessage = action.payload
       }
 },
})

export const {_message_} = counterSlice.actions

export default counterSlice.reducer
