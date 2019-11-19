import React from 'react';
import withAuthentication from "./auth/authentication";
import * as routes from './routing/routes'
import {Navigation} from './Navigation'
import StopList from "./StopList";
import Login from "./Login";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

class App extends React.Component {

    render() {
        console.log(routes.login);
        return (
            <div className="App">
                <Router>
                    <div>
                        <Navigation/>
                        <div className={"container-fluid"}>
                            <Switch>
                                <Route path={routes.FrontPage} exact={true} render={() => <StopList/>}/>
                                <Route path={routes.login} exact render={() => <Login/>}/>
                                <Route path={routes.Register} exact render={() => <Login />} />
                                <Route path={routes.StopList} exact render={() => <StopList/>} />
                            </Switch>
                        </div>
                    </div>
                </Router>
            </div>
        );
    }

}

export default withAuthentication(App);
