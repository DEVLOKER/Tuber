import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { LoadingSpiner } from './LoadingSpiner';
import { saveAs } from 'file-saver';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { GoMute } from "@react-icons/all-files/go/GoMute";
import { GoUnmute } from "@react-icons/all-files/go/GoUnmute";
import { v4 as uuidv4 } from 'uuid';


import { useDispatch } from 'react-redux';
import { addDownload, removeDownload, updateDownload, emptyDownload } from '../context/redux.downloads'


export const StreamsDownload = ({showStreams, setShowStreams}) => {


    const dispatch = useDispatch()

    const {title, watch_url: url } = useSelector(state=> state.videos.list[state.videos.index])

    const [listStreams, setListStreams] = useState([])

    const handleHide = ()=> {
        setShowStreams(false)
    }


    useEffect(()=>{

        const getAvailableStreams = (url)=>{
            fetch(`/availableStreams`,{
                method: 'POST',
                body: JSON.stringify({url: url}),
                headers: { 'Content-Type': 'application/json' },
            })
            .then((response) => response.json())
            .then(data => {
                let results = JSON.parse(JSON.stringify(data))
                setListStreams(results)
            })
            .catch((error) => {
                console.log('an error occurred while searching : '+error.message)
            });
        }
        dispatch(emptyDownload())
        if(showStreams) getAvailableStreams(url)
    }, [url, showStreams])


    const downloadStream = (url, filename, size, streamSize, downloadID = uuidv4())=> {
        dispatch(addDownload({
            id: downloadID, 
            url: url,
            title: title, 
            filename: filename,
            streamSize: streamSize, 
            totalLength: size, 
            recievedLength: 0, 
            percent: 0,
            show: true,
            canceled: false
        }))
    }



    return (
        <>
            <Offcanvas show={showStreams} placement="bottom" onHide={handleHide} scroll={false} backdrop={true} style={{height:'40vh'}}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Video & Audio Download</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {
                        listStreams?.length>0?(
                            listStreams.map((stream, i)=> {
                                if(stream.type==="audio"){
                                    return (
                                        <button key={i} className="btn btn-dark btn-sm m-1" onClick={e=> downloadStream(stream.url, `[${stream.abr}].mp3`, stream.size, stream.filesize) } >
                                            {/* {stream.mime_type} */}
                                            {stream.abr} [ { stream.filesize } ] 
                                        </button>
                                    )
                                }
                                if(stream.type==="video"){
                                    return (
                                        <button key={i} className="btn btn-danger btn-sm m-1" onClick={e=> downloadStream(stream.url,`[${stream.resolution}].mp4`, stream.size, stream.filesize) } >
                                            {/* {stream.codecs.length} */}
                                            {stream?.codecs?.length>1?(<GoUnmute className='me-2' style={{width: 20, height: 20}} />): (<GoMute className='me-2' style={{width: 20, height: 20}} />)}
                                            {stream.resolution} [ { stream.filesize } ] 
                                        </button>
                                    )
                                }
                            })
                        ):(
                            <LoadingSpiner size={2} />
                        )
                    }
                </Offcanvas.Body>
            </Offcanvas>


        </>
    )
}
