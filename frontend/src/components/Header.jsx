import React from 'react'
// import { Outlet, Link } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { setVideos } from '../context/redux.videos'
import { useState } from 'react';
import { toggleLoading } from '../context/redux.loading'

import { RiVideoDownloadFill } from "@react-icons/all-files/ri/RiVideoDownloadFill";
import { FiSearch } from "@react-icons/all-files/fi/FiSearch";
import './header.css'
import { useEffect } from 'react';


export const Header = () => {

    const dispatch = useDispatch()

    // const [searchText, setSearchText] = useState('http://youtube.com/watch?v=2lAe1cqCOXo')
    const [searchText, setSearchText] = useState('https://www.youtube.com/watch?v=tPEE9ZwTmy0')

    
    const fetchVideos = ()=>{
        dispatch(toggleLoading(true))
        dispatch(setVideos([]))

        fetch(`/search`,{
            method: 'POST',
            body: JSON.stringify({searchText}),
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
            dispatch(setVideos(results))
            dispatch(toggleLoading(false))
        })
        .catch((error) => {
            console.log('an error occurred while searching : '+error.message)
        });
    }

    const searchVideos = (e)=>{
        if (e.key === 'Enter') {
            fetchVideos()
        }
    }

    useEffect(()=>{
        fetchVideos()
    },[])

    return (
        <nav className="navbar navbar-expand-lg fixed-top sticky-top navbar-danger bg-danger">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    <span className="btn btn-light btn-sm" >
                        <RiVideoDownloadFill />
                    </span>
                    <span className="mb-0 ps-2 h4 text-white">Tuber</span>
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {/* <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/page1">Page1</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/page2">Page2</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/page3">Page3</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/page4">Page4</Link>
                        </li>
                    </ul> */}
                </div>
                <div className="form-group search w-100">
                    <input type="text" className="form-control" placeholder="Search" defaultValue={searchText} onKeyUp={searchVideos} onChange={(e)=>setSearchText(e.target.value)} />
                    <FiSearch />
                </div>
            </div>
        </nav>
    )
}
