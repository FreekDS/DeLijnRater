import React from 'react';
import withAuthentication from "./auth/authentication";
import * as routes from './routing/routes'
import {Navigation} from './Navigation'
import StopList from "./StopList";

class App extends React.Component {

    render() {
        console.log(routes.login);
        return (
            <div className="App">
                <Navigation/>
                <StopList />
            </div>
        );
    }

}

export default withAuthentication(App);
