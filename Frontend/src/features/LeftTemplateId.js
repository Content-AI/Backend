import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = {
    LeftTemplateId:  null,
}

export const counterSlice = createSlice({
 name: 'SetLeftTemplateId',
 initialState: initialStateValue,
 reducers: {
    _template_id_: (state,action) => {
        state.LeftTemplateId = action.payload
       },
 },
})

export const {_template_id_} = counterSlice.actions

export default counterSlice.reducer
