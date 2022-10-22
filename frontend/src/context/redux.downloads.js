import { createSlice } from "@reduxjs/toolkit"

export const downloadsSlice = createSlice({
    name: "downloads",
    initialState: [],
    reducers: {
        addDownload : (state, action)=> {
            state.push(action.payload)
            // console.log(`addDownload : ${JSON.stringify(state)}`)
            return state
        },
        removeDownload : (state, action)=> {
            state = state.filter(item=> item.id !== action.payload.id)
            // console.log(`removeDownload : ${JSON.stringify(state)}`)
            return state
        },
        updateDownload : (state, action)=> {
            state = state.filter(item=> item.id === action.payload.id ? action.payload: item )
            // console.log(`updateDownload : ${JSON.stringify(action.payload)}`)
            return state
        },
        emptyDownload : (state, action)=> {
            state = []
            return state
        },

    }
})

export const {addDownload, removeDownload, updateDownload, emptyDownload} = downloadsSlice.actions;