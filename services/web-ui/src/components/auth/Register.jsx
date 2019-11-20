import React from "react";
import {AuthContext} from "./authentication";
import {Redirect} from "react-router-dom";
import * as routes from '../routing/routes'
import '../../style/login.css'


const RegisterScreen = (props) => {
    return (
        <div className={"login-container"}>
            <h2 className={"login-title"}>Register</h2>
            <form onSubmit={(event) => props.register(event, props.loading_toggler)} method={"post"}>
                <div>
                    <label htmlFor={"username"}>Username</label>
                    <input className={"login-item"} id="username" name="username" type={"username"}/>
                </div>
                <div>
                    <label htmlFor={"email"}>Email address</label>
                    <input className={"login-item"} id="email" name="email" type={"email"}/>
                </div>
                <div>
                    <label htmlFor={"password"}>Password</label>
                    <input className={"login-item"} id="password" name="password" type={"password"}/>
                </div>
                <div>
                    <input disabled={props.loading} type={"submit"} value={"Register"}/>
                </div>
            </form>
        </div>
    );
};


class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null
        };

        this.set_register_state = this.set_register_state.bind(this);
    }

    set_register_state(loading, error = null) {
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
                        ? <Redirect to={routes.FrontPage}/>
                        : <RegisterScreen register={auth.register_function} loading={loading}
                                       loading_toggler={this.set_register_state}/>
                )}
            </AuthContext.Consumer>
        );
    }
}

export default Register;