import React from 'react'

function Header() {
  return (
    <div className='header'>
      <div className='container-fluid'>
        <div className='row flex'>
          <div className="w-full md:w-6/12 lg:w-6/12 pad-15 clg_header clg_header_">
            <button type="button" class="inbl bgnone bdrnone pdnone valigntop sbarCollapsebtn sidebarCollapse"><span></span><span></span><span></span></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
