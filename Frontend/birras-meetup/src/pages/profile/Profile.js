import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import { UseAuthDataContext } from "../../context/AuthProvider";

export default function Profile() {
    const { user } = UseAuthDataContext();
  
    return (      
        <div>          
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
    );
}