import React, { useEffect, useMemo } from 'react';
import { Box, Container, makeStyles, Button, CircularProgress, FormHelperText } from '@material-ui/core';
import { reduxForm, Field, SubmissionError } from "redux-form";
import TextInput from '../form/TextInput';
import { getFirebase } from 'react-redux-firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { LOGIN_SUCCESS } from '../../store/actions/AuthActions';
import SocialLogin from './SocialLogin';

const useStyles = makeStyles(theme => ({
  container: {
    height: '75%'
  },
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  progress: {
    marginLeft: theme.spacing(1)
  },
  formError: {
    textAlign: "center"
  }
}));

const SignUp = (props) => {
  const classes = useStyles();
  useEffect(() => {
    document.title = "Sign In | " + process.env.REACT_APP_NAME;
  }, []);
  const SocialLoginButtons = useMemo(() => (<SocialLogin />), [] );
  if(props.auth.uid)
    return <Redirect to="/profile" />
  const { handleSubmit, pristine, submitting, error, invalid } = props
  return (
    <Container className={classes.container} >
      <Box className={classes.box} height="100%">
        <Box width={420} minWidth={300}>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <Field
              component={TextInput}
              id="email-address"
              name="email"
              label="Email"
              type="email"
              fullWidth={true}
              variant="outlined"
              autoFocus={true}
              />
            </Box>
            <Box mb={2}>
              <Field 
              component={TextInput}
              id="password"
              name="password"
              label="Password"
              type="password"
              fullWidth={true}
              variant="outlined"
              />
            </Box>
            <Box textAlign="center">
              <Button type="submit" variant="contained" color="primary" disabled={pristine || submitting || invalid} >
                Sign In 
                { submitting && <CircularProgress className={classes.progress} size={24} /> }
              </Button>
              { error && 
                <FormHelperText className={classes.formError} error={true}>
                { error }
                </FormHelperText>  
              }
            </Box>
          </form>
          { SocialLoginButtons }
        </Box>
      </Box>
    </Container>
  );
}


const onSubmit = (values, dispatch) => {
  return getFirebase().auth().signInWithEmailAndPassword(values.email, values.password).then(response => {
    dispatch({type: LOGIN_SUCCESS});
  }).catch(err => {
    throw new SubmissionError({
      _error: err.message
    });
  })
}

const validate = values => {
  const errors = {};
  if(!values.email)
    errors.email = 'Required';
  if(!values.password)
    errors.password = 'Required';
  if (
    values.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = 'Invalid email address';
  }
  return errors;
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth
  }
}

export default compose(
  connect(mapStateToProps),
  reduxForm({
  form: 'signin',
  onSubmit,
  validate
}))(SignUp);