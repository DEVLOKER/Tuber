import { createSlice } from "@reduxjs/toolkit"

export const loadingSlice = createSlice({
    name: "loading",
    initialState: false,
    reducers: {
        toggleLoading : (state, action)=> {
            state = action.payload
            return state
        },
    }
})

export const {toggleLoading} = loadingSlice.actions;