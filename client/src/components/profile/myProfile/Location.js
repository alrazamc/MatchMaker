import React from 'react';
import { Box, Typography, Button, Grid, makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { profileLocationSelector } from '../../../store/selectors/profileSelectors';

const useStyles = makeStyles(theme => ({
  item: {
    marginBottom: theme.spacing(1)
  }
}));

const Location = (props) => {
  const classes = useStyles();
  const { editInfo, location } = props;
  const [labelCol, valueCol] = [6, 6];
  const [smLabelCol, smValueCol] = [3, 9];
  return (
    <Box my={2}>
      <Grid container>
        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Country: </Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{location.country}</b></Typography></Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>State: </Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{location.state ? location.state.name : ''}</b></Typography></Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>City: </Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{location.city ? location.city.name : ''}</b></Typography></Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Zip/Pin Code: </Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{location.zipCode}</b></Typography></Grid>
        
        <Grid item>
          <Button variant="contained" color="primary" onClick={editInfo} >
            Edit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

const mapStateToProps = state => {
  return {
    location: profileLocationSelector(state)
  }
}

export default connect(mapStateToProps)(Location);