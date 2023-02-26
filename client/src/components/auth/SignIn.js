import React, { useEffect, useMemo } from 'react';
import { Box, makeStyles, Button, CircularProgress, FormHelperText, Typography, Link } from '@material-ui/core';
import { reduxForm, Field, SubmissionError} from "redux-form";
import TextInput from '../library/form/TextInput';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Redirect, Link as RouterLink} from 'react-router-dom';
import { actionTypes } from '../../store/actions/AuthActions';
import { actionTypes as profileActionTypes} from '../../store/actions/ProfileActions';
import SocialLogin from './SocialLogin';
import axios from 'axios';
import PasswordField from '../library/form/PasswordField';
import Alert from '../library/Alert';

const useStyles = makeStyles(theme => ({
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

const SignIn = (props) => {
  const classes = useStyles();
  useEffect(() => {
    document.title = "Sign In | " + process.env.REACT_APP_NAME;
  }, []);
  const SocialLoginButtons = useMemo(() => (<SocialLogin />), [] );
  if(props.uid)
    return <Redirect to="my/dashboard" />
  const { handleSubmit, submitting, error, authError, successMsg } = props
  return (
    <Box className={classes.box} height={{xs: "100%", md: "80%"}}>
      { 
        authError ? <Alert variant="error" message={authError} vertical="top" horizontal="center" /> : null
      }
      { 
        successMsg ? <Alert variant="success" message={successMsg} vertical="bottom" horizontal="center" /> : null
      }
      <Box width={420} minWidth={300}>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <Field
              component={TextInput}
              id="email-phone"
              name="emailPhone"
              label="Email"
              type="email"
              fullWidth={true}
              autoFocus={true}
              variant="outlined"
              placeholder="Enter your email address"
            />
          </Box>
          <Box mb={2}>
            <PasswordField
              placeholder="Enter your password"
            />
          </Box>
          <Box textAlign="center" mb={2}>
            <Button type="submit" variant="contained" color="primary" disabled={ submitting} >
              Sign In 
              { submitting && <CircularProgress className={classes.progress} size={24} /> }
            </Button>
            { !submitting && error && 
              <FormHelperText className={classes.formError} error={true}>
                <Typography component="span">{ error }</Typography>
              </FormHelperText>  
            }
          </Box>
        </form>
        <Typography component="p" align="center">
            Forgot Password? <Link to="/reset-password" type="button" component={RouterLink}>Reset Password</Link>
        </Typography>
        { SocialLoginButtons }
        <Typography component="p" align="center">
            Don't have an account? <Link to="/signup" type="button" component={RouterLink}>Signup</Link>
        </Typography>
      </Box>
    </Box>
  );
}


const onSubmit = (values, dispatch) => {
  const user = {
    password: values.password,
    email: values.emailPhone
  };
  // if(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.emailPhone))
  //   user.email = values.emailPhone;
  // else if(/^\d{10,11}$/i.test(values.emailPhone))
  //   user.phoneNumber = values.emailPhone;
  return axios.post('/auth/signin', user).then( response => {
    if(response.data.token)
      localStorage.setItem(process.env.REACT_APP_JWT_TOKEN, response.data.token);
    if(response.data.fbtoken)
      localStorage.setItem(process.env.REACT_APP_FB_TOKEN, response.data.fbtoken);
    if(response.data.profile)
      dispatch({
        type: profileActionTypes.PROFILE_LOADED,
        profile: response.data.profile
      });
    if(response.data.user)
      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        user: response.data.user
      });
  }).catch(err => {
    throw new SubmissionError({
      _error: err.response && err.response.data.message ? err.response.data.message: err.message
    });
  })
}

const validate = values => {
  const errors = {};
  if(!values.emailPhone)
    errors.emailPhone = 'Required';
  if(!values.password)
    errors.password = 'Required';
  if (
    values.emailPhone &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.emailPhone)  
  ) {
    errors.emailPhone = 'Invalid email address';
  }
  return errors;
}


const mapStateToProps = state => {
  return {
    uid: state.auth.uid,
    authError: state.auth.error,
    successMsg: state.auth.success
  }
}

export default compose(
  connect(mapStateToProps),
  reduxForm({
  form: 'signin',
  onSubmit,
  validate
}))(SignIn);