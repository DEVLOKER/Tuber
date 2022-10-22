import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Offcanvas from 'react-bootstrap/Offcanvas';
import { LoadingSpiner } from './LoadingSpiner'
import './caption.css'


export const CaptionDownload = ({showCaptions, setShowCaptions}) => {

    const {title, watch_url: url } = useSelector(state=> state.videos.list[state.videos.index])


    const handleHide = ()=> {
        setShowCaptions(false)
    }

    const [listCaptions, setListCaptions] = useState(null)


    const [caption, setCaption] = useState({})
    const getCaptionByName = (code, name)=>{
        setCaption(null)
        fetch(`/captionByLanguageName`,{
            method: 'POST',
            body: JSON.stringify({url: url, code: code, name: name}),
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
            // console.log(results)
            setCaption(results)
        })
        .catch((error) => {
            console.log('an error occurred while searching : '+error.message)
        });
    }

    useEffect(()=>{

        const getAvailableCaptions = (url)=>{
            // setListCaptions([])
            fetch(`/availableCaptions`,{
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
                // console.log(results)
                setListCaptions(results)
            })
            .catch((error) => {
                console.log('an error occurred while searching : '+error.message)
            });
        }

        if(showCaptions) getAvailableCaptions(url)
    }, [url, showCaptions])


    const copyToClipboard = (e, txt)=>{
        navigator.clipboard.writeText(txt)
        e.target.innerHTML = "Copied !"; 
        setTimeout(() => { e.target.innerHTML = "Copy"; }, 2000);
    }

    const downloadCaption = (filename, content)=> {
        
        // const fileUrl = URL.createObjectURL(new Blob([content], { type: 'plain/text' }));
        const fileUrl = "data:text/plain;charset=UTF-8," + content;
        
        const element = document.createElement('a');
        element.setAttribute('href', fileUrl);
        element.setAttribute('download', `${title} ${filename}`);
        element.style.display = 'none';
    
        document.body.appendChild(element);
        element.click();
        
        document.body.removeChild(element);
    }


    return (
        <>
            <Offcanvas show={showCaptions} placement="top" onHide={handleHide} scroll={false} backdrop={true} style={{height:'100vh'}}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Caption Download</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className='row'>
                        <div className='small'>
                        {
                            listCaptions?(
                                listCaptions.length==0 && 
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <h6>
                                        <p>No Caption found for :</p>
                                        <p><strong>{title}</strong>!</p>
                                    </h6>
                                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                                ||
                                listCaptions.map((c, i)=>
                                    <React.StrictMode key={i} >
                                        <input type="radio" className="btn-check" name="listCaptions" id={`caption_${i}`} autoComplete="off" />
                                        <label className="btn btn-outline-dark btn-sm m-1" htmlFor={`caption_${i}`} onClick={(e)=>getCaptionByName(c.code, c.name)} >{c.name}</label>
                                    </React.StrictMode>
                                )
                            ):(
                                <LoadingSpiner size={2} />
                            )
                        }
                        </div>
                    </div>
                    <div className='row mt-4' >
                        {
                            caption?.str?.length ?(
                                <>
                                    <nav>
                                        <div className="nav nav-tabs d-flex justify-content-center" id="nav-tab" role="tablist">
                                            <button className="nav-link active" id="nav-str-tab" data-bs-toggle="tab" data-bs-target="#nav-str" type="button" role="tab" aria-controls="nav-str" aria-selected="true">TEXT</button>
                                            <button className="nav-link" id="nav-xml-tab" data-bs-toggle="tab" data-bs-target="#nav-xml" type="button" role="tab" aria-controls="nav-xml" aria-selected="false">XML</button>
                                        </div>
                                    </nav>
                                    <div className="tab-content" id="nav-tabContent">
                                        <div className="tab-pane fade show active" id="nav-str" role="tabpanel" aria-labelledby="nav-str-tab">
                                            <div className="txt-action d-flex justify-content-center">
                                                <button className="btn btn-danger btn-sm ms-1" id="nav-str-tab" onClick={e=>downloadCaption(`[${caption.name}].txt`, caption.str.join('\n'))}>Download</button>
                                                <button className="btn btn-dark btn-sm ms-1" id="nav-str-tab" onClick={(e)=> copyToClipboard(e, caption.str.join('\n')) } >Copy</button>
                                            </div>
                                            {caption?.str.map((line, i)=><p className='text-center' key={i}>{line}</p>)}
                                        </div>
                                        <div className="tab-pane fade" id="nav-xml" role="tabpanel" aria-labelledby="nav-xml-tab">
                                            <div className="txt-action d-flex justify-content-center">
                                                <button className="btn btn-danger btn-sm ms-1" id="nav-str-tab" onClick={e=>downloadCaption(`[${caption.name}].xml`, caption.str.join('\n'))}>Download</button>
                                                <button className="btn btn-dark btn-sm ms-1" id="nav-str-tab" onClick={(e)=>copyToClipboard(e, caption.xml)} >Copy</button>
                                            </div>
                                            <pre lang="xml">
                                                {caption?.xml}
                                            </pre>
                                        </div>
                                    </div>
                                </>
                            ):(
                                caption==null &&
                                <LoadingSpiner size={2} />
                            )
                        }
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

        </>
    )
}
