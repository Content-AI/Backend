import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = {
    Favorite:  null,
}

export const counterSlice = createSlice({
 name: 'SetFavorite',
 initialState: initialStateValue,
 reducers: {
    _fav_data_: (state,action) => {
        state.Favorite = action.payload
    }
 },
})

export const {_fav_data_} = counterSlice.actions

export default counterSlice.reducer
