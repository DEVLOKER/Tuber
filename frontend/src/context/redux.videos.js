import { createSlice } from "@reduxjs/toolkit"

export const videosSlice = createSlice({
    name: "videos",
    initialState: [],
    reducers: {
        setVideos : (state, action)=> {
            state = action.payload
            return state
        },
    }
})

export const {setVideos} = videosSlice.actions;