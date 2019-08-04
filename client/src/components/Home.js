import React,{ useEffect } from 'react'
import {Link} from 'react-router-dom'
import {useSelector} from 'react-redux'

const Home = () => {
    
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

    useEffect(() => {
        document.querySelector('.preloader').classList.toggle('complete')
        setTimeout(() => {
            document.querySelector('.preloader').classList.toggle('complete')
        },2000)
    },[])

    return (
        <div className="home-content">
            <i className="fas fa-music"></i>
            <div className="home-right">
                <h1 className="home-header">WELCOME</h1>
                <h4 className="home-description"><strong>Musical</strong>   is an application that allows you to listen whichever song whenever, wherever you want. You can start using this application by clicking the button below.</h4>
                <Link to={!isAuthenticated ?  "/sign-in" : "/search"} className="getstarted-button">Get Started</Link>
            </div>
        </div>
    )
}

export default Home
