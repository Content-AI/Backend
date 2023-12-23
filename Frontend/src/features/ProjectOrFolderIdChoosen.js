import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = {
    ProjectOrFolderIdChoosen:  null,
}

export const counterSlice = createSlice({
 name: 'SetProjectOrFolderIdChoosen',
 initialState: initialStateValue,
 reducers: {
    _save_folder_id_: (state,action) => {
        state.ProjectOrFolderIdChoosen = action.payload
       }
 },
})

export const {_save_folder_id_} = counterSlice.actions

export default counterSlice.reducer
