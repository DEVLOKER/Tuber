import React, { useState, useEffect } from 'react'
import { LoadingSpiner } from './LoadingSpiner'
import './caption.css'

export const CaptionDownload = ({videoURL}) => {

    const [listCaptions, setListCaptions] = useState([])
    const getAvailableCaptions = ()=>{
        // setListCaptions([])
        fetch(`/availableCaptions`,{
            method: 'POST',
            body: JSON.stringify({url: videoURL}),
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

    const [caption, setCaption] = useState({})
    const getCaptionByName = (code)=>{
        setCaption(null)
        fetch(`/captionByLanguageName`,{
            method: 'POST',
            body: JSON.stringify({url: videoURL, code: code}),
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
        getAvailableCaptions()
    }, [])


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
        element.setAttribute('download', filename);
        element.style.display = 'none';
    
        document.body.appendChild(element);
        element.click();
        
        document.body.removeChild(element);
    }


    return (
        <>
            <div className="offcanvas offcanvas-top" tabIndex="-1" id="offcanvasTop" aria-labelledby="offcanvasTopLabel" style={{height:'100vh'}}>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasTopLabel">Caption Download</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body small">
                    <div className='row'>
                        <div className='small'>
                        {
                            listCaptions?.length>0?(
                                listCaptions.map((c, i)=>
                                    <React.StrictMode key={i} >
                                        <input type="radio" className="btn-check" name="listCaptions" id={`caption_${i}`} autoComplete="off" />
                                        <label className="btn btn-outline-dark btn-sm m-1" htmlFor={`caption_${i}`} onClick={(e)=>getCaptionByName(c.code)} >{c.name}</label>
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
                                                <button className="btn btn-danger btn-sm ms-1" id="nav-str-tab" onClick={e=>downloadCaption(caption.lang, caption.str.join('\n'))}>Download</button>
                                                <button className="btn btn-dark btn-sm ms-1" id="nav-str-tab" onClick={(e)=> copyToClipboard(e, caption.str.join('\n')) } >Copy</button>
                                            </div>
                                            {caption?.str.map((line, i)=><p className='text-center' key={i}>{line}</p>)}
                                        </div>
                                        <div className="tab-pane fade" id="nav-xml" role="tabpanel" aria-labelledby="nav-xml-tab">
                                            <div className="txt-action d-flex justify-content-center">
                                                <button className="btn btn-danger btn-sm ms-1" id="nav-str-tab" onClick={e=>downloadCaption(caption.lang, caption.str.join('\n'))}>Download</button>
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
                </div>
            </div>

        </>
    )
}
