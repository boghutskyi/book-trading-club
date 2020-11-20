import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import {Loader} from '../components/Loader'
import { useMessage } from '../hooks/message.hook'
import './AuthPage.css'

export const AuthPage = () => {
    
    const auth = useContext(AuthContext)
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const message = useMessage()
    const { loading, request, error, clearError } = useHttp()

    useEffect(() => {
        message(error);
        clearError()
    }, [error, message, clearError])

    const changeHandler = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const loginHandler = async (event) => {
        event.preventDefault()
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId, data.name)

        } catch (e) { }
    }

    if (loading) {
        return <Loader />
    }

    return (
        <div className="app">
            <div className="header">Login</div>
            <form className="form">
                <label className="input-label" htmlFor="email">Email</label>
                <input className="input" type="email" name="email" value={form.email} onChange={changeHandler} placeholder="example@mail.com" />
                <label className="input-label" htmlFor="subtitle">Password</label>
                <input className="input" type="password" name="password" value={form.password} onChange={changeHandler} placeholder="Password" />
                <div className="row">
                    <button className="btn" disabled={loading} onClick={loginHandler}>Login</button>

                </div>
            </form>
        </div>
    )
}