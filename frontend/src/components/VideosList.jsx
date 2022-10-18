import React from 'react'
import { useState } from 'react'
import { VideoCard } from './VideoCard'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { LoadingSpiner } from "./LoadingSpiner";

export const VideosList = () => {

    const loading = useSelector(state=> state.loading)
    const videos = useSelector(state=> state.videos)

    useEffect(()=>{
        // if(videos && videos.length>0)
        //     console.log(videos[0].watch_url)
    }, [videos])


    return (
        <div className="container pt-5 pb-2 text-center d-flex flex-row justify-content-center flex-wrap">
            {
                loading? (
                    <LoadingSpiner text={"Loading ..."} />
                ):(
                    videos?.map((vd, i)=>
                        <VideoCard 
                            key={i}
                            videoIndex={i}
                            info={vd}
                        />
                    )
                )
            }
        </div>
    )
}
