import React from 'react'
import { Box, Typography, Button, Grid, makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { profileLifestyleSelector } from '../../../store/selectors/profileSelectors';

const useStyles = makeStyles(theme => ({
  item: {
    marginBottom: theme.spacing(1)
  }
}));
const Lifestyle = (props) => {
  const classes = useStyles();
  const { editInfo, lifestyle } = props;
  const [labelCol, valueCol] = [6, 6];
  const [smLabelCol, smValueCol] = [3, 9];
  return (
    <Box my={2}>
      <Grid container>
        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Diet:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{lifestyle.diet}</b></Typography></Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Drink:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{lifestyle.drink}</b></Typography></Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Smoke:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{lifestyle.smoke}</b></Typography></Grid>

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
    lifestyle: profileLifestyleSelector(state)
  }
}

export default connect(mapStateToProps)(Lifestyle);