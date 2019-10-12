import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { reduxForm, SubmissionError  } from 'redux-form';
import { Box, Container, Grid, Hidden, Button, CircularProgress, makeStyles, Typography, Icon } from '@material-ui/core';
import Panel from '../../library/Panel';
import Navigation from '../Navigation';
import FormMessage from '../../library/FormMessage';
import { Redirect } from 'react-router-dom';
import { getFirestore } from 'redux-firestore';
import { profilePartnerPreferenceUpdated } from '../../../store/actions/ProfileActions';
import BasicPreference from './BasicPreference';
import LocationPreference from './LocationPreference';

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
  const { handleSubmit, submitSucceeded, pristine, submitting, error, invalid } = props;
  
  useEffect(() => {
    document.title = "Partner Preference | " + process.env.REACT_APP_NAME;
  }, []);

  if(!props.uid)
    return <Redirect to="/signin" />
  return (
    <Box>
      <Navigation match={props.match} history={props.history}/>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2} >
            <Hidden smDown>
              {null}
            </Hidden>
          </Grid>
          <Grid item xs={12} md={7}>
            <Panel id="partner-preference" heading="Partner Preference" expanded>
              <Box width="100%" my={2} mx="auto">
                <Typography variant="subtitle1" gutterBottom>
                  Tell us what you are looking for in a life partner
                </Typography>
                <form onSubmit={handleSubmit}>
                  {/* <BasicPreference  />
                  <Typography component="div" gutterBottom className={classes.sectionHeader}> Location Details </Typography> */}
                  <LocationPreference />
                  
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
    uid: state.firebase.auth.uid,
    initialValues: state.firebase.profile ? state.firebase.profile.partnerPreference : {},
  }
}

const onSubmit = (values, dispatch, props) => {
  const update = {
    lastUpdated: getFirestore().FieldValue.serverTimestamp(),
    partnerPreference: values
  }
  return getFirestore().collection('users').doc(props.uid).set(update, {merge: true}).then(response => {
    dispatch( profilePartnerPreferenceUpdated() );
  }).catch(err => {
    throw new SubmissionError({
      _error: err.message
    });
  })
}

const validate = (values) => {
  const errors = {};
  return errors;
}

const firestoreSystemDocs = ['height', 'maritalStatus', 'religions', 'communities', 'languages', 'countries'].map(item => ({
  collection: 'system',
  doc: item
}));
 
export default compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'partnerPreference',
    onSubmit,
    validate
  }),
  firestoreConnect(firestoreSystemDocs)
)(PartnerPreference);