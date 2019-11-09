import React from 'react';
import { Box, Typography, Button, Grid, makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { profileReligionCasteSelector } from '../../../store/selectors/profileSelectors';

const useStyles = makeStyles(theme => ({
  item: {
    marginBottom: theme.spacing(1)
  }
}));

const Religion = (props) => {
  const classes = useStyles();
  const { editInfo, religionCaste } = props;
  const [labelCol, valueCol] = [6, 6];
  const [smLabelCol, smValueCol] = [3, 9];
  return (
    <Box my={2}>
      <Grid container>
        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Religion:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{religionCaste.religion}</b></Typography></Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Community:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{religionCaste.community}</b></Typography></Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Mother Tongue:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{religionCaste.motherTongue}</b></Typography></Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Caste:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{religionCaste.caste}</b></Typography></Grid>
        
        {
          !religionCaste.namaaz ? null : 
          <React.Fragment>
            <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Namaaz:</Typography></Grid>
            <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{religionCaste.namaaz}</b></Typography></Grid>
          </React.Fragment>
        }

        {
          !religionCaste.zakaat ? null : 
          <React.Fragment>
            <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Zakaat:</Typography></Grid>
            <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{religionCaste.zakaat}</b></Typography></Grid>
          </React.Fragment>
        }

        {
          !religionCaste.fasting ? null : 
          <React.Fragment>
            <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Fasting:</Typography></Grid>
            <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{religionCaste.fasting}</b></Typography></Grid>
          </React.Fragment>
        }

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
    religionCaste: profileReligionCasteSelector(state)
  }
}

export default connect(mapStateToProps)(Religion);