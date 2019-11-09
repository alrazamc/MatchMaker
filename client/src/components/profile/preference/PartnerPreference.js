import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, SubmissionError, initialize  } from 'redux-form';
import { Box, Container, Grid, Hidden, Button, CircularProgress, makeStyles, Typography, Icon, Collapse } from '@material-ui/core';
import Panel from '../../library/Panel';
import FormMessage from '../../library/FormMessage';
import { Redirect } from 'react-router-dom';
import { actionTypes } from '../../../store/actions/ProfileActions';
import BasicPreference from './BasicPreference';
import LocationPreference from './LocationPreference';
import withSystem from '../../library/withSystem';
import axios from 'axios';
import EducationCareerPreference from './EducationCareerPreference';
import OtherPreference from './OtherPreference';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  sliderValueLabel: {
    textAlign: "center"
  },
  sectionHeader: {
    backgroundColor: theme.palette.grey[200],
    width: '100%',
    padding: theme.spacing(1, 1),
    fontWeight: theme.typography.fontWeightBold
  }
}))

const PartnerPreference = (props) => {
  const classes = useStyles();
  const [showMore, setShowMore] = useState(false);
  const { handleSubmit, submitSucceeded, pristine, submitting, error, invalid, initialValues } = props;
  useEffect(() => {
    document.title = "Partner Preference | " + process.env.REACT_APP_NAME;
  }, []);

  if(!props.uid)
    return <Redirect to="/signin" />
  return (
    <Box>
      <Container>
        <Grid container spacing={2}>
          <Hidden smDown>
            <Grid item xs={12} md={1} >
              {null}
            </Grid>
          </Hidden>
          <Grid item xs={12} md={10}>
            <Panel id="partner-preference" heading="Partner Preference" expanded>
              <Box width="100%" my={2} mx="auto">
                <Typography variant="subtitle1" gutterBottom>
                  Tell us what you are looking for in a life partner
                </Typography>
                <form onSubmit={handleSubmit}>
                  <BasicPreference formName="partnerPreference" />
                  {
                    showMore ? null :
                    <Box textAlign="center">
                      <Button type="button" onClick={() => setShowMore(true)}>More <ArrowDownIcon /> </Button>
                    </Box>
                  }
                  <Collapse in={showMore} timeout={1000}>
                    <Typography component="div" gutterBottom className={classes.sectionHeader}> Location Details </Typography> 
                    <LocationPreference formName="partnerPreference" initialValues={initialValues}/>
                    <Typography component="div" gutterBottom className={classes.sectionHeader}> Education & Profession Details </Typography>
                    <EducationCareerPreference formName="partnerPreference" />
                    <Typography component="div" gutterBottom className={classes.sectionHeader}> Other Details </Typography>
                    <OtherPreference />
                  </Collapse>

                  <Box textAlign="center">
                    <Button type="submit" variant="contained" color="primary" disabled={pristine || submitting || invalid} className={classes.button}>
                    Update { submitting && <CircularProgress size={20} /> }
                    </Button>
                    { !submitting && submitSucceeded && 
                      <FormMessage success={true}>
                        <Box display="flex" justifyContent="center">
                          <Icon>done</Icon> Updated Successfully
                        </Box>
                      </FormMessage>  
                    }
                  </Box>
                  { error && 
                      <FormMessage error={true} >
                      { error }
                      </FormMessage>  
                    }
                </form>
              </Box>
            </Panel>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

const mapStateToProps = (state) => {
  return {
    uid: state.auth.uid,
    profileId: state.profile._id ? state.profile._id : null,
    initialValues: state.profile ? state.profile.partnerPreference : {},
  }
}

const onSubmit = (values, dispatch, props) => {
  const data = {
    profileId: props.profileId,
    payload: {
      partnerPreference: values
    }
  }
  return axios.post('/api/profile', data).then( response => {
    if(response.data.success)
    {
      dispatch({
        type: actionTypes.PROFILE_PARTNER_PREFERENCE_UPDATED,
        data: values
      });
      dispatch(initialize('partnerPreference', values));
    }
  }).catch(err => {
    throw new SubmissionError({
      _error: err.response && err.response.data.message ? err.response.data.message: err.message
    });
  })
}

const validate = (values) => {
  const errors = {};
  return errors;
}
 
export default compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'partnerPreference',
    onSubmit,
    validate
  }),
  withSystem(['height', 'maritalStatus', 'religions', 'communities', 'languages', 'countries', 'educationLevel', 
              'workingWith', 'occupations', 'annualIncome', 'profileCreatedBy', 'diet'])
)(PartnerPreference);