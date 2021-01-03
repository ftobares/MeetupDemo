import React, { useState } from "react";
import { useHistory } from "react-router-dom";

// Styles & Images
import './Home.css';

// Material Components
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

// Custom Components
import HeaderBar from '../../components/headerBar/HeaderBar';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,   
      minWidth: 275      
    },
    container: {
        margin: 'auto',
        marginTop: '0.25rem'
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

function PrivateHome() {
    const classes = useStyles();
    let history = useHistory();
    
    const [yourEvents, setYourEvents] = useState([
        {
            title: 'Encuentro Blockchain',
            date: '10/12/2020',
            hashtag: '#BLOCKCHAIN #BITCOIN #ETHERUM',
            description: 'Introducción a blockchain'
        },
        {
            title: 'Java Meetup',
            date: '11/12/2020',
            hashtag: '#SPRINGBOOT #JAVA',
            description: 'Nuevo encuentro sobre Java, en este caso veremos spring-boot'
        },
        {
            title: 'UX & UX Writing',
            date: '11/12/2020',
            hashtag: '#UX #UI #DESIGN',
            description: 'Nuevamente nos juntamos, estaremos viendo temas de ux writing'
        },
        {
            title: 'The Beatles',
            date: '17/12/2020',
            hashtag: '#BEATLES #MUSIC #ART',
            description: ''
        },
        {
            title: 'Gaming Community',
            date: '20/12/2020',
            hashtag: '#GAMING #STEAM #RPG',
            description: 'Evento Online. Repasaremos la next gen de consolas y las mejores ofertas de summer sale'
        }
    ]);

    return (
        <Container disableGutters={true} maxWidth={false}>
            <HeaderBar />
            <div className={classes.root}>
                <Grid container>
                    <Grid item xs={12}>
                        <div className="banner-background">
                            <div class="banner-text">
                                <h1>Tus próximos meetups</h1>                            
                            </div>
                        </div>
                    </Grid>                
                    <Grid item xs={4} justify="center" className={classes.container}>
                        {
                            yourEvents && yourEvents.map((event) => {
                                return(
                                    <Grid item xs={12}>
                                        <Card>
                                            <CardContent>
                                                <Typography className={classes.date} color="textSecondary" gutterBottom>
                                                    {event.date}
                                                </Typography>
                                                <Typography variant="h5" component="h2">
                                                    {event.title}
                                                </Typography>
                                                <Typography className={classes.pos} color="textSecondary">
                                                    <span style={{cursor: 'pointer'}}>{event.hashtag}</span>
                                                </Typography>
                                                <Typography variant="body2" component="p">
                                                    {event.description}                                              
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <hr />
                                                <Button size="small">{'Ver más >>>'}</Button>
                                            </CardActions>
                                        </Card>
                                    </Grid> 
                                );
                            })
                        }                    
                    </Grid>                    
                </Grid>
            </div>
        </Container>
    );
}

export default PrivateHome;
