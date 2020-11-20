import React, { useContext } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import './Email.css'

export const Email = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)

    const logoutHandler = (event) => {
        event.preventDefault()
        auth.logout()
        history.push('/')
    }

    const mouseHandler = () => {
        document.querySelector('.nav-sub-list').classList.toggle('open')
    }

    return (
        <div className="nav-user">
            <div className="nav-user-email" onMouseEnter={mouseHandler} onMouseLeave={mouseHandler} >{auth.name} <span className="material-icons-round icon-small">keyboard_arrow_down</span></div>
            <ul className="nav-sub-list">
                <li><NavLink className="nav-sub-list-item" to={`/users/${auth.userId}`}>Edit Profile</NavLink></li>
                <li><NavLink className="nav-sub-list-item" to="/books/my">Add book</NavLink></li>
                <li><a className="nav-sub-list-item" href="/" onClick={logoutHandler}>Log out</a></li>
            </ul>
        </div>
    )
}