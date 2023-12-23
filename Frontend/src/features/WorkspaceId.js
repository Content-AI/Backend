import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = {
    WorkspaceId:  null,
}

export const counterSlice = createSlice({
 name: 'SetWorkspaceId',
 initialState: initialStateValue,
 reducers: {
    _workspace_id_: (state,action) => {
        state.WorkspaceId = action.payload
       }
 },
})

export const {_workspace_id_} = counterSlice.actions

export default counterSlice.reducer
