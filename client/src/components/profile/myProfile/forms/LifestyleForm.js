import React from 'react';
import { Box, Button, CircularProgress, makeStyles } from '@material-ui/core';
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose } from 'redux';
import { connect } from 'react-redux';
import { systemSelector } from '../../../../store/selectors/systemSelector';
import { actionTypes } from '../../../../store/actions/ProfileActions';
import FormMessage from '../../../library/FormMessage';
import RadioInput from '../../../library/form/RadioInput';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}))

const LifestyleForm = (props) => {
  const classes = useStyles();
  const { system, cancel, handleSubmit, pristine, submitting, error, invalid } = props;
  return (
      <Box minWidth={280} maxWidth={400} my={2}>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <Field 
              component={RadioInput}
              options={system.diet}
              label="Diet"
              id="diet"
              name="diet"
              fullWidth={true}
              />
          </Box>
          <Box mb={2}>
            <Field 
              component={RadioInput}
              options={system.drink}
              label="Drink"
              id="drink"
              name="drink"
              fullWidth={true}
              />
          </Box>
          <Box mb={2}>
            <Field 
              component={RadioInput}
              options={system.smoke}
              label="Smoke"
              id="smoke"
              name="smoke"
              fullWidth={true}
              />
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

const onSubmit = (values, dispatch, props) => {
  const data = {
    profileId: props.profileId,
    payload: {
      lifestyle: values
    }
  }
  return axios.post('/api/profile', data).then( response => {
    if(response.data.success)
      dispatch({
        type: actionTypes.PROFILE_LIFESTYLE_UPDATED,
        data: values
      });
    props.formSubmitted();
  }).catch(err => {
    throw new SubmissionError({
      _error: err.response && err.response.data.message ? err.response.data.message: err.message
    });
  })
}

const mapStateToProps = state => {
  return {
    system: systemSelector(state, ['diet', 'drink', 'smoke']),
    auth: state.auth,
    profileId: state.profile._id ? state.profile._id : null,
    initialValues: state.profile ? state.profile.lifestyle : {}
  }
}

export default compose(
connect(mapStateToProps),
reduxForm({
  form: 'lifestyle',
  onSubmit
})
)(LifestyleForm);