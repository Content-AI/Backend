import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = {
    RepeatQuestionInChat:  null,
}

export const counterSlice = createSlice({
 name: 'SetRepeatQuestionInChat',
 initialState: initialStateValue,
 reducers: {
    _save_ask_question_again_: (state,action) => {
        state.RepeatQuestionInChat = action.payload
       }
 },
})

export const {_save_ask_question_again_} = counterSlice.actions

export default counterSlice.reducer
