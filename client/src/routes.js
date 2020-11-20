import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { BooksPage } from './pages/BooksPage'
import { MyBooksPage } from './pages/MyBooksPage'
import { AuthPage } from './pages/AuthPage'
import { RequestsPage } from './pages/RequsetsPage'
import { RequestPage } from './pages/RequestPage'
import { UsersPage } from './pages/UsersPage'
import { ProfilePage } from './pages/ProfilePage'
import { RequestNewPage } from './pages/RequestNewPage'
import { BookNewRequestPage } from './pages/BookNewRequestPage'
import { RegisterPage } from './pages/RegisterPage'
import { TradesPage } from './pages/TradesPage'

export const useRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route exact path="/books">
                    <BooksPage />
                </Route>
                <Route exact path="/users">
                    <UsersPage />
                </Route>
                <Route exact path="/users/:id">
                    <ProfilePage />
                </Route>
                <Route exact path="/requests">
                    <RequestsPage />
                </Route>
                <Route exact path="/request/:id">
                    <RequestPage />
                </Route>
                <Route exact path="/trades">
                    <TradesPage />
                </Route>
                <Route exact path="/books/my">
                    <MyBooksPage />
                </Route>
                <Route exact path="/books/newrequest/:requestId" >
                    <BookNewRequestPage />
                </Route>
                <Route exact path="/request/new">
                    <RequestNewPage />
                </Route>
                <Redirect to="/books" />
            </Switch>
        )
    }
    return (
        <Switch>
            <Route exact path="/books">
                <BooksPage />
            </Route>
            <Route exact path="/users">
                <UsersPage />
            </Route>
            <Route exact path="/users/:id">
                <ProfilePage />
            </Route>
            <Route exact path="/requests">
                <RequestsPage />
            </Route>
            <Route exact path="/request/:id">
                <RequestPage />
            </Route>
            <Route exact path="/" >
                <AuthPage />
            </Route>
            <Route exact path="/register">
                <RegisterPage />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}