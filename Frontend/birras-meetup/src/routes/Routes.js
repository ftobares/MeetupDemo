import React from "react";
import {
    BrowserRouter,    
    Switch
} from "react-router-dom";

// Componentes Material

// Custom Routers
import { PrivateRoute } from './PrivateRoute';
import { GuestRoute } from './GuestRoute';

// Components
import Home from '../pages/home/Home';
import PrivateHome from '../pages/home/PrivateHome';
import Profile from '../pages/profile/Profile';
import Meetup from '../pages/meetup/Meetup';
import Login from '../components/authentication/login/Login';
import Signup from '../components/authentication/signup/Signup'

const Routes = () => {    

    return (
        <BrowserRouter basename={"/"}>            
            <Switch>

                <GuestRoute path="/" exact title="Home" component={Home} />
                <GuestRoute path="/login" exact title="Login" component={Login} />
                <GuestRoute path="/signup" exact title="Signup" component={Signup} />

                <PrivateRoute path="/welcome" component={PrivateHome} />
                <PrivateRoute path="/profile" component={Profile} />
                <PrivateRoute path="/meetups" component={Meetup} />
                <PrivateRoute path="/create-meetup" component={Meetup} />

            </Switch>
        </BrowserRouter>
    );
};

export default Routes;
