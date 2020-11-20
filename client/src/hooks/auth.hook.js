import { useState, useCallback, useEffect } from 'react'

const storageName = 'userData'

export const useAuth = () => {
    const [ready, setReady] = useState(false)
    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const [name, setName] = useState(null)

    const login = useCallback((jwtToken, id, name) => {
        setName(name)
        setToken(jwtToken)
        setUserId(id)

        localStorage.setItem(storageName, JSON.stringify({
            userId: id, token: jwtToken, name: name
        }))
    }, [])

    const logout = useCallback(() => {
        setName(null)
        setToken(null)
        setUserId(null)
        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))

        if (data && data.token) {
            login(data.token, data.userId, data.name)
        }
        setReady(true)
    }, [login])

    return { login, logout, token, userId, name, ready }
}
