import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setSelectedVideoIndex } from '../context/redux.videos'
import { FaClosedCaptioning } from "@react-icons/all-files/fa/FaClosedCaptioning";
import { IoMdDownload } from "@react-icons/all-files/io/IoMdDownload";
import { BiLike } from "@react-icons/all-files/bi/BiLike";
import { BiDislike } from "@react-icons/all-files/bi/BiDislike";
import { AiOutlinePlayCircle } from "@react-icons/all-files/ai/AiOutlinePlayCircle";

import './card.css'

export const VideoCard = ({videoIndex, info, setShowStreams, setShowCaptions}) => {

    const dispatch = useDispatch()

    const handleStreamsClick = (e) => {
        dispatch(setSelectedVideoIndex(videoIndex))
        setShowStreams(true)
    }

    const handleCaptionsClick = (e) => {
        dispatch(setSelectedVideoIndex(videoIndex))
        setShowCaptions(true)
    }

    // console.log(info.vid_info)

    return (
        <>
            <div className="card video m-3 bg-light" style={{"maxWidth": "15rem"}}>
                <img src={info.thumbnail_url} className="card-img-top" alt={info.title} />
                <a href={info.watch_url} target="_blank" rel="noopener noreferrer" ><AiOutlinePlayCircle className='play' /></a>
                <div className="card-header d-flex justify-content-end">
                        <small className="text-white">{info.duration}</small>
                        {/* <small className="text-white">{info.publish_date}</small> */}
                </div>
                <div className="card-text d-flex justify-content-center info">
                    <small className="text-muted ms-1"><span className="badge bg-secondary">{info.views} views</span></small>
                    <small className="text-muted ms-1"><span className="badge bg-secondary"><BiLike /> {info.likes}</span></small>
                    <small className="text-muted ms-1"><span className="badge bg-secondary"><BiDislike /> {info.dislikes}</span></small>
                </div>
                <div className="card-body">
                    <h6 className="card-title text-center">{info.title}</h6>
                    {/* <p className="card-text">{info.description}</p> */}
                    {/* <p className="card-text">by <a href={info.channel_url}>{info.author}</a></p> */}
                </div>
                <div className="card-footer text-muted d-flex justify-content-between">
                    <div>
                        <button className="btn btn-dark btn-sm" type="button" onClick={ handleCaptionsClick }>
                            <FaClosedCaptioning /> Caption
                        </button>
                        
                    </div>
                    <div>
                        <button className="btn btn-danger btn-sm" type="button" onClick={ handleStreamsClick } >
                            <IoMdDownload /> Download
                        </button>
                    </div>
                </div>
            </div>

        </>
    )
}
