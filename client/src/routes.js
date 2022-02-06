import React from "react"
import { Route, Switch, Redirect } from 'react-router-dom'
import { PageAbout } from "./pages/PageAbout"
import { PageAdd } from './pages/PageAdd'

export const useRoutes = isAunthenticated => {
    if (isAunthenticated) {
        return (
            <Switch>
                <Route path='/' exact>
                    <PageAbout />
                </Route>
                <Route path='/pageadd' exact>
                    <PageAdd />
                </Route>
                <Redirect to="/" />
            </Switch>
        )
    }
}