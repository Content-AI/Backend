import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = {
    ChosenWorkspaceId:  null,
}

export const counterSlice = createSlice({
 name: 'SetChosenWorkspaceId',
 initialState: initialStateValue,
 reducers: {
    _chosen_workspace_id_: (state,action) => {
        state.ChosenWorkspaceId = action.payload
       }
 },
})

export const {_chosen_workspace_id_} = counterSlice.actions

export default counterSlice.reducer
