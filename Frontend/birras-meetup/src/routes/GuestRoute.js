import React from "react";
import { Route, Redirect } from "react-router-dom";
import { UseAuthDataContext } from "../context/AuthProvider";

export const GuestRoute = ({ component: Component, ...rest }) => {
    const { loggedIn } = UseAuthDataContext();    

    return (
        <Route
            {...rest}
            render={(props) =>
                !loggedIn ? (
                    <Component {...props} />
                ) : (
                        <Redirect
                            to={{ pathname: "/welcome" }}
                        />
                    )
            }
        />
    );
};
