import React from "react";
import Button from '@material-ui/core/Button';

const LogoutButton = () => {
    return (
        <Button variant="contained" color="primary" onClick={() => console.log()}>
            Iniciar Sesión
        </Button>
    );
};

export default LogoutButton;