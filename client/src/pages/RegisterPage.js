import React, { useContext, useEffect, useState } from 'react'
import { Loader } from '../components/Loader'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import './AuthPage.css'

export const RegisterPage = () => {

    const auth = useContext(AuthContext)
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const message = useMessage()
    const { loading, request, error, clearError } = useHttp()

    const changeHandler = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    const registerHandler = async (event) => {
        event.preventDefault()
        try {
            const reqData = await request('/api/auth/register', 'POST', {...form})
            const data = await request('/api/auth/login', 'POST', {...form})
            message(reqData.message)
            auth.login(data.token, data.userId, data.name)
        } catch (e) { }
    }

    if (loading) {
        return <Loader />
    }

    return (
        <div className="app">
            <div className="header">Register</div>
            <form className="form">
                <label className="input-label" htmlFor="name">Name</label>
                <input className="input" type="text" name="name" value={form.name} onChange={changeHandler} placeholder="RolandeTheStar" />
                <label className="input-label" htmlFor="email">Email</label>
                <input className="input" type="email" name="email" value={form.email} onChange={changeHandler} placeholder="example@mail.com" />
                <label className="input-label" htmlFor="subtitle">Password</label>
                <input className="input" type="password" name="password" value={form.password} onChange={changeHandler} placeholder="Password" />
                <div className="row">
                    <button className="btn" onClick={registerHandler}>Register</button>
                </div>
            </form>
        </div>
    )
}