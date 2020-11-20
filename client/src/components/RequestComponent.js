import React, { useCallback, useContext, useEffect } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import { Loader } from './Loader'

export const RequestComponent = (props) => {
    
    let requestTakeSection
    const message = useMessage()
    const history = useHistory()
    const { request, loading, error, clearError } = useHttp()
    const { token, userId } = useContext(AuthContext)

    const addBooksToRequestHandler = (event) => {
        history.push(`/books/newrequest/${event.currentTarget.getAttribute('data-requestId')}`)
    }

    const cancelRequestHandler = useCallback(async (event) => {
        try {
            const requestId = event.currentTarget.getAttribute('data-requestId')
            const data = await request(`/api/request/cancel/${requestId}`, 'POST', null, {
                Authorization: `Bearer ${token}`
            })
            message(data.message)
            document.getElementById(`${requestId}`).classList.add('hidden')
        } catch (e) { }
    }, [request, token, message])

    useEffect(() => {
        message(error);
        clearError()
    }, [error, message, clearError])

    if (loading) {
        return <Loader />
    }

    if (props.item.take.length) {
        requestTakeSection = <div className="request-give-section">
            <div className="request-list-header">
                <div>and wants to take from <NavLink to={`/users/${props.item.to._id}`} >{props.item.to.name}</NavLink></div>
                {props.item.to._id === userId ? <div className="row-h"><div className="request-decline" data-requestId={`${props.item._id}`} onClick={cancelRequestHandler}>Decline</div></div> : ''}
            </div>
            <ul className="request-list-book">

                {props.item.take.map(toTake => {
                    return (
                        <li key={toTake._id} className="request-book">
                            <div className="request-book-title">{toTake.title}</div>
                            <div className="request-book-subtitle">{toTake.subtitle}</div>
                        </li>
                    )
                })}
            </ul>
        </div>
    } else {
        if (props.item.from._id === userId) {
            requestTakeSection = <div className="request-give-section-btn">
                <button className="btn" onClick={addBooksToRequestHandler} data-requestId={`${props.item._id}`}>Add books</button>
            </div>
        }
    }

    return (
        <div className="request-list-item">
            <div className="request-give-section">
                <div className="request-list-header">
                    <div><NavLink to={`/users/${props.item.from._id}`} >{props.item.from.name}</NavLink> wants give</div>
                    {props.item.from._id === userId ? <div className="request-cancel" data-requestId={`${props.item._id}`} onClick={cancelRequestHandler}>Cancel</div> : ''}
                </div>
                <ul className="request-list-book">
                    {props.item.give.map(toGive => {
                        return (
                            <li key={toGive._id}className="request-book">
                                <div className="request-book-title">{toGive.title}</div>
                                <div className="request-book-subtitle">{toGive.subtitle}</div>
                            </li>
                        )
                    })}
                </ul>
            </div>
            {requestTakeSection}
        </div>
    )
}