import React, { useState } from 'react'
import { useEffect } from 'react';
import { LoadingSpiner } from './LoadingSpiner';
import { saveAs } from 'file-saver';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ProgressBar from 'react-bootstrap/ProgressBar';

import { RiVideoDownloadFill } from "@react-icons/all-files/ri/RiVideoDownloadFill";
import { GoMute } from "@react-icons/all-files/go/GoMute";
import { GoUnmute } from "@react-icons/all-files/go/GoUnmute";


export const VideoAudioDownload = ({title, url}) => {

    const [listStreams, setListStreams] = useState([])

    

    useEffect(()=>{
        const getAvailableStreams = ()=>{
            console.error(url)
            fetch(`/availableStreams`,{
                method: 'POST',
                body: JSON.stringify({url: url}),
                headers: { 'Content-Type': 'application/json' },
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("HTTP status " + response.status);
                }
                return response.json();
            })
            .then(data => {
                let results = JSON.parse(JSON.stringify(data))
                setListStreams(results)
            })
            .catch((error) => {
                console.log('an error occurred while searching : '+error.message)
            });
        }
        getAvailableStreams()
    }, [url])

    const [downloadProgress, setDownloadProgress] = useState({show: false, title: '', streamSize: 0, totalLength: 0, recievedLength: 0, percent: 0});


    const downloadStream = (url, filename, size, streamSize)=> {

        const fetchFile = (url)=> {
            fetch(`/downloadFile`,{
                method: 'POST',
                body: JSON.stringify({url: url, fileName: `${title} ${filename}`}),
                headers: { 'Content-Type': 'application/json' },
            })
            .then(response => {
                // console.log(response.headers)
                setDownloadProgress({show: true, title: `${title} ${filename}`, streamSize: streamSize, totalLength: size, recievedLength: 0})
                let recievedLength = 0
                const reader = response.body.getReader();
                return new ReadableStream({
                    async start(controller) {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        recievedLength+=value.length
                        const percent = (recievedLength / size).toFixed(2)*100
                        // console.log(percent)
                        setDownloadProgress(prevState=> {return {...prevState, recievedLength: recievedLength, percent:percent==="undefined"?0:percent}} )
                        controller.enqueue(value);
                    }
                    controller.close();
                    reader.releaseLock();
                    }
                })
            })
            .then(rs => new Response(rs))
            .then(response => response.blob())
            .then(blob => { 
                // console.log(blob.size)
                // console.table(blob)
                let tempUrl = URL.createObjectURL(blob);

                saveAs(tempUrl, `${title} ${filename}`);

                // console.log(tempUrl);
                
                // const aTag = document.createElement("a");
                // aTag.href = tempUrl;
                // aTag.download = `${title} ${filename}`;
                // aTag.target = '_blank';
                // document.body.appendChild(aTag);
                // aTag.click();
                // URL.revokeObjectURL(tempUrl);
                // aTag.remove();
                // console.log('download complelte!');
                // // URL.revokeObjectURL(tempUrl);
            })
            .catch(console.error)
        }

        fetchFile(url)
        
        // const download = ()=>{
        //     const element = document.createElement('a');
        //     element.setAttribute('href', url);
        //     element.setAttribute('download', `${title} ${filename}`);
        //     element.setAttribute('target', '_blank');
        //     element.setAttribute('rel', 'noopener noreferrer');
        //     element.style.display = 'none';
        
        //     document.body.appendChild(element);
        //     element.click();
        //     // document.execCommand('SaveAs',true,`${title} ${filename}`);
        //     // document.body.removeChild(element);
        //     window.URL.revokeObjectURL(url);
        //     element.remove();
        // }

        // download()
    }

    return (
        <>
            <div className="offcanvas offcanvas-bottom" tabIndex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel" style={{height:'40vh'}}>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasTopLabel">Video & Audio Download</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body small">
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
                </div>
            </div>

            <ToastContainer className="p-3" position="top-start" style={{zIndex: '9999'}}>
                <Toast onClose={() => setDownloadProgress(prevState=> {return {...prevState, show: false}} )} show={downloadProgress.show} >
                    <Toast.Header>
                        <RiVideoDownloadFill className="rounded me-2" style={{width: 20, height: 20}} />
                        <strong className="me-auto text-start">{downloadProgress.title}</strong>
                        <small>{downloadProgress.streamSize}</small>
                    </Toast.Header>
                    <Toast.Body>
                        <ProgressBar striped animated variant="danger" 
                            now={ downloadProgress.percent } 
                            label={`${downloadProgress.percent}%`} 
                        />
                    </Toast.Body>
                </Toast>
            </ToastContainer>


        </>
    )
}
