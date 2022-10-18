import React from 'react'

export const Footer = () => {
    return (
        <nav className="navbar fixed-bottom bg-dark">
            <div className="container-fluid">
                <div className="container text-center text-white">
                    <div className="row align-items-start">
                        <div className="col">
                            <small>
                                @2022 All Rights Reserved
                            </small>
                        </div>
                        <div className="col">
                            <small>
                                    Devloped by : <a className="navbar-brand_ link-light" href="https://www.khaled-meherguef.com">Devloker</a>
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
