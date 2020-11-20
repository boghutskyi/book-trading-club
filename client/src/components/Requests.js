import React from 'react'
import { NavLink } from 'react-router-dom'

export const Requests = (requests) => {
    if (requests.requests) {
        return (
            <>
                <div className="options-request"><NavLink to={`/request/${requests.bookId}`}>Requests</NavLink><span className="options-request-cont">{requests.requests.length}</span></div>
                <div className="options-requestors">({requests.requests.map((item, index) => {
                    if (item.from) {
                        if (index === requests.requests.length - 1) {
                            return (
                                <NavLink to={`/users/${item.from._id}`}><span className="options-requestors-login">{item.from.name}</span></NavLink>
                            )
                        }
                        return (
                            <NavLink to={`/users/${item.from._id}`}><span className="options-requestors-login">{item.from.name}, </span></NavLink>
                        )
                    } 
                    return null
                })})</div>
            </>
        )
    }
    return (
        <>
        </>
    )
}