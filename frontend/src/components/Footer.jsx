import React from 'react'

import '../style/footer.css'


import { MdEmail } from "@react-icons/all-files/md/MdEmail";
import { SiUpwork } from "@react-icons/all-files/si/SiUpwork";
import { ImLinkedin } from "@react-icons/all-files/im/ImLinkedin";
import { AiOutlineGithub } from "@react-icons/all-files/ai/AiOutlineGithub";

export const Footer = () => {
    
    
    const contacts = [
        {website: "LinkedIn", link: "http://www.linkedin.com/in/dev-loker", icon: <ImLinkedin />},
        {website: "GitHub", link: "https://github.com/devloker", icon: <AiOutlineGithub />},
        {website: "Upwork", link: "https://www.upwork.com/freelancers/~01abb360bdb5d8e5df", icon: <SiUpwork />},
        {website: "Email", link: "mailto:cntcts.dev.loker@outlook.com", icon: <MdEmail /> },
    ]

    const apps = [
        { name: "Opera Peinture", link: "https://play.google.com/store/apps/details?id=org.qtproject.opera_peinture" },
        { name: "Digitso", link: "http://www.amazon.com/gp/mas/dl/android?p=dev.loker.games.digitso" },
        { name: "Barbers Incomes", link: "http://www.amazon.com/gp/mas/dl/android?p=dev.loker.apps.barbers_incomes" },
    ]

    return (
        <nav className="navbar footer fixed-bottom_ pt-5">
            <div className="container-fluid">
                <div className="container text-center">
                    <div className="row align-items-start">
                        <div className="col">
                            <p className="h6"><strong>About</strong></p>
                            <div className="mb-3">
                                <p className="text">
                                Application for downloading youtube video & audio streams, 
                                as well as captions if exist, created using Python & React, 
                                source code available on : <a rel="noopener noreferrer" className="link" href="https://github.com/DEVLOKER/Tuber" target="_blank">GitHub</a>
                                </p>
                            </div>
                        </div>
                        <div className="col">
                            <p className="h6"><strong>Follow Us</strong></p>
                            <ul className="list-group_ links">
                                {
                                    contacts.map((item, index)=>
                                        <li key={index} className="list-group-item">
                                            <small>
                                                <a rel="noopener noreferrer" className="nav-link text-decoration-none" href={item.link} target="_blank">{item.icon} {item.website}</a>
                                            </small>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                        <div className="col">
                            <p className="h6"><strong>Other Apps</strong></p>
                            <ul className="list-group_ links">
                                {
                                    apps.map((item, index)=>
                                        <li key={index} className="list-group-item">
                                            <small>
                                                <a rel="noopener noreferrer" className="nav-link text-decoration-none" href={item.link} target="_blank">{item.name}</a>
                                            </small>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}