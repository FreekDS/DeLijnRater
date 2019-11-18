import React from "react";
import {AuthContext} from "./auth/authentication";
import withAuthentication from "./auth/authentication";
import {Redirect} from "react-router-dom";
import * as routes from './routing/routes'

const LoginScreen = (props) => <React.Fragment>
    Login screen eeuj
</React.Fragment>;


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            new_user: null
        };

        this.login_user = this.login_user.bind(this);
    }

    login_user(event) {
        console.log("Testje");
    }

    render() {
        const {new_user} = this.state;
        return (
            <AuthContext.Consumer>
                {auth => auth.user
                    ? <Redirect to={routes.FrontPage}/>
                    : (new_user
                        ? auth.perform_login(new_user) && <Redirect to={routes.FrontPage}/>
                        : <LoginScreen login={this.login_user}/>)}
            </AuthContext.Consumer>
        );
    }
}

export default withAuthentication(Login);