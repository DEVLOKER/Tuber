import React, { Component, useEffect} from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { VideosList } from "./components/VideosList";

const App = () => {

  useEffect(()=>{
    // const fetchFile = (url)=> {
    //   fetch(url)
    //   .then(response => response.body)
    //   .then(rs => {
    //     const reader = rs.getReader();
    //     return new ReadableStream({
    //       async start(controller) {
    //         while (true) {
    //           const { done, value } = await reader.read();
    //           if (done) break;
    //           controller.enqueue(value);
    //         }
    //         controller.close();
    //         reader.releaseLock();
    //       }
    //     })
    //   })
    //   .then(rs => new Response(rs))
    //   .then(response => response.blob())
    //   .then(blob => { 
    //     // console.log(blob)
    //     let tempUrl = URL.createObjectURL(blob);
    //     // console.log(tempUrl);
    //     console.table(blob)
    //     const aTag = document.createElement("a");
    //     aTag.href = tempUrl;
    //     aTag.download = 'chunks.txt';
    //     aTag.target = '_blank';
    //     document.body.appendChild(aTag);
    //     aTag.click();
    //     URL.revokeObjectURL(tempUrl);
    //     aTag.remove();
    //     console.log('download complelte!');
    //   })
    //   .catch(console.error)
    // }

    // fetchFile('/chunks')
  
  },[])

  return (
    <>
      <Header />
      <VideosList />
      <Footer />
    </>
  )
  
}

export default App