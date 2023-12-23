import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = {
    ThreeSteps:  null,
}

export const counterSlice = createSlice({
 name: 'SetThreeSteps',
 initialState: initialStateValue,
 reducers: {
    _save_survey_: (state,action) => {
        state.ThreeSteps = action.payload
       }
 },
})

export const {_save_survey_} = counterSlice.actions

export default counterSlice.reducer
