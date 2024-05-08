import React, { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { ExitToApp, LockOpen, Menu, MenuOpen } from '@mui/icons-material';
import { blue } from '@mui/material/colors';


const UserProfile = () => {

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
        signOut()
    }


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


    return (
        // <div className='header'>
        //     <div className='container-fluid '>
        //         <div className='row flex items-center'>
        //             <div className="w-full md:w-6/12 lg:w-6/12 pad-15 clg_header clg_header_">
        //             </div>

        <div className='w-full'>
            <div className='navbar-left'>
                <ul>
                    <li>
                        <div className='dropdown headerDropDown userDropDown d-flex align-item-center'>
                            <button onClick={togglePopup} id="UserPop">
                                <span>{getFirstLettersOfTwoWords(session?.user?.name)} </span>
                            </button>
                            {session?.user?.name}
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
        //         </div>
        //     </div>

        // </div>


    );
}
export default UserProfile;