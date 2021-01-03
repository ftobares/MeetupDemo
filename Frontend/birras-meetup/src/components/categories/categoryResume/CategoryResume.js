import React from 'react';

// Styles
import '../Categories.css';

// Material Components
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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

export default function Category(props) {
    const classes = useStyles();

    return(
      <Card className={classes.categoryRoot}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="Contemplative Reptile"
          height="100"
          className={classes.media}
          image={props.src}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Ver más
        </Button>          
      </CardActions>
    </Card>
    );
}