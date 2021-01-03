import React, { createContext, useReducer, useContext } from "react";

const currentUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : {};

const userEmail = localStorage.getItem("email")
  ? JSON.parse(localStorage.getItem("email"))
  : '';

const userToken = localStorage.getItem("userToken")
  ? JSON.parse(localStorage.getItem("userToken"))
  : '';

const INITIAL_STATE = {    
    user: currentUser,
    email: userEmail,
    userToken: userToken,
    loggedIn: currentUser && currentUser.enabled ? currentUser.enabled : false,
    loggedOut: false
};

const reducer = (state, action) => { 
    switch (action.type) {
        case "login": {
            debugger

            const email = action.payload.email;
            const user = action.payload.user;
            user.enabled = true;            

            localStorage.setItem("email", JSON.stringify(email));
            localStorage.setItem("user", JSON.stringify(user));            
            
            return {
              ...state,
              loggedIn: true,
              email: email,
              user: user
            };
        }
        case "setToken": {
      
            const { token } = action.payload;            
      
            localStorage.setItem("userToken", JSON.stringify(token));
      
            return {
              ...state,
              userToken: token
            };
        }      
        case "logout":
          localStorage.clear();
      
          return {
            ...state,            
            user: null,
            loggedIn: false,
            loggedOut: true
        }
        case "setLogout":
          localStorage.clear();

          return {
            ...state,
            loggedOut: false
        }
        default:
            throw new Error(`Invalid action type: ${action.type}`);
    }
}

export const AuthDataContext = createContext({
    user: 0,
    loggedIn: false,
    loggedOut: false,    
    login: () => null,
    logout: () => null,
});
  
const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

    console.log(state);
  
    const currentValue = {
      state,      
      user: state.user,
      email: state.email,
      userToken: state.userToken,
      loggedIn: state.loggedIn,
      loggedOut: state.loggedOut, 
  
      setToken: (data) => {
        dispatch({
          type: "setToken",
          payload: data,
        });
      },
  
      login: (data) =>
        dispatch({
          type: "login",
          payload: data,
        }), 
  
      logout: () => dispatch({ type: "logout" }),
  
      setLogout: (data) =>
        dispatch({
          type: "setLogout",
          payload: data,
        }),  

    };
  
    React.useEffect(() => {
     
        setInterval(function () {
  
          // check inactivity
          let currentTimeStamp = new Date();
          let lastHTTPRequest = localStorage.getItem("lastHTTPRequest"); //timestamp
          if (lastHTTPRequest){
          const maxCalculated = new Date(
            new Date(lastHTTPRequest).getTime() + process.env.REACT_APP_MAX_INACTIVITY * 60000
          );

          console.log(process.env.REACT_APP_MAX_INACTIVITY);
  
          console.log("currentTimeStap", currentTimeStamp);
          console.log("lastHTTPRequest", lastHTTPRequest);
          console.log("Max calculated: ", maxCalculated);
         
          if (maxCalculated.getTime() < currentTimeStamp.getTime()) {
            
            console.log("logout due inactivity");
            dispatch({ type: "logout" });
            clearInterval();
            window.location.reload();
          }
        }
        }, (process.env.REACT_APP_MAX_INACTIVITY * 60000));

    }, []);
  
    return (
      <AuthDataContext.Provider value={currentValue}>
        {children}
      </AuthDataContext.Provider>
    );
  };
  
  export const UseAuthDataContext = () => useContext(AuthDataContext);
  export default AuthProvider;