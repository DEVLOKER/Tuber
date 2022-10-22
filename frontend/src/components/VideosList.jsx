import React, {useState} from 'react'
import { VideoCard } from './VideoCard'
import { useSelector } from 'react-redux'
import { LoadingSpiner } from "./LoadingSpiner";
import { StreamsDownload } from './StreamsDownload';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { DownloadProgress } from './DownloadProgress';
import { CaptionDownload } from './CaptionDownload';


export const VideosList = () => {

    const loading = useSelector(state=> state.loading)
    const videos = useSelector(state=> state.videos.list)
    const downloads = useSelector(state=> state.downloads)

    const [showStreams, setShowStreams] = useState(false)
    const [showCaptions, setShowCaptions] = useState(false)

    return (
        <>
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
                                setShowStreams={setShowStreams}
                                setShowCaptions={setShowCaptions}
                            />
                        )
                    )
                }
            </div>

            {
                showStreams && (
                    <StreamsDownload showStreams={showStreams} setShowStreams={setShowStreams} />
                )
            }

            {
                showCaptions && (
                    <CaptionDownload showCaptions={showCaptions} setShowCaptions={setShowCaptions} />
                )
            }


            <ToastContainer className="p-3" position="top-end" style={{zIndex: '9999'}}>
                {
                    downloads?.map((d, i)=>
                        <DownloadProgress 
                            key={i}
                            progress={d}
                        />
                    )
                }
            </ToastContainer>


        </>

    )
}
