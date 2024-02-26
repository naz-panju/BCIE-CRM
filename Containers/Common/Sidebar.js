import React from 'react'

function Sidebar() {

    const sidebarStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%', // Adjust the height as needed
        width: '200px', // Adjust the width as needed
        backgroundColor: '#f0f0f0', // Example background color
        // Add any other styles you want for your sidebar
    };

    return (
       <div className='container'>
            <div className='sidebar'>
                <div>
                    Menus
                </div>
    
            </div>
       </div>
    )
}

export default Sidebar
