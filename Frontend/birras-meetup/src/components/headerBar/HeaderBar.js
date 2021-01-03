import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

// Material Dependencies
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import ListIcon from '@material-ui/icons/List';
import MoreIcon from '@material-ui/icons/MoreVert';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

// Resources
import './HeaderBar.css';
import cloudLigth from '../../img/weather-icons/cloudLigth.png';
import cloudRain from '../../img/weather-icons/cloudRain.png';
import cloudSunRain from '../../img/weather-icons/cloudSunRain.png';
import snow from '../../img/weather-icons/snow.png';
import sun from '../../img/weather-icons/sun.png';
import cloudSun from '../../img/weather-icons/cloudSun.png';
import cloud from '../../img/weather-icons/cloud.png';
import heavyCloud from '../../img/weather-icons/heavyCloud.png';
import mist from '../../img/weather-icons/mist.png';

// Hook Context
import { UseAuthDataContext } from "../../context/AuthProvider";

// API
import { getCurrentWeather } from "../../services/weather";
import { getCity } from "../../services/geolocations";

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    appBar: {
        backgroundColor: '#EF3340',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    weather: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: 'transparent',
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    weatherContent: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: 'transparent',
        color: 'white',
        'MuiTypography-colorTextSecondary': {
            color: 'white'
        }
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
}));

export default function HeaderBar() {
    const { loggedIn, logout } = UseAuthDataContext();
    let history = useHistory();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [currentWeather, setCurrentWeather] = useState({
        date: null,
        minTemp: null,
        maxTemp: null,
        weather: null,
        weatherId: null
    });
    const currentUser = (localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : '');
    
    const menuOption = (history.location.pathname === '/welcome' ? 'Ver todas las meetups' : 'Ver mis meetups');

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    useEffect(() => {
        getCity(currentUser.city,
            async (response) => {
                debugger;
                let weather = await getCurrentWeather(response.latitud, response.longuitud);
                if(weather){
                    setCurrentWeather(weather);
                }
            },
            (error) => {
                console.error(error);
            });
    }, []);

    const handleLogin = () => {       
        history.push('/login');
    }

    const handleLogout = () => {
        logout();
    }

    const handleListadoMeetups = () => {
        if(history.location.pathname === '/welcome'){
            history.push('/meetups');
            return;
        }
        history.push('/welcome');
    }

    const handleNotifications = () => {

    }

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const renderWeatherIcon = () => {    
        
        switch(currentWeather.weatherId){
            case 800:
                return <img src={heavyCloud} alt="sun"></img>;
            case 801:
                return <img src={cloudSun} alt="cloudSun"></img>;
            case 802:
                return <img src={cloud} alt="cloud"></img>;
            case 803:
            case 804:
                return <img src={heavyCloud} alt="heavyCloud"></img>;
            case 300:
            case 301:
            case 310:
            case 311:
            case 312:
            case 313:
            case 314:
            case 321:
            case 520:
            case 521:
            case 522:
            case 531:
                return <img src={cloudRain} alt="cloudRain"></img>;
            case 500:
            case 501:
            case 502:
            case 503:
            case 504:
                return <img src={cloudSunRain} alt="cloudSunRain"></img>;
            case 200:
            case 201:
            case 202:
            case 210:
            case 211:
            case 212:
            case 221:
            case 230:
            case 231:
            case 232:
                return <img src={cloudLigth} alt="cloudLigth"></img>;
            case 511:
            case 600:
            case 601:
            case 602:
            case 611:
            case 612:
            case 613:
            case 615:
            case 616:
            case 620:
            case 621:
            case 622:
                return <img src={snow} alt="snow"></img>;
            case 701:
            case 711:
            case 721:
            case 731:
            case 741:
            case 751:
            case 761:
            case 762:
            case 771:
            case 781:
                return <img src={mist} alt="mist"></img>;
            default:
                return <img src={sun} alt="sun"></img>
        }
    }

    const menuId = 'primary-search-account-menu';
    
    const mobileMenuId = 'primary-search-account-menu-mobile';

    const renderDesktopMenu = () => {        
        return(            
                loggedIn
                ?
                    <div className={classes.sectionDesktop}>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleListadoMeetups}
                            color="inherit"
                        >
                            {menuOption}
                        </IconButton>
                        <IconButton 
                            aria-label="show 17 new notifications" 
                            color="inherit" 
                            onClick={handleNotifications}>
                            <Badge badgeContent={17} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleLogout}
                            color="inherit"
                        >
                            Logout
                        </IconButton>
                    </div>
                :   
                    <div className={classes.sectionDesktop}>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleListadoMeetups}
                            color="inherit"
                        >
                            {menuOption}
                        </IconButton>                               
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleLogin}
                            color="inherit"
                        >
                            Login
                        </IconButton>
                    </div>           
        );        
    }
    
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            {
                loggedIn
                ?
                    <React.Fragment>
                        <MenuItem onClick={handleListadoMeetups}>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="primary-search-account-menu"
                                aria-haspopup="true"
                                color="inherit"
                            >
                                <ListIcon />
                            </IconButton>
                            <p>{menuOption}</p>
                        </MenuItem>
                        <MenuItem onClick={handleNotifications}>
                            <IconButton aria-label="show 11 new notifications" color="inherit">
                                <Badge badgeContent={11} color="secondary">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                            <p>Notificaciones</p>
                        </MenuItem>
                        <MenuItem onClick={handleProfileMenuOpen}>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="primary-search-account-menu"
                                aria-haspopup="true"
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <p>Perfil</p>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>                            
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="primary-search-account-menu"
                                aria-haspopup="true"
                                color="inherit"
                            >
                                <PowerSettingsNewIcon />
                            </IconButton>
                            <p>Logout</p>
                        </MenuItem>
                    </React.Fragment>
                :   
                    <MenuItem onClick={handleLogin}>                        
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="primary-search-account-menu"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <LockOpenIcon />
                        </IconButton>
                        <p>Login</p>
                    </MenuItem>
            }
        </Menu>
    );

    console.log(currentWeather)

    return (        
            <div className={classes.grow}>
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar>
                        <Typography className={classes.title} variant="h6" noWrap>
                            Birras Meetup
                        </Typography>
                        <div className={classes.weather}>                            
                            <List className='weatherContent'>
                                <ListItem>
                                    <ListItemAvatar>
                                    <Avatar>
                                        {renderWeatherIcon()}
                                    </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={currentWeather.weather} secondary={currentWeather.maxTemp + ' °C'} />
                                </ListItem>
                            </List>
                        </div>
                        <div className={classes.grow} />
                        
                        {renderDesktopMenu()}
                        
                        <div className={classes.sectionMobile}>
                            <IconButton
                                aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MoreIcon />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                {renderMobileMenu}            
            </div>
    );
}
