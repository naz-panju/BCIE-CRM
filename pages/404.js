import FormNotFound from '@/Components/404/formNotFound';
import { useRouter } from 'next/router'
import React from 'react'

function PageNotFound() {

    return (
        <div className='notFoundMain'>
            <div className="not-found-container">
                <div className="not-found-content">
                    <h1 className="not-found-title">404</h1>
                    <h2 className="not-found-subtitle">Page Not Found</h2>
                </div>
            </div>
      </div>
    )
}

export default PageNotFound
