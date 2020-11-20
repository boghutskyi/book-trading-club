import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Book } from '../components/Book'
import { Loader } from '../components/Loader'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'

export const ProfilePage = () => {
    const { token, userId } = useContext(AuthContext)
    const { request, error, loading } = useHttp()
    const [user, setUser] = useState([])
    const [books, setBooks] = useState([])

    const reqUserId = useParams().id
    const message = useMessage()
    let render

    const getUser = useCallback(async () => {
        try {
            const data = await request(`/api/users/${reqUserId}`, 'GET')
            setUser(data)
        } catch (e) { }
    }, [reqUserId, request])

    const fetchBooks = useCallback(async () => {
        try {
            const data = await request(`/api/book/books/${reqUserId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setBooks(data)
        } catch (e) { }
    }, [token, request, reqUserId])

    const saveHandler = async (event) => {
        event.preventDefault()
        try {
            const data = await request('/api/users/save', 'POST', { ...user }, {
                Authorization: `Bearer ${token}`
            })
            message(data.message)
        } catch (e) { }
    }
   /*const selectHandler = (event) => {
        setTo({from: userId, to: event.currentTarget.getAttribute('data-owner') })

        event.currentTarget.querySelector('.item-selector').classList.toggle('select')
        if (list.take.includes(event.currentTarget.id)) {
            list.take.splice(list.take.indexOf(event.currentTarget.id), 1)
        } else {
            setList({ take: [...list.take, event.currentTarget.id] })
        }

        event.currentTarget.querySelector('.material-icons-round').innerHTML === 'check_box_outline_blank' ? event.currentTarget.querySelector('.material-icons-round').innerHTML = 'check_box' : event.currentTarget.querySelector('.material-icons-round').innerHTML = 'check_box_outline_blank'
    }

    const newRequestHandler = () => {

        if (!list.take.length) {
            return message('Can not create request')
        }
        localStorage.setItem('toTakeObj', JSON.stringify({
            ...to, ...list
        }))
        localStorage.removeItem('toGiveObj')
        history.push('/request/new')
    }*/

    useEffect(() => {
        getUser()
        fetchBooks()

        message(error)
    }, [message, getUser, fetchBooks, error])


    const changeHandler = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value })
    }

    if (loading) {
        return <Loader />
    }

    if (!books.length) {
        render = <div className="input-label yellow">No books</div>
    } else {
        render = <>
            <ul className="books-list">
                {books.map(book => (
                    <li id={book._id} data-owner={book.owner._id} key={book._id} className="list-item-class"><Book book={book} /></li>
                ))}
            </ul>
        </>
    }

    if (reqUserId === userId) {
        return (
            <div className="app">
                <div className="header">{user.email}</div>
                <form className="form">
                    <label className="input-label" htmlFor="name">Name</label>
                    <input className="input" type="text" name="name" value={user.name} onChange={changeHandler} placeholder="Your name" />
                    <label className="input-label" htmlFor="subtitle">City</label>
                    <input className="input" type="text" name="city" value={user.city} onChange={changeHandler} placeholder="Your city" />
                    <label className="input-label" htmlFor="subtitle">State</label>
                    <input className="input" type="text" name="state" value={user.state} onChange={changeHandler} placeholder="Your state" />
                    <div className="row">
                        <button className="btn" disabled={loading} onClick={saveHandler}>Save</button>
                    </div>
                    <div className="header">{user.name}'s books</div>
                    {render}
                </form>
            </div>
        )
    } else {
        return (
            <div className="app">
                <div className="header">{user.name}</div>
                <div className="row">
                    <label className="input-label">Name</label>
                    <div className="text-field">{user.name || <span className="text-faded">No information</span>}</div>
                    <label className="input-label" htmlFor="subtitle">City</label>
                    <div className="text-field">{user.city || <span className="text-faded">No information</span>}</div>
                    <label className="input-label" htmlFor="subtitle">State</label>
                    <div className="text-field">{user.state || <span className="text-faded">No information</span>}</div>
                </div>
                <div className="header">{user.name}'s books</div>
                {render}
            </div>
        )
    }
}