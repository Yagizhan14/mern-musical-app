import React from 'react'
import {Link} from 'react-router-dom'

const PageNotFound = () => {
    return (
        <div className="not-found-page">
            <i className="fas fa-exclamation"></i>
            <div className="not-found-page-description">
                <h1>Page Not Found</h1>
                <Link to="/">Return to Home Page<i className="fas fa-angle-right"></i></Link>
            </div>
        </div>
    )
}

export default PageNotFound
