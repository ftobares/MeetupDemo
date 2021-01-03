import React, { useState } from "react";
import { useHistory } from "react-router-dom";

// Styles & Images
import './Home.css';

// Material Components
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// Custom Components
import HeaderBar from '../../components/headerBar/HeaderBar';
import CategoriesGroup from '../../components/categories/categoriesGroup/CategoriesGroup';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    categoryRoot: {
      maxWidth: 345,
      margin: '0.25rem'
    },
    paper: {
      padding: theme.spacing(1),
      minHeight: '100px',
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    actions: {
        marginTop: theme.spacing(2)
    },
    media: {
      height: 250,   
      margin: 'auto'
    },
  }));

function Home() {
    const classes = useStyles();
    let history = useHistory();

    function MainActions() { 

        return (
            <React.Fragment>
                <Grid item xs={4}>
                    <Paper className={classes.paper}>
                        <p style={{ marginBottom: '20px' }}>¡Mira los proximos eventos!</p>
                        <Button variant="contained" color="primary" onClick={() => history.push('/meetups')}>
                            Meetups
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper className={classes.paper}>
                        <p style={{ marginBottom: '20px' }}>¡Mira los eventos que te anotaste!</p>
                        <Button variant="contained" color="primary" onClick={() => console.log('hola')}>
                            Iniciar Sesión
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper className={classes.paper}>
                        <p style={{ marginBottom: '20px' }}>¿Queres crear tu propio evento?</p>
                        <Button variant="contained" color="primary" onClick={() => history.push('/meetups')}>
                            Crear meetup
                        </Button>
                    </Paper>
                </Grid>
            </React.Fragment>
        );
    }

    return (
        <Container disableGutters={true} maxWidth={false}>
            <HeaderBar />
            <div className={classes.root}>
                <Grid container spacing={1} justify="center">
                    <Grid item xs={12}>
                        <div className="banner-image">
                            <div class="banner-text">
                                <h1>Todas las Meetups...</h1>
                                <p>al alcance de tu mano</p>
                            </div>
                        </div>
                    </Grid>
                    <hr />
                    <Grid container item xs={12} spacing={2} className={classes.actions}>
                        <MainActions />
                    </Grid>
                    <hr />
                    <Grid container item xs={12} spacing={2} className={classes.actions}>
                        <CategoriesGroup />
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
}

export default Home;
