import React from 'react';
import { Box, Typography, Button, Grid, makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { profileEducationCareerSelector } from '../../../store/selectors/profileSelectors';

const useStyles = makeStyles(theme => ({
  item: {
    marginBottom: theme.spacing(1)
  },
  parentDetails: {
    color: theme.palette.text.hint,
    marginLeft: theme.spacing(1)
  }

}));

const EducationCareer = (props) => {
  const classes = useStyles();
  const { editInfo, educationCareer } = props;
  const [labelCol, valueCol] = [6, 6];
  const [smLabelCol, smValueCol] = [3, 9];
  return (
    <Box my={2}>
      <Grid container>
        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Education: </Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}>
          <Typography>
            <b>{educationCareer.educationLevel}</b>
            {
              educationCareer.educationLevel && educationCareer.educationField  ? ' in ' : null
            }
            <b>{educationCareer.educationField}</b>
          </Typography>
        </Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>College/Uni: </Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{educationCareer.college1}</b></Typography></Grid>
        
        {
          educationCareer.college2 ? 
          <React.Fragment>
            <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>College/Uni 2: </Typography></Grid>
            <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{educationCareer.college2}</b></Typography></Grid>
          </React.Fragment>
          : null
        }
        
        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Working With: </Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{educationCareer.workingWith}</b></Typography></Grid>

        {
          educationCareer.workingWith === 'Not Working' ? null : 
          <React.Fragment>
            {
              educationCareer.workingWith !== 'Private Company' ? null :
              <>
              <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Employer: </Typography></Grid>
              <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{educationCareer.employerName}</b></Typography></Grid>
              </>
            }
            <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Working As: </Typography></Grid>
            <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{educationCareer.workingAs}</b></Typography></Grid>

            <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Annual Income: </Typography></Grid>
            <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{educationCareer.annualIncome}</b></Typography></Grid>
            {
              educationCareer.annualIncome && educationCareer.annualIncome !== 'Not applicable' && educationCareer.annualIncome !== "Don't Want to Specify" ?
              <>
              <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Keep Income Private: </Typography></Grid>
              <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{educationCareer.hideIncome ? 'Yes' : 'No'}</b></Typography></Grid>
              </>
              : null
            }
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
    educationCareer: profileEducationCareerSelector(state)
  }
}

export default connect(mapStateToProps)(EducationCareer);