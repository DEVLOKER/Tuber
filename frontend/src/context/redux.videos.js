import { createSlice } from "@reduxjs/toolkit"

export const videosSlice = createSlice({
    name: "videos",
    initialState: {list: [], index: 0},
    reducers: {
        setVideos : (state, action)=> {
            state = {...state, list: action.payload, index: 0}
            return state
        },
        setSelectedVideoIndex : (state, action)=> {
            state = {...state, index: action.payload}
            return state
        },
    }
})

export const {setVideos, setSelectedVideoIndex} = videosSlice.actions;