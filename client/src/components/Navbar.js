import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { Email } from './Email'
import './Navbar.css'

export const Navbar = () => {
    const auth = useContext(AuthContext)

    let render
    let trades
    if (auth.isAuthenticated) {
        render = <Email />
        trades = <li className="nav-list-item"><NavLink to="/trades">Trades</NavLink></li>
    } else {
        render =
            <>
                <NavLink className="link" to="/auth">Sign in</NavLink>
                <NavLink className="nav-login" to="/register">Register</NavLink>
            </>
        trades = ''
    }

    return (
        <nav className="nav">
            <div className="nav-menu">
                <div className="nav-block">
                    <div className="logo">Book Exchange</div>
                    <ul className="nav-list">
                        <li className="nav-list-item"><NavLink to="/books">Books</NavLink></li>
                        <li className="nav-list-item"><NavLink to="/requests">Requests</NavLink></li>
                        {trades}
                        <li className="nav-list-item"><NavLink to="/users">Users</NavLink></li>
                    </ul>
                </div>
                <div className="login-block">
                    {render}
                </div>
            </div>
        </nav>
    )
}