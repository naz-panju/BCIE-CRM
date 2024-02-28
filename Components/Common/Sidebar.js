import React, { useState } from 'react';

import Image from "next/image";
import LogoIcon from '@/styles/meritto-icon.svg';
import Logo from '@/styles/merittologo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faTableColumns } from '@fortawesome/free-solid-svg-icons';
import { faHouseChimney } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleMouseEnter = () => {
        setIsExpanded(true);
    };

    const handleMouseLeave = () => {
        setIsExpanded(false);
    };


    return (




        <nav id="sidebar" className={`sidebar sidebar-mask active ${isExpanded ? 'active' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="sidebar__inner scrollCustom">
                <div className="site-logo onlyDesktop">
                    <a href="#" className="inbl valigntop logo">
                        <Image src={LogoIcon} alt='LogoIcon' width={30} className='tiny-sidebar' />
                        <Image src={Logo} alt='LogoIcon' width={145} className='max-sidebar' />
                    </a>
                </div>

                <ul className="list-unstyled components mainList" id="menuList">

                    <li><a href='#'><i><FontAwesomeIcon icon={faMagnifyingGlass} /></i><span>Dashboard</span></a></li>
                    <li><a href='#'><i><FontAwesomeIcon icon={faTableColumns} /></i><span>FormDesk</span></a></li>
                    <li><a href='#'><i><FontAwesomeIcon icon={faHouseChimney} /></i><span>Leads Manager</span></a></li>
                    <li><a href='#'><i><FontAwesomeIcon icon={faMagnifyingGlass} /></i><span>Application Manager</span></a></li>
                    <li><a href='#'><i><FontAwesomeIcon icon={faTableColumns} /></i><span>Marketing</span></a></li>
                    <li><a href='#'><i><FontAwesomeIcon icon={faHouseChimney} /></i><span>Campaign Manager</span></a></li>
                    <li><a href='#'><i><FontAwesomeIcon icon={faMagnifyingGlass} /></i><span>Query Manager</span></a></li>
                    <li><a href='#'><i><FontAwesomeIcon icon={faTableColumns} /></i><span>Payment Manager</span></a></li>
                    <li><a href='#'><i><FontAwesomeIcon icon={faHouseChimney} /></i><span>Settings</span></a></li>
                </ul>
            </div>
        </nav>


    )
}

export default Sidebar;
