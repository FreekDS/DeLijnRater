import React from 'react'
import {BrowserRouter as Router, NavLink} from "react-router-dom";

export const Navigation = ({auth}) => (
    <nav className="navbar navbar-dark bg-dark">
        <div className={"row"}>
            <div className={"col"}>
                <a className="navbar-brand" href="#">
                    <img src="https://static.delijn.be/Images/dl-logo_tcm3-1040.svg" width="30" height="30"
                         className="d-inline-block align-top logo" alt=""/>
                    De Lijn Rater
                </a>
            </div>
        </div>
        <div className={"row"}>
            <div className={"col float-left"}>
                <Router>
                    <NavLink className={"nav-normal"} to={"/test"}>Stop ratings</NavLink>
                    <NavLink className={"nav-normal"} to={"/test"}>Vehicle ratings</NavLink>
                    {/*<NavLink className={""} to={"/test"}>Profile</NavLink>*/}
                </Router>
            </div>
            <div className={"col-1 float-right"}>
                <Router>
                    <NavLink className="nav-login nav-item" to={"/login"}>Login</NavLink>
                </Router>
            </div>
        </div>
    </nav>
);