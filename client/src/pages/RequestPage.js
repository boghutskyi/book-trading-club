import React, { useCallback, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { RequestComponent } from '../components/RequestComponent'
import { useMessage } from '../hooks/message.hook'
import { Loader } from '../components/Loader'
import { useParams } from 'react-router-dom'

export const RequestPage = () => {

    const [book, setBook] = useState([])
    const { request, loading } = useHttp()
    const message = useMessage()
    const bookId = useParams().id

    const fetchData = useCallback(async () => {
        try {
            const data = await request(`/api/book/books/req/${bookId}`, 'GET', null)
            message(data.message)
            setBook(data)
        } catch (e) { }
    }, [request, bookId, message])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    if (loading) {
        return <Loader />
    }

    return (
        <div className="app">
            <div className="header">Your trades</div>
            {book.requests ? <ul className="request-list">{book.requests.map(item => {
                return (
                    <li id={item._id} key={item._id}><RequestComponent item={item} /></li>
                )
            })}</ul> : ''}
            
        </div>
    )
}

