import React from 'react'
import {NavLink} from "react-router-dom";

export const Navigation = ({auth}) => (
    <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand" href="#">
            <img src="/docs/4.3/assets/brand/bootstrap-solid.svg" width="30" height="30"
                 className="d-inline-block align-top" alt="" />
                Bootstrap
        </a>
    </nav>
);