import React, { useEffect } from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { VideosList } from "./components/VideosList";


const App = () => {


  // useEffect(() => {
  //   const handleTabClose = event => {
  //     event.preventDefault();

  //     console.log('beforeunload event triggered');

  //     return (event.returnValue = 'Are you sure you want to exit?');
  //   };

  //   window.addEventListener('beforeunload', handleTabClose);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleTabClose);
  //   };
  // }, []);


  return (
    <>
      <Header />
      <VideosList />
      <Footer />
    </>
  )
  
}

export default App