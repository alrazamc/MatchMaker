import React from 'react';
import { makeStyles, Paper, Typography, Box } from '@material-ui/core';
import { systemSelector } from '../../store/selectors/systemSelector';
import { connect } from 'react-redux';

const useStyles = makeStyles(theme => ({
  root:{
    marginTop: theme.spacing(1),
    color: theme.palette.grey[600],
  },
  about: {
    color: theme.palette.grey[800]
  }
}));

const Lifestyle = ({lifestyle, system}) => {
  const classes = useStyles();
  if(!lifestyle) return null;
  const diet = system.data.diet[lifestyle.diet] ? system.data.diet[lifestyle.diet].title : '';
  const smoke = system.data.smoke[lifestyle.smoke] ? system.data.smoke[lifestyle.smoke].title : '';
  const drink = system.data.drink[lifestyle.drink] ? system.data.drink[lifestyle.drink].title : '';
  if(!diet && !smoke && !drink) return null;
  return (
    <Paper className={classes.root}>
      <Box py={1} px={2}>
        <Typography variant="h6" className={classes.about} gutterBottom>Lifestyle</Typography>
        { !diet ? null : <Typography color="inherit" ><b>Diet:</b> {diet}</Typography> }
        { !smoke ? null : <Typography color="inherit" ><b>Smoking:</b> {smoke}</Typography> }
        { !drink ? null : <Typography color="inherit" ><b>Drinking:</b> {drink}</Typography> }
      </Box>
    </Paper>
  );
}

 
const mapStateToProps = state => {
  return {
    system: systemSelector(state, [], ['diet', 'smoke', 'drink']),
  }
}
export default connect(mapStateToProps)(Lifestyle);
 
