import React, { useCallback, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { RequestComponent } from '../components/RequestComponent'
import { Loader } from '../components/Loader'
import './RequsetsPage.css'

export const RequestsPage = () => {


    const [requests, setRequests] = useState([])
    const { request, loading } = useHttp()
    let render;

    const fetchData = useCallback(async () => {
        try {
            const data = await request('/api/request', 'GET')
            setRequests(data)
        } catch (e) { }
    }, [request])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    if (loading) {
        return <Loader />
    }

    if (!requests.length) {
        render = <div className="input-label yellow">No requests</div>
    } else {
        render = <ul className="request-list">{requests.map(item => {
            return (
                <li id={item._id} key={item._id}><RequestComponent item={item} /></li>
            )
        })}</ul>
    }
    return (
        <div className="app">
            <div className="header">Requests</div>
            {render}
        </div>
    )
}

