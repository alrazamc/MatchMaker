import React from 'react';
import { Box, Button, CircularProgress, makeStyles } from '@material-ui/core';
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose } from 'redux';
import { connect } from 'react-redux';
import { systemSelector } from '../../../store/selectors/systemSelector';
import { getFirestore } from 'redux-firestore';
import { profileLifestyleUpdated } from '../../../store/actions/ProfileActions';
import FormMessage from '../../library/FormMessage';
import RadioInput from '../../library/form/RadioInput';

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
  const update = {
    lastUpdated: getFirestore().FieldValue.serverTimestamp(),
    lifestyle: values
  }
  return getFirestore().collection('users').doc(props.auth.uid).set(update, {merge: true}).then(response => {
    props.formSubmitted();
    dispatch(profileLifestyleUpdated());
  }).catch(err => {
    throw new SubmissionError({
      _error: err.message
    });
  })
}

const mapStateToProps = state => {
  return {
    system: systemSelector(state, ['diet', 'drink', 'smoke']),
    auth: state.firebase.auth,
    initialValues: state.firebase.profile ? state.firebase.profile.lifestyle : {}
  }
}

export default compose(
connect(mapStateToProps),
reduxForm({
  form: 'lifestyle',
  onSubmit
})
)(LifestyleForm);