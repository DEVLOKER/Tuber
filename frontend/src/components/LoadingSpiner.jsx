import React from 'react'

export const LoadingSpiner = ({text="", size=3}) => {
    return (
        <>
            <div className="d-flex justify-content-center align-items-center flex-column">
                <div className="d-flex justify-content-center align-items-center" >
                    <div className="spinner-grow text-danger m-1" style={{width: `${size}rem`, height: `${size}rem`}} role="status"></div>
                    <div className="spinner-grow text-danger m-1" style={{width: `${size}rem`, height: `${size}rem`}} role="status"></div>
                    <div className="spinner-grow text-danger m-1" style={{width: `${size}rem`, height: `${size}rem`}} role="status"></div>
                </div>
                <h5 className="text-danger text-center mt-3">{text}</h5>
            </div>
        </>
    )
}
