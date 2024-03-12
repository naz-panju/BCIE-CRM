import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@mui/material';
import { signOut } from 'next-auth/react';
import { LockOpenIcon } from '@mui/icons-material/LockOpen';
import { ExitToAppIcon } from '@mui/icons-material/ExitToApp';


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

  const [isBodyClassAdded, setIsBodyClassAdded] = useState(false);

  const handleButtonClick = () => {
    // Toggle the state to add or remove the class
    setIsBodyClassAdded((prev) => !prev);
  };

  // Use a useEffect hook to add or remove the class on the body element
  useEffect(() => {
    if (isBodyClassAdded) {
      document.body.classList.add('body-active');
    } else {
      document.body.classList.remove('body-active');
    }

    // Cleanup: remove the class when the component is unmounted
    return () => {
      document.body.classList.remove('body-active');
    };
  }, [isBodyClassAdded]);

  return (
    <div className='header'>
      <div className='container-fluid '>
        <div className='row flex items-center'>
          <div className="w-full md:w-6/12 lg:w-6/12 pad-15 clg_header clg_header_">
            <button onClick={handleButtonClick} type="button" className="inbl bgnone bdrnone pdnone valigntop sbarCollapsebtn sidebarCollapse"><span></span><span></span><span></span></button>

          
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
                        
                        <div className='login-dropdown-list'>
                          <div className='login-dropdown-list-item dropdown-name-block'>
                            <button onClick={togglePopup} id="UserPop"><span>MT</span></button>
                            <div>
                              <h3>Meritto Trial User</h3>
                              <h6>shahabaz.s@gmail.com</h6>
                            </div>
                          </div>

                          <div className='login-dropdown-list-item'>
                            <FontAwesomeIcon icon={LockOpenIcon} />
                            <a>Change Password</a>
                          </div>

                          <div className='login-dropdown-list-item'>
                            <FontAwesomeIcon icon={ExitToAppIcon} />
                            <a onClick={handleSignout}>Sign Out</a>
                          </div>
                        </div>

                        
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