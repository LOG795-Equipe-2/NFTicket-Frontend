import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "../Navigation/Navigation";


export default function WithNavbar() {
    return (
        <React.Fragment>
            <Navigation />
            <Outlet />
        </React.Fragment>
    )
}