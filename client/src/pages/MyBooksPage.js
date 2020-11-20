import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { Book } from '../components/Book'
import { Loader } from '../components/Loader'
import { useHistory } from 'react-router-dom'
import { useMessage } from '../hooks/message.hook'

export const MyBooksPage = () => {

    let render;
    const message = useMessage()
    const history = useHistory()
    const { token, userId } = useContext(AuthContext)
    const { request, loading, error, clearError } = useHttp()
    const [form, setForm] = useState({ title: '', subtitle: '' })
    const [books, setBooks] = useState([])

    const [list, setList] = useState({ give: [] })
    const [user, setUser] = useState({ from: '' })

    const changeHandler = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }
    const selectHandler = (event) => {
        setUser({ from: userId })
        event.currentTarget.querySelector('.item-selector').classList.toggle('select-own')
        if (list.give.includes(event.currentTarget.id)) {
            list.give.splice(list.give.indexOf(event.currentTarget.id), 1)
        } else {
            setList({ give: [...list.give, event.currentTarget.id] })
        }
        event.currentTarget.querySelector('.material-icons-round').innerHTML === 'check_box_outline_blank' ? event.currentTarget.querySelector('.material-icons-round').innerHTML = 'check_box' : event.currentTarget.querySelector('.material-icons-round').innerHTML = 'check_box_outline_blank'
    }
    const newRequestHandler = () => {

        if (!list.give.length) {
            return message('Can not create request')
        }
        localStorage.setItem('toGiveObj', JSON.stringify({
            ...user, ...list
        }))
        localStorage.removeItem('toTakeObj')
        history.push('/request/new')
    }

    const addHandler = async (event) => {
        event.preventDefault()
        try {
            if (!form.title) {
                return message('Can not add book')
            }
            const data = await request('/api/book/add', 'POST', { ...form }, {
                Authorization: `Bearer ${token}`
            })
            message(data.message)
            setForm({ title: '', subtitle: '' })
            fetchBooks()
        } catch (e) { }
    }

    const fetchBooks = useCallback(async () => {
        try {
            const data = await request(`/api/book/books/${userId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setBooks(data)
        } catch (e) { }
    }, [userId, token, request])

    useEffect(() => {
        message(error)
        fetchBooks()
    }, [fetchBooks, error, message, clearError])

    if (loading) {
        return <Loader />
    }

    if (!books.length) {
        render = <div className="input-label yellow">No books</div>
    } else {
        render = <>
            <ul className="books-list">
                {books.map(book => (
                    <li id={book._id} data-owner={book.owner._id} key={book._id} onClick={selectHandler} className="list-item-class"><Book book={book} /></li>
                ))}
            </ul>
            <div className="row">
                <button className="btn" disabled={loading} onClick={newRequestHandler}>New request</button>
            </div>
        </>
    }

    return (
        <div className="app">
            <div className="header">Add book</div>
            <form className="form">
                <label className="input-label" htmlFor="title">Titile</label>
                <input className="input" type="text" name="title" value={form.title} onChange={changeHandler} placeholder="Book titile" />
                <label className="input-label" htmlFor="subtitle">Description</label>
                <input className="input" type="text" name="subtitle" value={form.subtitle} onChange={changeHandler} placeholder="Author, condition..." />
                <div className="row">
                    <button className="btn" disabled={loading} onClick={addHandler}>Add</button>
                </div>
            </form>
            <div className="header">Your books</div>
            {render}
        </div>
    )
}