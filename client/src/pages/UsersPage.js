import React, { useCallback, useEffect, useState } from 'react'
import { NavLink, } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { Loader } from '../components/Loader'
import { useMessage } from '../hooks/message.hook'

export const UsersPage = () => {
    const [users, setUsers] = useState([])
    const { request, error, clearError, loading } = useHttp()
    const message = useMessage()
    let render;
    const fetchData = useCallback(async () => {
        try {
            const data = await request('/api/users', 'GET')
            setUsers(data)
        } catch (e) { }
    }, [request])


    useEffect(() => {
        fetchData()
        message(error)
        clearError()
    }, [error, message, clearError, fetchData])

    if (loading) {
        return <Loader />
    }

    if (!users.length) {
        render = <div className="input-label yellow">No users</div>
    } else {
        render = <div className="table">
        <div className="table-header">
            <div>Name</div>
            <div>Books</div>
            <div>Requsts</div>
        </div>
        <div className="table-body">
            {
                users.map(item => {
                    return (
                        <div className="table-item">
                            <div className="table-item-block"><NavLink to={`/users/${item._id}`}>{item.name}</NavLink></div>
                            <div className="table-item-block yellow">{item.books.length}</div>
                            <div className="table-item-block green">{item.requests.length}</div>
                        </div>
                    )
                })
            }
        </div>
    </div>
    }
    
    return (
        <div className="app">
            <div className="header">Users</div>
            {render}
        </div>
    )

}