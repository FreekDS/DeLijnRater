import React, {useEffect} from "react";
import {AuthContext} from "./authentication";
import {Redirect} from 'react-router-dom'
import * as routes from '../routing/routes'


const PerformLogout = props => {
    useEffect(() => {
        props.logout()
    });


    return <Redirect to={routes.FrontPage}/>
};

export const Logout = () => {
    return (
        <div>
            <AuthContext.Consumer>
                {auth => (auth.user
                        ? <PerformLogout logout={auth.logout_function}/>
                        : <Redirect to={routes.Login}/>
                )}
            </AuthContext.Consumer>
        </div>)
};
