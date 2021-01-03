import React, { useEffect, useState } from 'react';

// Material dependencies
import { makeStyles } from '@material-ui/core/styles';

//Material dependencies
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Button from '@material-ui/core/Button';

// Backend Services
import { registerToMeetup } from '../../services/meetup';
import { getCurrentWeather } from '../../services/weather';
import { getCity } from "../../services/geolocations";

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  pos: {

  }
});


function Row(props) {
  const { row, type, meetupsRegisterd } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const currentUser = (localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : '');
  const SIX_PACK = 6;
  const [cajasDeBirrasAmount, setCajasDeBirrasAmount] = useState(0);

  useEffect(()=>{
    getBirrasAmount(type, row.enrolled);
  },[row.enrolled]);
  
  const calculateBirrasAmount = async (temperature, enrolled) => {     
    let tempConstant;
    if(temperature < 20){
        tempConstant = 0.75
    }else if(temperature > 24){
        tempConstant = 2
    }else{
        tempConstant = 1
    } 
    
    let birrasAmount = enrolled * tempConstant;
    return Math.ceil(birrasAmount / SIX_PACK);
  }

  const getBirrasAmount = async (type, enrolled) => {
    if(type !== 'creadas') return;    
    await getCity(currentUser.city,
    async (response) => {        
        let weather = await getCurrentWeather(response.latitud, response.longuitud);
        if(weather){
            setCajasDeBirrasAmount(await calculateBirrasAmount(weather.maxTemp, enrolled));
        }
    },
    (error) => {
        console.error(error);
    });        
  }

  const handleRegisterToMeetup = (meetupId) => {    
    let user = JSON.parse(localStorage.getItem("user"));
    let response = registerToMeetup(user.id, meetupId);
    if(response && response.status === 201){
        console.log(response.data);
    }    
  }

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.title}
        </TableCell>
        <TableCell align="right">{row.date}</TableCell>
        {
            type === 'disponibles' && !meetupsRegisterd.find((meetup) => meetup.id === row.id)
            ? <Button variant="contained" color="secondary" onClick={() => handleRegisterToMeetup(row.id)}>Registrarse</Button>  
            : <TableCell align="right">{row.enrolled}</TableCell>
        }        
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>              
              <Typography className={classes.pos}>
                  <span style={{cursor: 'pointer'}}>{row.hashtag}</span>
              </Typography>
              <Typography variant="h6" component="p">
                  {row.description}                                              
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      {
        type === 'creadas'
        ?
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                    <Typography variant="h6" component="p">
                        Cantidad de cajas de birra que se estiman necesitar: {cajasDeBirrasAmount}.                                           
                    </Typography>
                    <Typography ariant="subtitle1" component="p">
                        La estimación esta realizada en base a la temperatura y cantidad de inscriptos actuales. Por favor, verifica el dato el mismo dia del evento.                                           
                    </Typography>
                    </Box>
                </Collapse>
                </TableCell>
            </TableRow>
        :   <div></div>
      }
      
    </React.Fragment>
  );
}

export default function CollapsibleTable(props) {
    const { data, type, meetupsRegisterd } = props;
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Nombre</TableCell>
            <TableCell align="right">Fecha</TableCell>
            <TableCell align="right">{type === 'disponibles' ? '¿Inscripto?' : 'Inscriptos'}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <Row key={row.title} meetupsRegisterd={meetupsRegisterd} row={row} type={type}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
