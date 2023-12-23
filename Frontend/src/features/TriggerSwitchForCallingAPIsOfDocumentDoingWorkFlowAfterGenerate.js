import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = {
    TriggerSwitchForCallingAPIsOfDocumentDoingWorkFlowAfterGenerate:  null,
}

export const counterSlice = createSlice({
 name: 'SetTriggerSwitchForCallingAPIsOfDocumentDoingWorkFlowAfterGenerate',
 initialState: initialStateValue,
 reducers: {
    _change_state_: (state,action) => {
        state.TriggerSwitchForCallingAPIsOfDocumentDoingWorkFlowAfterGenerate = action.payload
       }
 },
})

export const {_change_state_} = counterSlice.actions

export default counterSlice.reducer
