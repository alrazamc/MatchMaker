import React from 'react';
import { Box, Typography, Button, Grid, makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { profileFamilyInfoSelector } from '../../../store/selectors/profileSelectors';

const useStyles = makeStyles(theme => ({
  item: {
    marginBottom: theme.spacing(1)
  },
  parentDetails: {
    color: theme.palette.text.hint,
    marginLeft: theme.spacing(1)
  }

}));

const Family = (props) => {
  const classes = useStyles();
  const { editInfo, family } = props;
  const [labelCol, valueCol] = [6, 6];
  const [smLabelCol, smValueCol] = [3, 9];
  return (
    <Box my={2}>
      <Grid container>
        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Father's Status:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}>
          <Typography>
            <b>{family.fatherStatus}</b>
            <span className={classes.parentDetails}>
            {
              family.fatherStatus === 'Employed' || family.fatherStatus === 'Retired' ?
              (
                `(${family.fatherStatus === 'Employed' ? 'With' : 'From'} ${family.fatherCompanyName} As ${family.fatherCompanyPosition})`
              ) : null
            }
            {
              family.fatherStatus === 'Business' ?
              (
                `(${family.fatherBusinessNature})`
              ) : null
            }
            </span>
          </Typography>
        </Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Mother's Status:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}>
          <Typography>
            <b>{family.motherStatus}</b>
            <span className={classes.parentDetails}>
            {
              family.motherStatus === 'Employed' || family.motherStatus === 'Retired' ?
              (
                `(${family.motherStatus === 'Employed' ? 'With' : 'From'} ${family.motherCompanyName} As ${family.motherCompanyPosition})`
              ) : null
            }
            {
              family.motherStatus === 'Business' ?
              (
                `(${family.motherBusinessNature})`
              ) : null
            }
            </span>
          </Typography>
        </Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Family Location:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{family.familyLocation}</b></Typography></Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Native Place:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{family.familyNativePlace}</b></Typography></Grid>
        
        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Brothers:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}>
          <Typography>
            <b>
              {family.notMarriedBrothers ? `Not Married: ${family.notMarriedBrothers}` : null}
              {family.notMarriedBrothers && family.marriedBrothers ? ', ' : null}
              {family.marriedBrothers ? `Married: ${family.marriedBrothers}` : null}
            </b>
          </Typography>
        </Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Sisters:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}>
          <Typography>
            <b>
              {family.notMarriedSisters ? `Not Married: ${family.notMarriedSisters}` : null}
              {family.notMarriedSisters && family.marriedSisters ? ', ' : null}
              {family.marriedSisters ? `Married: ${family.marriedSisters}` : null}
            </b>
          </Typography>
        </Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Family Type:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{family.familyType}</b></Typography></Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Family values:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{family.familyValues}</b></Typography></Grid>

        <Grid item xs={labelCol} sm={smLabelCol} className={classes.item}><Typography>Family Affluence:</Typography></Grid>
        <Grid item xs={valueCol} sm={smValueCol} className={classes.item}><Typography><b>{family.familyAffluence }</b></Typography></Grid>

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
    family: profileFamilyInfoSelector(state)
  }
}

export default connect(mapStateToProps)(Family);