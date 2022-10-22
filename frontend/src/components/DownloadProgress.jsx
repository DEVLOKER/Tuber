import React from 'react'
import Toast from 'react-bootstrap/Toast';

import ProgressBar from 'react-bootstrap/ProgressBar';
import { RiVideoDownloadFill } from "@react-icons/all-files/ri/RiVideoDownloadFill";

import { useDispatch } from 'react-redux';
import { addDownload, removeDownload, updateDownload, emptyDownload } from '../context/redux.downloads'
import { useEffect } from 'react';
import { useState } from 'react';


export const DownloadProgress = ({progress}) => {

    const dispatch = useDispatch()
    const [downloadProgress, setDownloadProgress] = useState(progress)
    const { id, url, title, filename, streamSize, totalLength, recievedLength, percent, show, canceled } = downloadProgress

    const handleClose = ()=> {
        setDownloadProgress({...downloadProgress, canceled: true })
        // downloadProgress.canceled && setDownloadProgress({...downloadProgress, show: false})
        // downloadProgress.canceled && dispatch(removeDownload(downloadProgress))
    }

    useEffect(()=>{
        // !downloadProgress.canceled && downloadProgress.show && 
        console.log("useEffect download")
        download()
    }, [])


    useEffect(()=>{
        downloadProgress.canceled && setDownloadProgress({...downloadProgress, show: false})
        downloadProgress.canceled && dispatch(removeDownload(downloadProgress))
    }, [downloadProgress.canceled])

    // useEffect(()=>{
    //     downloadProgress.show && downloadProgress.recievedLength===0 && download()
    // }, [downloadProgress.show])

    // useEffect(()=>{
    //     dispatch(updateDownload(downloadProgress) )
    // }, [downloadProgress.recievedLength])


    const download = ()=> {

        const fetchFile = (url)=> {
            fetch(`/downloadStream`,{
                method: 'POST',
                body: JSON.stringify({url: url, fileName: `${title} ${filename}`}),
                headers: { 'Content-Type': 'application/json' },
            })
            .then(response => {
                let recievedBytes = 0
                const reader = response.body.getReader();
                return new ReadableStream({
                    async start(controller) {
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done || downloadProgress.canceled) break;
                            recievedBytes+=value.length
                            const percent = ((recievedBytes / totalLength)*100).toFixed(2)
                            console.log(percent)
                            const newProgress = {...downloadProgress, recievedLength: recievedBytes, percent:percent==="undefined"?0:percent}
                            setDownloadProgress(newProgress)
                            dispatch(updateDownload(newProgress) )
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
                if(!downloadProgress.canceled){
                    let fileURL = URL.createObjectURL(blob);
                    downloadFile(fileURL, `${title} ${filename}`);
                    console.log('download complelte!');
                }else{
                    console.log('download canceled!');
                }
                
            })
            .catch(console.error)
        }

        const downloadFile = (fileURL, fileName)=>{
            const element = document.createElement('a');
            element.setAttribute('href', fileURL);
            element.setAttribute('download', fileName);
            element.setAttribute('target', '_blank');
            element.setAttribute('rel', 'noopener noreferrer');
            element.style.display = 'none';
        
            document.body.appendChild(element);
            element.click();
            // document.body.removeChild(element);
            window.URL.revokeObjectURL(url);
            element.remove();
        }


        fetchFile(url)
    }

    return (
        <>
            <Toast onClose={ handleClose } show={downloadProgress.show} >
                <Toast.Header>
                    <RiVideoDownloadFill className="rounded me-2" style={{width: 20, height: 20}} />
                    <strong className="me-auto text-start">{downloadProgress.title}</strong>
                    <small>{downloadProgress.streamSize}</small>
                </Toast.Header>
                <Toast.Body>
                    <ProgressBar striped={downloadProgress.percent<100} animated={downloadProgress.percent<100} variant="danger" 
                        now={ downloadProgress.percent } 
                        label={`${downloadProgress.percent}%`} 
                    />
                </Toast.Body>
            </Toast>
        </>
    )
}
