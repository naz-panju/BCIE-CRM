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

            <li><a href='#'><i><FontAwesomeIcon icon={faMagnifyingGlass} /></i><span>Menu1</span></a></li>
            <li><a href='#'><i><FontAwesomeIcon icon={faTableColumns} /></i><span>Menu2</span></a></li>
            <li><a href='#'><i><FontAwesomeIcon icon={faHouseChimney} /></i><span>Menu2</span></a></li>
            <li><a href='#'><i><FontAwesomeIcon icon={faMagnifyingGlass} /></i><span>Menu1</span></a></li>
            <li><a href='#'><i><FontAwesomeIcon icon={faTableColumns} /></i><span>Menu2</span></a></li>
            <li><a href='#'><i><FontAwesomeIcon icon={faHouseChimney} /></i><span>Menu2</span></a></li>
            <li><a href='#'><i><FontAwesomeIcon icon={faMagnifyingGlass} /></i><span>Menu1</span></a></li>
            <li><a href='#'><i><FontAwesomeIcon icon={faTableColumns} /></i><span>Menu2</span></a></li>
            <li><a href='#'><i><FontAwesomeIcon icon={faHouseChimney} /></i><span>Menu2</span></a></li>
            <li><a href='#'><i><FontAwesomeIcon icon={faMagnifyingGlass} /></i><span>Menu1</span></a></li>
            <li><a href='#'><i><FontAwesomeIcon icon={faTableColumns} /></i><span>Menu2</span></a></li>
            <li><a href='#'><i><FontAwesomeIcon icon={faHouseChimney} /></i><span>Menu2</span></a></li>
            <li><a href='#'><i><FontAwesomeIcon icon={faMagnifyingGlass} /></i><span>Menu1</span></a></li>
            <li><a href='#'><i><FontAwesomeIcon icon={faTableColumns} /></i><span>Menu2</span></a></li>
            <li><a href='#'><i><FontAwesomeIcon icon={faHouseChimney} /></i><span>Menu2</span></a></li>
        </ul>
    </div>
</nav>


    )
}

export default Sidebar;
