import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { RequestComponent } from '../components/RequestComponent'
import { useMessage } from '../hooks/message.hook'
import { Loader } from '../components/Loader'
import { AuthContext } from '../context/AuthContext'

export const TradesPage = () => {
    
    const {token, userId} = useContext(AuthContext)
    const [requests, setRequests] = useState([])
    const { request, loading } = useHttp()
    const message = useMessage()
    let render;

    const fetchData = useCallback(async () => {
        try {
            const data = await request(`/api/request/trades/${userId}`, 'GET', null,  {
                Authorization: `Bearer ${token}`
            })
            message(data.message)
            setRequests(data)
        } catch (e) { }
    }, [request, message, token, userId])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    if (loading) {
        return <Loader />
    }

    if (!requests.length) {
        render = <div className="input-label yellow">No trades</div>
    } else {
        render = <ul className="request-list">{requests.map(item => {
            return (
                <li id={item._id} key={item._id}><RequestComponent item={item} /></li>
            )
        })}</ul>
    }
    return (
        <div className="app">
            <div className="header">Your trades</div>
            {render}
        </div>
    )
}

