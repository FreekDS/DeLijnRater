import React from "react";
import {AuthContext} from "./auth/authentication";
import withAuthentication from "./auth/authentication";
import {Redirect} from "react-router-dom";
import * as routes from './routing/routes'
import axios from 'axios';

// TODO login form
const LoginScreen = (props) => {
    return (
        <form onSubmit={props.login} method={"post"}>
            <label htmlFor={"username"}>Username</label>
            <input id="username" name="username" type={"username"}/>
            <label htmlFor={"password"}>Password</label>
            <input id="password" name="password" type={"password"}/>
            <input type={"submit"}/>
        </form>
    );
};


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            new_user: null
        };

        this.handle_login = this.handle_login.bind(this);
    }

    handle_login(event) {
        event.preventDefault();
        console.log("Testje", event);
        const username = event.target.username.value;
        const password = event.target.password.value;
        let base = process.env.REACT_APP_API_URL;
        axios.post(base + "/users/login", {username: username, password: password}).then(
            (res) => {
                const new_user = res.data;
                this.setState({new_user})
            }
        ).catch(err => console.error({err}))
    }

    render() {
        const {new_user} = this.state;
        return (
            <AuthContext.Consumer>
                {auth => auth.user
                    ? <Redirect to={routes.FrontPage}/>
                    : (new_user
                        ? auth.perform_login(new_user) && <Redirect to={routes.FrontPage}/>
                        : <LoginScreen login={this.handle_login}/>)}
            </AuthContext.Consumer>
        );
    }
}

export default withAuthentication(Login);