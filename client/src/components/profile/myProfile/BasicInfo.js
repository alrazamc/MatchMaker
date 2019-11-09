import React from 'react';
import { Box, Typography, Button, Grid, makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { profileBasicInfoSelector } from '../../../store/selectors/profileSelectors';
import dayjs from 'dayjs';

const useStyles = makeStyles(theme => ({
  item: {
    marginBottom: theme.spacing(1)
  },
  textSecondary: {
    color: theme.palette.text.secondary
  }
}));

const BasicInfo = (props) => {
  const classes = useStyles();
  const { editInfo, basicInfo } = props;
  const [labelCol, valueCol] = [6, 6];
  const [smLabelCol, smValueCol] = [3, 9];
  return (
    <Box my={2}>
      <Grid container>
        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Name:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{basicInfo.firstName } {basicInfo.lastName }</b></Typography></Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Profile created by:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{basicInfo.profileCreatedBy}</b></Typography></Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Gender:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{basicInfo.gender}</b></Typography></Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Date of Birth:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}>
          <Typography>
            <b>{basicInfo.dateOfBirth}</b>
            { basicInfo.dateOfBirth ? 
              
              <span className={classes.textSecondary}>(Age: {dayjs().diff(dayjs(basicInfo.dateOfBirth), 'year') + ' Years'})</span> 
              : null 
            }
            </Typography>
        </Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Marital status:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{basicInfo.maritalStatus}</b></Typography></Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Height:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{basicInfo.height}</b></Typography></Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Body type:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{basicInfo.bodyType}</b></Typography></Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Body Weight:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{basicInfo.bodyWeight ? basicInfo.bodyWeight + ' kgs' : null }</b></Typography></Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Health Information:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{basicInfo.healthInfo}</b></Typography></Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Skin Tone:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{basicInfo.skinTone}</b></Typography></Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Disability:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{basicInfo.disability}</b></Typography></Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Blood Group:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{basicInfo.bloodGroup}</b></Typography></Grid>

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
    basicInfo: profileBasicInfoSelector(state)
  }
}

export default connect(mapStateToProps)(BasicInfo);