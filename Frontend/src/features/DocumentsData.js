import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = {
    DocumentsData:  null,
}

export const counterSlice = createSlice({
 name: 'SetDocumentsData',
 initialState: initialStateValue,
 reducers: {
    _save_doc_data_: (state,action) => {
        state.DocumentsData = action.payload
    }
 },
})

export const {_save_doc_data_} = counterSlice.actions

export default counterSlice.reducer
