import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = {
    HideShowNavBarGlobalState:  false,
}

export const counterSlice = createSlice({
 name: 'SetHideShowNavBarGlobalState',
 initialState: initialStateValue,
 reducers: {
    _hide_nav_: (state,action) => {
        state.HideShowNavBarGlobalState = action.payload
       },
    _show_nav_: (state,action) => {
        state.HideShowNavBarGlobalState = action.payload
       }
 },
})

export const {_hide_nav_,_show_nav_} = counterSlice.actions

export default counterSlice.reducer
