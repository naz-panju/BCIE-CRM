import React from 'react'

function FormNotFound() {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1 className="not-found-title">404</h1>
                <h2 className="not-found-subtitle">Page Expired or Not Found</h2>
                <p className="not-found-text">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                <button className="not-found-button" onClick={() => history.push('/')}>Go to Homepage</button>
            </div>
        </div>
    )
}

export default FormNotFound
