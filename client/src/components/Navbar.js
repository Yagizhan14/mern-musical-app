import React from 'react'
import { NavLink,Link } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'
import { logoutAction } from '../redux'

const Navbar = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const dispatch = useDispatch()
    const logout = () => {
        setTimeout(() => {
            dispatch(logoutAction())
        },500)
    };

    return (
        <header className="navbar">
                <Link to="/" className="brand">
                    MUSICAL
                </Link>
                <ul className="nav">
                    {isAuthenticated ? (
                        <>
                        <li>
                            <NavLink to="/search" className="navlink">
                                Search Songs
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/playlist" className="navlink">
                                My Playlist
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/" className="navlink logout" onClick={logout}>
                                Log Out<i className="fas fa-sign-out-alt"></i>
                            </NavLink>
                        </li>
                        </>
                    ) : (
                        <>
                        <li>
                            <NavLink to="/sign-up" className="navlink">
                                Sign Up
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/sign-in" className="navlink" id="sign-in-button">
                                Sign In
                            </NavLink>
                        </li>
                        </>
                        )
                    }
                    
                </ul>
        </header>
    )
}

export default Navbar
