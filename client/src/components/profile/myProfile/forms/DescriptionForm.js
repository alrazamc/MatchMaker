import React from 'react';
import { Box, Button, CircularProgress, makeStyles, Typography, FormHelperText } from '@material-ui/core';
import { reduxForm, Field, SubmissionError, formValueSelector } from "redux-form";
import { compose } from 'redux';
import { connect } from 'react-redux';
import { actionTypes } from '../../../../store/actions/ProfileActions';
import FormMessage from '../../../library/FormMessage';
import TextInput from '../../../library/form/TextInput';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}))

const DescriptionForm = (props) => {
  const classes = useStyles();
  const { cancel, description, handleSubmit, pristine, submitting, error, invalid } = props;
  return (
      <Box width="100%" my={2}>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <Typography gutterBottom variant="body2" color="textPrimary">
              This section will help you make a strong impression on your potential partner. So, express yourself.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Personality, Family Details, Career, Partner Expectations etc.
            </Typography>
            <Field 
              component={TextInput}
              variant="outlined"
              id="profile-description"
              name="profileDescription"
              fullWidth={true}
              margin="dense"
              multiline
              rows="4"
              autoFocus={true}
            />
            <Box display="flex" justifyContent="space-between">
              <FormHelperText>
                {
                  description ? `${description.length} characters, ${8000 - description.length} remaining` : null
                }
              </FormHelperText>
              <FormHelperText>
                Characters: min 50, max 8000
              </FormHelperText>
            </Box>
          </Box>
          <Box textAlign="center" >
            <Button type="submit" variant="contained" color="primary" disabled={pristine || submitting || invalid} className={classes.button}>
             Update { submitting && <CircularProgress size={20} /> }
            </Button>
            <Button type="button" variant="outlined" color="primary" disabled={submitting} onClick={cancel} className={classes.button}>
              Cancel
            </Button>
          </Box>
          { error && 
              <FormMessage error={true} >
              { error }
              </FormMessage>  
            }
        </form>
    </Box>
  );
}

const validate = values => {
  const errors = {}
  if(values.profileDescription && values.profileDescription.length < 50)
    errors.profileDescription = 'Should be minimum 50 characters';
  if(values.profileDescription && values.profileDescription.length > 8000)
    errors.profileDescription = 'Should be maximum 8000 characters';
  return errors;
}

const onSubmit = (values, dispatch, props) => {
  const data = {
    profileId: props.profileId,
    payload: {
      profileDescription: values.profileDescription
    }
  }
  return axios.post('/api/profile', data).then( response => {
    if(response.data.success)
      dispatch({
        type: actionTypes.PROFILE_DESCRIPTION_UPDATED,
        data: values.profileDescription
      });
    props.formSubmitted();
  }).catch(err => {
    throw new SubmissionError({
      _error: err.response && err.response.data.message ? err.response.data.message: err.message
    });
  })
}

const selector = formValueSelector('profileDescription');

const mapStateToProps = state => {
  return {
    auth: state.auth,
    initialValues: state.profile && state.profile.profileDescription ? {profileDescription: state.profile.profileDescription}  : undefined,
    description: selector(state, 'profileDescription')
  }
}

export default compose(
connect(mapStateToProps),
reduxForm({
  form: 'profileDescription',
  onSubmit,
  validate
})
)(DescriptionForm);