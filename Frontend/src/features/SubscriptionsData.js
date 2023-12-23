import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = {
    SubscriptionsData:  null,
}

export const counterSlice = createSlice({
 name: 'SetSubscriptionsData',
 initialState: initialStateValue,
 reducers: {
    _save_sub_details_: (state,action) => {
        state.SubscriptionsData = action.payload
       }
 },
})

export const {_save_sub_details_} = counterSlice.actions

export default counterSlice.reducer
