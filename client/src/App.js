import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useAuth } from './hooks/auth.hook'
import { Navbar } from './components/Navbar'
import { useRoutes } from './routes'
import { AuthContext } from './context/AuthContext'
import './App.css'
import 'materialize-css'

function App() {
  const { token, login, logout, userId, name } = useAuth()
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated)

  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, name, isAuthenticated
    }}>
      <Router>
        <Navbar />
        <div className="container">
          {routes}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
