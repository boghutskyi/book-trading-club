import React, { useContext, useEffect, useState, useCallback } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import {RequestComponent} from '../components/RequestComponent'

export const RequestNewPage = () => {
    
    const { token } = useContext(AuthContext)
    const { request } = useHttp()
    const [requests, setRequests] = useState([])


    const fetchGiveList = useCallback(async () => {
        try {
            const data = await request('/api/request/new', 'POST', { ...JSON.parse(localStorage.getItem('toGiveObj')) }, {
                Authorization: `Bearer ${token}`
            })
            setRequests(data)
        } catch (e) { }
    }, [request, token])

    useEffect(() => {
        fetchGiveList()
    }, [fetchGiveList])


    return (
        <div className="app">
            <div className="header">New request</div>
            <ul className="request-list">{requests.map(item => {
                return (
                    <li id={item._id} key={item._id}><RequestComponent item={item} /></li>
                )
            })}</ul>
        </div>
    )
}