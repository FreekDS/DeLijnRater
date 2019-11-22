import React from 'react';
import withAuthentication from "./auth/authentication";
import * as routes from './routing/routes'
import {Navigation} from './Navigation'
import StopList from "./StopList";
import VehicleList from "./VehicleList";
import Login from "./auth/Login";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {Logout} from "./auth/Logout";
import Register from "./auth/Register";
import Detail from "./Detail";
import {PrivateRoute} from "./routing/PrivateRoute";
import Profile from "./Profile";
import VehicleCreate from "./VehicleCreate";


// TODO if time, error handling
// TODO css
// TODO documentation
// TODO report doing


class App extends React.Component {

    render() {
        return (
            <div className="App">
                <Router>
                    <div>
                        <Navigation/>
                        <div className={"container-fluid"}>
                            <Switch>
                                <Route path={routes.FrontPage} exact={true} render={() => <StopList/>}/>
                                <Route path={routes.Login} exact render={() => <Login/>}/>
                                <Route path={routes.Register} exact render={() => <Register/>}/>
                                <Route path={routes.StopList} exact render={() => <StopList/>}/>
                                <Route path={routes.VehicleList} exact render={() => <VehicleList/>}/>
                                <Route path={routes.Logout} exact render={() => <Logout/>}/>
                                <Route path={routes.VehicleList + "/:type/:id"}
                                       render={({match}) => <Detail match={match} type={"vehicle"}/>}/>
                                <Route path={routes.StopList + "/:id"}
                                       render={({match}) => <Detail match={match} type={"stop"}/>}/>
                                <Route path={routes.CreateVehicle} exact render={() => <VehicleCreate/>} />
                                <PrivateRoute path={routes.Profile} component={Profile}/>
                            </Switch>
                        </div>
                    </div>
                </Router>
            </div>
        );
    }

}

export default withAuthentication(App);
