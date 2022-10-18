import { configureStore } from "@reduxjs/toolkit"
import { videosSlice } from "./redux.videos"
import { loadingSlice } from "./redux.loading"

export const videosStore = configureStore({
    reducer: {
        videos : videosSlice.reducer,
        loading: loadingSlice.reducer
    },
})