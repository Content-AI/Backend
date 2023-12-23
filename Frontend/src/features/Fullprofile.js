import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
    Fullprofile: null,
};

export const counterSlice = createSlice({
    name: "SetFullProfile",
    initialState: initialStateValue,
    reducers: {
        _save_user_profile: (state, action) => {
            state.Fullprofile = action.payload;
        },
        _delete_user_profile: (state, action) => {
            state.Fullprofile = null;
        },
    },
});

export const { _save_user_profile, _delete_user_profile } = counterSlice.actions;

export default counterSlice.reducer;
