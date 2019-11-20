import React from 'react'
import axios from "axios";

export const AuthContext = React.createContext(null);

const withAuthentication = (Component) => {
    return class auth extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                authenticated_user: null
            };

            this.perform_login = this.perform_login.bind(this);
            this.perform_logout = this.perform_logout.bind(this);
            this.perform_register = this.perform_register.bind(this);
        }

        componentDidMount() {

            // Reset local storage after one hour
            // let hours = 1;
            // let start_time = parseInt(localStorage.getItem('start_time'), 10);
            // if(start_time && (new Date().getTime() - start_time > hours * 60 *60 *1000))
            //     localStorage.clear();
            // if(!start_time)
            //     localStorage.setItem('start_time', new Date().getTime().toString(10));
            //
            // // localStorage.clear();
            //
            // const stored_user = JSON.parse(localStorage.getItem('user'));
            // if(stored_user) {
            //     this.setState({authenticated_user: stored_user});
            // }
        }

        /**
         * Performs the Login using the restful API.
         * @param event {event}
         * @param toggle_loading {function}
         */
        perform_login(event, toggle_loading) {
            event.preventDefault();
            toggle_loading(true);
            const username = event.target.username.value;
            const password = event.target.password.value;
            let base = process.env.REACT_APP_API_URL;
            axios.post(base + "/users/login", {username: username, password: password}).then(
                async (res) => {
                    const new_user = res.data;
                    await this.setState({authenticated_user: new_user.user});
                    localStorage.setItem('user', JSON.stringify(new_user));
                    toggle_loading(false);
                }
            ).catch(err => {
                console.error({err});
                toggle_loading(false, {"message": "Cannot perform login"});
            });
        }

        perform_logout() {
            const {authenticated_user} = this.state;
            console.assert(authenticated_user !== undefined && authenticated_user !== null);
            this.setState({authenticated_user: null});
            localStorage.removeItem('user');
        }

        /**
         * Performs the register function with the restful API
         * @param event {event}
         * @param toggle_loading {function}
         */
        perform_register(event, toggle_loading) {

        }

        render() {

            const auth = {
                user: this.state.authenticated_user,
                login_function: this.perform_login,
                logout_function: this.perform_logout,
                register_function: this.perform_register
            };

            console.log(auth.user);

            return (<AuthContext.Provider value={auth}>
                <Component />
            </AuthContext.Provider>);
        }
    }
};

export default withAuthentication;