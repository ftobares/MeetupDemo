import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

// Material Components
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// Custom Components
import HeaderBar from '../../components/headerBar/HeaderBar';
import MeetupList from '../../components/meetupCrud/MeetupList';

// Backend services
import { getMeetups, getMeetupByOwner, getMeetupsRegistered } from '../../services/meetup';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,   
      minWidth: 275          
    },
    container: {
        margin: 'auto',
        marginTop: '0.25rem',
        textAlign: 'center'
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    date: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  }));

function Meetup() {
    let history = useHistory();
    const classes = useStyles();
    const [view, setView] = useState();
    const user = JSON.parse(localStorage.getItem("user"));

    const [meetupsAvailable, setMeetupsAvailable] = useState([]);
    const [meetupsCreated, setMeetupsCreated] = useState([]);
    const [meetupsRegisterd, setMeetupsRegisterd] = useState([]);

    useEffect(() => {
        getMeetupsAvailable();
        getMeetupsCreated();
        getMeetupsThatUserIsRegisterd();
    }, []);

    const getMeetupsAvailable = async () => {
        let response = await getMeetups();
        if(response && response.status === 200){
            setMeetupsAvailable(response.data.filter((e) => e.owner != user.id))
        }
    }

    const getMeetupsCreated = async () => {        
        let response = await getMeetupByOwner(user.id);
        if(response && response.status === 200){
            setMeetupsCreated(response.data)
        }
    } 

    const getMeetupsThatUserIsRegisterd = async () => {        
        let response = await getMeetupsRegistered(user.email);
        if(response && response.status === 200){
            setMeetupsRegisterd(response.data)
        }
    }

    return (
        <Container disableGutters={true} maxWidth={false}>
            <HeaderBar />
            <div className={classes.root}>
                <Grid container style={{ marginTop: '0.75em'}}>                                        
                    <Grid item xs={12} className={classes.container} spacing={1}>
                        <Typography variant="h5" component="h2">
                            Meetups disponibles
                        </Typography>
                        <MeetupList data={meetupsAvailable} meetupsRegisterd={meetupsRegisterd} type={'disponibles'}/>
                    </Grid>
                    <hr />
                    <Grid item xs={12} className={classes.container}>                        
                        <Typography variant="h5" component="h2">
                            Tus meetups creadas
                        </Typography>
                        <MeetupList data={meetupsCreated} type={'creadas'}/>
                    </Grid>                    
                </Grid>
          </div>
      </Container>
    );
}

export default Meetup;