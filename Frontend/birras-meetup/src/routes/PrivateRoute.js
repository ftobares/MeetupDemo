import React from "react";
import { Route, Redirect } from "react-router-dom";
import { UseAuthDataContext } from "../context/AuthProvider";

export const PrivateRoute = ({ component: Component, ...rest }) => {
    const { loggedIn, loggedOut } = UseAuthDataContext();

    return (
        <Route
            {...rest}
            render={(props) =>
                loggedOut ? (
                    <Redirect
                        to={{ pathname: "/login", state: { from: props.location } }}
                    />
                ) : loggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{ pathname: "/login", state: { from: props.location } }}
                    />
                    )
            }
        />
    );
};