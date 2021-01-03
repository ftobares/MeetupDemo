import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

// Material dependencies
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles, makeStyles } from '@material-ui/core/styles';

// Resources
import logo from '../../../img/meetupLogo.png';
import './Login.css';

// Hook context
import { AuthDataContext } from '../../../context/AuthProvider';

// Backend services
import { authLogin, getUserData } from '../../../services/user';

const styles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    header: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        textAlign: 'center',
    },
    footerTypography: {
        fontSize: theme.typography.pxToRem(14),
    },
    paper: {
        padding: theme.spacing(3),
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(12),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    logo: {
        width: '75px',
        height: '75px'
    }
}));

const Login = () => {

    const classes = styles();
    const ERROR_MSG = 'Usuario o contraseña invalidas';    
    const { login, setToken } = useContext(AuthDataContext);
    const [showError, setShowError] = useState(false);
    const [submitedForm, setSubmitedForm] = useState(false);
    const [email, setEmail] = useState(sessionStorage.getItem('email')||'');
    let history = useHistory();    

    const handleSubmit = async (event) => {
        event.preventDefault();
        debugger

        setSubmitedForm(true)
        
        await authLogin(document.forms[0][0].value, document.forms[0][2].value,
            async (response) => {

                setToken({ token: response });

                let userResponse = await getUserData(document.forms[0][0].value);
                if(userResponse && userResponse.status === 200){
                    debugger
                    login({
                        email: document.forms[0][0].value,
                        user: userResponse.data
                    });                   
                }else{
                    setShowError(true);
                }                
                setSubmitedForm(false);
            },
            (error) => {
                console.error(error);
                setShowError(true);
                setSubmitedForm(false);
            }
        );        
    }

    const changeEmail = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordRecovery = () => {
        history.push('/password-recovery');
    }

    const handleSignup = () => {
        history.push('/signup');
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <Container component="header" maxWidth="sm" className={classes.header}>
                <img className={classes.logo} src={logo} alt="Logo IMS" />
                <Typography component="h1" variant="h5" className="login-heading">
                    Bienvenido a Birras Meetup
                </Typography>
            </Container>
            <Container component="main" maxWidth="xs" className="login-main">
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h2" variant="h5">
                        Iniciar Sesión
      	            </Typography>
                    <form className={classes.form} name='loginForm' noValidate onSubmit={handleSubmit}>
                        <TextField
                            onChange={changeEmail}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            id='user'
                            disabled={submitedForm}
                            value={email}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"

                            autoComplete="current-password"
                            id='pass'
                            disabled={submitedForm}
                        />
                        
                        {(showError) ?
                            <Typography component="span" color="error">
                                {ERROR_MSG}
                            </Typography>
                            :
                            ''}
                        {(submitedForm) ?
                            <LinearProgress /> :
                            ''}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="secondary"
                            disabled={submitedForm}
                            className={classes.submit}
                            size="large"
                        >
                            Iniciar Sesión
        	            </Button>
                        <Button                            
                            fullWidth                            
                            className={classes.submit}
                            size="large"
                            onClick={handlePasswordRecovery}
                        >
                            Olvide la contraseña
        	            </Button>
                        <hr />
                        <Button                            
                            fullWidth
                            variant="outlined"
                            color="primary"                            
                            className={classes.submit}
                            size="large"
                            onClick={handleSignup}
                        >
                            Registrarse
        	            </Button>
                    </form>
                </Paper>
            </Container>
            <Container component="footer" maxWidth={false} className="login-footer">
                <Typography component="span" color="textSecondary" className={classes.footerTypography}>
                    &copy; 2020. Todos los derechos reservados
                </Typography>
            </Container>
        </React.Fragment>
    );
}

export default withStyles(styles)(Login);