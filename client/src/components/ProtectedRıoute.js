import React from 'react'
import {useSelector} from 'react-redux'
import {Redirect,Route} from 'react-router-dom'

const ProtectedRoute = ({component:Component,...rest}) =>  {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

    return (
        <Route {...rest} render={
            (props) => {
                if(isAuthenticated && (Component.name === "SignIn" ||  Component.name === "SignUp")) return <Redirect to={{pathname:"/",state:{from:props.location}}}/>
                if(!isAuthenticated && (Component.name === "Playlist" || Component.name === "Search")) return <Redirect to={{pathname:"/",state:{from:props.location}}}/>
                else{
                    return <Component {...props} />
                }
            }
        } />
    )
}

export default ProtectedRoute
