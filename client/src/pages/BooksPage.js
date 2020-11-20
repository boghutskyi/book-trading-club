import React, { useCallback, useEffect, useState, useContext } from 'react'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { Book } from '../components/Book'
import { useMessage } from '../hooks/message.hook'
import { Loader } from '../components/Loader'
import './BooksPage.css'

export const BooksPage = () => {

    const { token, userId } = useContext(AuthContext)
    const [form, setForm] = useState({ give: [], take: [] })
    const [users, setUsers] = useState({ from: '', to: '' })
    const [books, setBooks] = useState([])
    const message = useMessage()
    const { request, error, loading, clearError } = useHttp()
    let render;

    const fetchBooks = useCallback(async () => {
        try {
            const data = await request('/api/book/books', 'GET', null)
            setBooks(data)
        } catch (e) { }
    }, [request])

    const selectHandler = (event) => {
        setUsers({ ...users, from: userId })
        if (event.currentTarget.getAttribute('data-owner') === userId) {
            event.currentTarget.querySelector('.item-selector').classList.toggle('select-own')
            if (form.give.includes(event.currentTarget.id)) {
                form.give.splice(form.give.indexOf(event.currentTarget.id), 1)
            } else {
                setForm({ ...form, give: [...form.give, event.currentTarget.id] })
            }

        } else {
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
        }
        event.currentTarget.querySelector('.material-icons-round').innerHTML === 'check_box_outline_blank' ? event.currentTarget.querySelector('.material-icons-round').innerHTML = 'check_box' : event.currentTarget.querySelector('.material-icons-round').innerHTML = 'check_box_outline_blank'
    }

    const requestHandler = (async () => {
        try {
            const data = await request('/api/request/create', 'POST', { ...form, ...users }, {
                Authorization: `Bearer ${token}`
            })
            message(data.message)
            setForm({ give: [], take: [] })
            setUsers({ from: '', to: '' })
            document.querySelectorAll('.item-selector').forEach(item => {
                item.classList.remove('select-own')
                item.classList.remove('select')
            })
            document.querySelectorAll('.material-icons-round').forEach(item => item.innerHTML = 'check_box_outline_blank')
            fetchBooks()
        } catch (e) { }
    })
    
    useEffect(() => {
        fetchBooks()
        message(error)
        clearError()
    }, [error, message, clearError, fetchBooks])

    if (loading) {
        return <Loader />
    }

    if (!books.length) {
        render = <div className="input-label yellow">No books</div>
    } else {
        render =
            <>
                <ul className="books-list">
                    {books.map(book => (
                        <li id={book._id} data-owner={book.owner._id} onClick={selectHandler} key={book._id} className="list-item-class" ><Book book={book} /></li>
                    ))}
                </ul>
                <button className="btn" disabled={loading} onClick={requestHandler}>New Request</button>
            </>
    }

    return (
        <div className="app">
            <div className="header">Books available for trade</div>
            {render}
        </div>
    )
}
