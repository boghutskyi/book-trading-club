import React, { useCallback, useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { Requests } from './Requests'
import { AuthContext } from '../context/AuthContext'
import { useMessage } from '../hooks/message.hook'
import { Loader } from './Loader'

export const Book = (book) => {
    const { token, userId } = useContext(AuthContext)
    const { request, error, clearError, loading } = useHttp()
    const message = useMessage()

    useEffect(() => {
        message(error);
        clearError()
    }, [error, message, clearError])

    const deleteHandler = useCallback(async (event) => {
        try {
            const bookId = event.target.getAttribute('data-id')
            const data = await request('/api/book/delete', 'POST', { bookId }, {
                Authorization: `Bearer ${token}`
            })
            document.getElementById(`${bookId}`).classList.add('hidden')
            message(data.message)
        } catch (e) { }
    }, [request, token, message])

    const selectHandler = (event) => {
        if (event.target.classList.contains('info-owner-login') || event.target.classList.contains('options-delete')) {
            return null
        }
    }

    if (loading) {
        return <Loader />
    }
    return (
            <div className="list-item" onClick={selectHandler}>
                <div className="item-selector">
                <span className="material-icons-round">check_box_outline_blank</span>

                </div>
                <div className="item-info">
                    <div className="info-title">{book.book.title}</div>
                    <div className="info-subtitle">{book.book.subtitle}</div>
                    <div className="info-owner">
                        from <NavLink to={`/users/${book.book.owner._id}`}><span className="info-owner-login">{book.book.owner.name}</span></NavLink> in {book.book.owner.city} {book.book.owner.state}
                    </div>
                </div>
                <div className="item-options">
                    {book.book.requests.length ? <Requests requests={book.book.requests} bookId={book.book._id} /> : ''}
                    {book.book.owner._id === userId ? <div className="options-delete" onClick={deleteHandler} data-id={book.book._id}>Delete</div> : ''}
                </div>
            </div>
    )
}