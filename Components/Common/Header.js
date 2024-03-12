import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@mui/material';
import { useState } from 'react';
import { signOut } from 'next-auth/react';




const Header = ({ }) => {

  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const handleSignout = () => {
    localStorage.removeItem('token')
    signOut()
  }


  return (
    <div className='header'>
      <div className='container-fluid '>
        <div className='row flex items-center'>
          <div className="w-full md:w-6/12 lg:w-6/12 pad-15 clg_header clg_header_">
            <button type="button" className="inbl bgnone bdrnone pdnone valigntop sbarCollapsebtn sidebarCollapse"><span></span><span></span><span></span></button>
          </div>

          <div className='w-full md:w-6/12 lg:w-6/12 pad-15 '>
            <div className='navbar-right'>
              <ul>
                <li>
                  <div className="tooltip-container">
                    <div className="tooltip">
                      <Tooltip title={'test'}><span className="tooltiptext">Tooltip</span></Tooltip>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="tooltip-container">
                    <div className="tooltip"><i><FontAwesomeIcon icon={faGear} /></i>
                      <span className="tooltiptext">Service</span>
                    </div>
                  </div>
                </li>

                <li>
                  <div className="tooltip-container">
                    <div className="tooltip"><i><FontAwesomeIcon icon={faMagnifyingGlass} /></i>
                      <span className="tooltiptext">Service</span>
                    </div>
                  </div>
                </li>

                <li>
                  <div className="tooltip-container">
                    <div className="tooltip"><i><FontAwesomeIcon icon={faMagnifyingGlass} /></i>
                      <span className="tooltiptext">Service</span>
                    </div>
                  </div>
                </li>

                <li>
                  <div className="tooltip-container">
                    <div className="tooltip"><i><FontAwesomeIcon icon={faMagnifyingGlass} /></i>
                      <span className="tooltiptext">Service</span>
                    </div>
                  </div>
                </li>

                <li>
                  <div className='dropdown headerDropDown userDropDown'>
                    <button onClick={togglePopup} id="UserPop"><span>MT</span></button>
                    {isOpen && (
                      <div className="popup-content" onClick={closePopup}>
                        <a onClick={handleSignout}>Sign Out</a>
                        {/* Add more signout options here if needed */}
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
}
export default Header;