import React from 'react'

export const AuthContext = React.createContext(null);

const withAuthentication = (Component) => {
    return class auth extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                authenticated_user: null
            };

            this.perform_login = this.perform_login.bind(this)
        }

        perform_login(new_user) {
            console.log("Logging in", new_user)
        }

        render() {

            const auth = {
                user: this.state.authenticated_user,
                login_function: this.perform_login
            };

            return (<AuthContext.Provider value={auth}>
                <Component />
            </AuthContext.Provider>);
        }

    }
};

export default withAuthentication;