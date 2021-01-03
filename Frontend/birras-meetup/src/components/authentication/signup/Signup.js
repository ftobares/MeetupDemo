import React, { useState, useContext, useEffect } from "react";
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
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

// Resources
import logo from '../../../img/meetupLogo.png';
import './Signup.css';

// Hook context
import { AuthDataContext } from '../../../context/AuthProvider';

// Backend services
import { getCountries, getStates, getCities } from '../../../services/geolocations';
import { signupUser, authLogin, getUserData } from '../../../services/user';

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
    select: {
        width: '100%',
        display: 'flex'
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
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');    
    const [countrySelected, setCountrySelected] = useState();
    const [stateSelected, setStateSelected] = useState();
    const [citySelected, setCitySelected] = useState();

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    let history = useHistory();    

    useEffect(() => {
        getCountries(
            (response) => {
                setCountries(response);
            }, 
            (error) => {
                console.error(error);
                setShowError(true);
            });
    },[]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSubmitedForm(true);

        debugger

        await signupUser(
            document.forms[0][0].value, 
            document.forms[0][2].value,
            name,
            surname,
            countrySelected,
            citySelected,
            async (resp) => {
               
                await authLogin(document.forms[0][0].value, document.forms[0][2].value,
                    async (response) => {
                        setToken({ token: response });
                        
                        let userResponse = await getUserData(document.forms[0][0].value);
                        if(userResponse && userResponse.status === 200){                            
                            login({
                                email: document.forms[0][0].value,
                                user: userResponse.data
                            });                   
                        }else{
                            setShowError(true);
                        }                        
                    },
                    (error) => {
                        console.error(error);
                        setShowError(true);
                    });
            }, 
            (error) => {
                console.error(error);
                setShowError(true);
            });

        setSubmitedForm(false);
    }

    const handleCountrySelected = async (event) => {
        setCountrySelected(event.target.value);
        let response = await getStates(event.target.value);
        if(response && response.status === 200){
            setStates(response.data);
        }
    }

    const handleStateSelected = async (event) => {
        setStateSelected(event.target.value);
        let response = await getCities(event.target.value);
        if(response && response.status === 200){
            setCities(response.data);
        }
    }

    const handleCitySelected = (event) => {
        setCitySelected(event.target.value);
    }

    const changeEmail = (event) => {
        setEmail(event.target.value);
    }
    
    const changeName = (event) => {
        setName(event.target.value);
    }

    const changeSurname = (event) => {
        setSurname(event.target.value);
    }

    const handleReturn = () => {
        history.push('/login');
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
                        Registrarse
      	            </Typography>
                    <form className={classes.form} name='loginForm' noValidate onSubmit={handleSubmit}>
                        <TextField
                            onChange={changeName}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Nombre"
                            name="nombre"
                            autoComplete="nombre"
                            autoFocus
                            id='nombre'
                            disabled={submitedForm}
                            value={name}
                        />
                        <TextField
                            onChange={changeSurname}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Apellido"
                            name="apellido"
                            autoComplete="apellido"
                            autoFocus
                            id='apellido'
                            disabled={submitedForm}
                            value={surname}
                        />
                        <InputLabel id="country-label" style={{ marginTop: '0.75rem' }}>Pais</InputLabel>
                        <Select
                            variant="outlined"
                            labelId="country-label"
                            id="country-select"
                            value={countrySelected}
                            onChange={handleCountrySelected}
                            label="Pais"
                            className={classes.select}
                            >
                                {
                                    countries && countries.map((country) => {
                                        return(
                                            <MenuItem value={country.country_id}>{country.name}</MenuItem >
                                        );
                                    })
                                }
                        </Select>
                        <InputLabel id="state-label" style={{ marginTop: '0.75rem' }}>Provincia</InputLabel>
                        <Select
                            variant="outlined"
                            labelId="state-label"
                            id="state-select"
                            value={stateSelected}
                            onChange={handleStateSelected}
                            label="Provincia"
                            className={classes.select}
                            >
                                {
                                    states && states.map((state) => {
                                        return(
                                            <MenuItem value={state.state_id}>{state.name}</MenuItem >
                                        );
                                    })
                                }
                        </Select>
                        <InputLabel id="city-label" style={{ marginTop: '0.75rem' }}>Ciudad</InputLabel>
                        <Select
                            variant="outlined"
                            labelId="city-label"
                            id="city-select"
                            value={citySelected}
                            onChange={handleCitySelected}
                            label="Ciudad"
                            className={classes.select}
                            >
                                {
                                    cities && cities.map((city) => {
                                        return(
                                            <MenuItem value={city.city_id}>{city.name}</MenuItem >
                                        );
                                    })
                                }
                        </Select>
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
                            Crear cuenta
        	            </Button>                        
                        <hr />
                        <Button                            
                            fullWidth
                            variant="outlined"
                            color="primary"                            
                            className={classes.submit}
                            size="large"
                            onClick={handleReturn}
                        >
                            Volver
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