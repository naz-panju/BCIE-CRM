import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import { LockOpenIcon } from '@mui/icons-material/LockOpen';
import { ExitToAppIcon } from '@mui/icons-material/ExitToApp';
import { ExitToApp, LockOpen, Menu, MenuOpen } from '@mui/icons-material';
import { blue } from '@mui/material/colors';


const Header = ({ }) => {

  const { data: session, status } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  // const [user, setUser] = useState()


  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const handleSignout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login';
    signOut()
  }

  const [isBodyClassAdded, setIsBodyClassAdded] = useState(false);

  const [sideBarActive, setSideBarActive] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedSettings = localStorage.getItem('settings');
      return storedSettings ? JSON.parse(storedSettings).sidebar : false;
    }
    return false;
  });

  const handleButtonClick = () => {
    // Toggle the state to add or remove the className
    setSideBarActive(!sideBarActive)
    localStorage.setItem('settings', JSON.stringify({ sidebar: !sideBarActive }));
    setIsBodyClassAdded((prev) => !prev);
  };

  const getFirstLettersOfTwoWords = (name) => {
    if (name) {
      const words = name.split(" "); // Split the name into an array of words
      if (words.length >= 2) {
        // Extract the first letter of the first two words and concatenate them
        return words[0].charAt(0) + words[1].charAt(0);
      } else if (words.length === 1) {
        // If there's only one word, return its first letter
        return words[0].charAt(0);
      }
    }
    return ""; // Return an empty string if name is not provided
  };

  // useEffect(() => {
  //     if (typeof window !== 'undefined') {
  //         localStorage.setItem('settings', JSON.stringify({ sidebar: sideBarActive }));
  //     }
  // }, [sideBarActive]);

  // Use a useEffect hook to add or remove the className on the body element
  useEffect(() => {
    if (sideBarActive) {
      document.body.classList.add('body-active');
    } else {
      document.body.classList.remove('body-active');
    }

    // Cleanup: remove the className when the component is unmounted
    return () => {
      document.body.classList.remove('body-active');
    };
  }, [sideBarActive]);

  // useEffect(() => {
  //   setUser(session?.user)
  // }, [session]);



  return (
    <div className='header'>
      <div className='container-fluid '>
        <div className='row flex items-center'>
          <div className="w-full md:w-6/12 lg:w-6/12 pad-15 clg_header clg_header_">
            {/* <button onClick={handleButtonClick} type="button" className="inbl bgnone bdrnone pdnone valigntop sbarCollapsebtn sidebarCollapse">
              {sideBarActive ? <MenuOpen /> :  <Menu />}
            </button> */}
          </div>

          <div className='w-full md:w-6/12 lg:w-6/12 pad-15 '>
            <div className='navbar-right'>
              <ul>
                <li>
                  <div className='dropdown headerDropDown userDropDown'>
                    <button onClick={togglePopup} id="UserPop"><span>{getFirstLettersOfTwoWords(session?.user?.name)}</span></button>
                    {isOpen && (
                      <div className="popup-content" onClick={closePopup}>

                        <div className='login-dropdown-list'>
                          <div className='login-dropdown-list-item dropdown-name-block'>
                            <button onClick={togglePopup} id="UserPop"><span>{getFirstLettersOfTwoWords(session?.user?.name)}</span></button>
                            <div>
                              <h3>{session?.user?.name}</h3>
                              <h6>{session?.user?.email}</h6>
                            </div>
                          </div>

                          <div className='login-dropdown-list-item'>

                            <a><LockOpen sx={{ color: blue[300] }} fontSize='small' /> Change Password</a>
                          </div>

                          <div className='login-dropdown-list-item'>

                            <a onClick={handleSignout}><ExitToApp sx={{ color: blue[300] }} fontSize='small' /> Sign Out</a>
                          </div>
                        </div>

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