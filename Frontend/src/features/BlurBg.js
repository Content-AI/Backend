import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = {
    BlurBgNavBar:  false,
}

export const counterSlice = createSlice({
 name: 'SetBlurBgNavBar',
 initialState: initialStateValue,
 reducers: {
    _make_blur_: (state,action) => {
        state.BlurBgNavBar = action.payload
       }
 },
})

export const {_make_blur_} = counterSlice.actions

export default counterSlice.reducer
