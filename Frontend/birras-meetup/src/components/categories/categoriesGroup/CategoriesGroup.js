import React from 'react';

// Styles & Images
import '../Categories.css';
import IT from '../../../img/IT.png';
import Sports from '../../../img/Sports.png';
import Fintech from '../../../img/Fintech.png';
import Entertainment from '../../../img/Entertainment.png';

// Material Components
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

//Custom Components
import CategoryResume from '../categoryResume/CategoryResume';

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

export default function Categories() {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Grid container spacing={1} justify="center">
                <Grid item xs={4}>
                    <CategoryResume src={IT} title={'Tecnología'} description={'#JAVA #JS #REACT #GO #PYTHON'}/>
                </Grid>
                <Grid item xs={4}>
                    <CategoryResume src={Sports} title={'Deportes'} description={'#FUTBOL #VOLEY #JOCKEY'}/>
                </Grid>                
            </Grid>
            <Grid container spacing={1} justify="center">
                <Grid item xs={4}>
                    <CategoryResume src={Fintech} title={'Finanzas'} description={'#FINTECH #BANK #CRYPTOS'}/>
                </Grid>
                <Grid item xs={4}>
                    <CategoryResume src={Entertainment} title={'Entretenimiento'} description={'#SERIES #PELIS #GAMING'}/>
                </Grid>                
            </Grid>
        </React.Fragment>
    );
}