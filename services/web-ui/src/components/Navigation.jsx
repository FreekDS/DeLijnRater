import React from 'react'
import * as routes from './routing/routes'
import {BrowserRouter as Router, NavLink} from "react-router-dom";

export const Navigation = ({auth}) => (
    <nav className="navbar navbar-dark bg-dark">
        <div className={"row"}>
            <div className={"col"}>
                <a className="navbar-brand" href={routes.FrontPage}>
                    <img src="https://static.delijn.be/Images/dl-logo_tcm3-1040.svg" width="30" height="30"
                         className="d-inline-block align-top logo" alt=""/>
                    De Lijn Rater
                </a>
            </div>
        </div>
        <div className={"row"}>
            <div className={"col float-left"}>
                    <NavLink className={"nav-normal"} to={routes.StopList}>Stop ratings</NavLink>
                    <NavLink className={"nav-normal"} to={routes.VehicleList}>Vehicle ratings</NavLink>
                    {/*<NavLink className={""} to={"/test"}>Profile</NavLink>*/}
            </div>
            <div className={"col-1 float-right"}>
                    <NavLink className="nav-login nav-item" to={"/login"}>Login</NavLink>
            </div>
        </div>
    </nav>
);