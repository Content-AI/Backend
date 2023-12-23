import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = {
    AuthenticationToken:  null,
}

export const counterSlice = createSlice({
 name: 'SetAuthenticationToken',
 initialState: initialStateValue,
 reducers: {
    _save_token_: (state,action) => {
        state.AuthenticationToken = action.payload
       },
    _delete_token_: (state, action) => {
        state.AuthenticationToken = null
        }
 },
})

export const {_save_token_,_delete_token_} = counterSlice.actions

export default counterSlice.reducer
