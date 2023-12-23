import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = {
    DarkMode:  false,
}

export const counterSlice = createSlice({
 name: 'SetDarkMode',
 initialState: initialStateValue,
 reducers: {
    _dark_mode_: (state,action) => {
        state.DarkMode = action.payload
       }
 },
})

export const {_dark_mode_} = counterSlice.actions

export default counterSlice.reducer
