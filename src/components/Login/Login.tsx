import { Button } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import AuthService, { OauthProvider } from "../../utils/AuthService";

function Login() {

    const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);

    React.useEffect(() => {
        setTimeout(() => {
            setIsLoggedIn(AuthService.isLoggedIn());
            console.log(AuthService.session)
        }, 1000)
    }, [])
    
    
    return (
      <div>
          <br />
          <br />
          <br />
          <br />
          <br />

        <button onClick={(e) => AuthService.loginWithOauth(OauthProvider.DISCORD)}>login</button>
        <button onClick={(e) => AuthService.logout()}>logout</button>
        {isLoggedIn ? <div>is logged in </div> : <div>is logged out</div>}
        <NavLink to="/create">
            <Button color="success" variant="contained">
              Créer votre événement
            </Button>
          </NavLink>
      </div>
    );
}
  
export default Login;