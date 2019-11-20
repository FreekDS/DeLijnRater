import React from 'react'
import {AuthContext} from '../auth/authentication'
import {Route, Redirect} from 'react-router-dom'
import * as routes from './routes'

export const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={(props) => (
        <AuthContext.Consumer>
            {auth => auth.user
                ? <Component {...props} authenticated_user={auth.user} />
                : <Redirect to={routes.FrontPage} />
            }
        </AuthContext.Consumer>
    )} />
);