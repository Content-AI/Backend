import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = {
    FolderData:  null,
}

export const counterSlice = createSlice({
 name: 'SetFolderData',
 initialState: initialStateValue,
 reducers: {
    _save_folder_data_: (state,action) => {
        state.FolderData = action.payload
    }
 },
})

export const {_save_folder_data_} = counterSlice.actions

export default counterSlice.reducer
