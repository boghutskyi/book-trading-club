import React, { useCallback, useEffect, useState, useContext } from 'react'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { Book } from '../components/Book'
import './BooksPage.css'
import { useHistory, useParams } from 'react-router-dom'
import { useMessage } from '../hooks/message.hook'
import { Loader } from '../components/Loader'

export const BookNewRequestPage = () => {

    const history = useHistory()
    const { token, userId } = useContext(AuthContext)
    const [form, setForm] = useState({ take: [] })
    const [users, setUsers] = useState({ to: '' })
    const [books, setBooks] = useState([])
    const { requestId } = useParams()
    const message = useMessage()

    const { request, loading } = useHttp()
    
    const fetchData = useCallback(async () => {
        try {
            const bookData = await request('/api/book/newrequest', 'POST', { userId }, {
                Authorization: `Bearer ${token}`
            })
            setBooks(bookData)
        } catch (e) { }
    }, [request, userId, token])


    useEffect(() => {
        fetchData()
    }, [fetchData])

    const selectHandler = (event) => {
        if (!form.take.length) {
            setUsers({ ...users, to: event.currentTarget.getAttribute('data-owner') })
        }

        if (form.take.length && event.currentTarget.getAttribute('data-owner') !== users.to) {
            return null
        }
        event.currentTarget.querySelector('.item-selector').classList.toggle('select')
        if (form.take.includes(event.currentTarget.id)) {
            form.take.splice(form.take.indexOf(event.currentTarget.id), 1)
            if (!form.take.length) {
                setUsers({ ...users, to: '' })
            }
        } else {
            setForm({ ...form, take: [...form.take, event.currentTarget.id] })
        }

        event.currentTarget.querySelector('.material-icons-round').innerHTML === 'check_box_outline_blank' ? event.currentTarget.querySelector('.material-icons-round').innerHTML = 'check_box' : event.currentTarget.querySelector('.material-icons-round').innerHTML = 'check_box_outline_blank'
    }

    const requestHandler = (async () => {
        try {
            const data = await request('/api/request/update', 'POST', { ...form, ...users, requestId: requestId }, {
                Authorization: `Bearer ${token}`
            })
            message(data.message)
            history.push('/requests')
        } catch (e) { }
    })

    if (loading) {
        return <Loader />
    }

    return (
        <div className="app">
            <div className="header">Select books for trade</div>
            <ul className="books-list">
                {books.map(book => (
                    <li id={book._id} data-owner={book.owner._id} onClick={selectHandler} key={book._id} className="list-item-class" ><Book book={book} /></li>
                ))}
            </ul>
            <button className="btn" onClick={requestHandler}>New Request</button>
        </div>
    )
}
