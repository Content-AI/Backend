import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = {
    Subscriptions:  null,
}

export const counterSlice = createSlice({
 name: 'SetSubscriptions',
 initialState: initialStateValue,
 reducers: {
    _save_details_: (state,action) => {
        state.Subscriptions = action.payload
       }
 },
})

export const {_save_details_} = counterSlice.actions

export default counterSlice.reducer
