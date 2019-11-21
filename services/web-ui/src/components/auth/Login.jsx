import React from "react";
import {AuthContext} from "./authentication";
import {withRouter} from "react-router-dom";
import * as routes from '../routing/routes'
import '../../style/login.css'

const LoginScreen = (props) => {
    return (
        <div className={"login-container"}>
            <h2 className={"login-title"}>Login</h2>
            <form onSubmit={(event) => props.login(event, props.loading_toggler)} method={"post"}>
                <div>
                    <label htmlFor={"username"}>Username</label>
                    <input className={"login-item"} id="username" name="username" type={"username"}/>
                </div>
                <div>
                    <label htmlFor={"password"}>Password</label>
                    <input className={"login-item"} id="password" name="password" type={"password"}/>
                </div>
                <div>
                    <input disabled={props.loading} type={"submit"} value={"Login"}/>
                </div>
            </form>
            <small className={"register"}>No account? click <button
                onClick={() => props.history.push(routes.Register)}>here</button> to register</small>
        </div>
    );
};


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null
        };

        this.set_login_state = this.set_login_state.bind(this);
    }

    set_login_state(loading, error = null) {
        if (error) {
            this.setState({error: error.message})
        }
        this.setState({loading})
    }


    render() {
        const {loading} = this.state;

        return (
            <AuthContext.Consumer>
                {auth => ((auth.user !== null && !loading)
                        ? <React.Fragment>{this.props.history.goBack()}</React.Fragment>
                        : <LoginScreen login={auth.login_function} loading={loading}
                                       loading_toggler={this.set_login_state} history={this.props.history}/>
                )}
            </AuthContext.Consumer>
        );
    }
}

export default withRouter(Login);