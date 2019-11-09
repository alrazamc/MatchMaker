import React, { useEffect, useRef } from 'react';
import { Box, makeStyles, Button, CircularProgress, FormHelperText, Typography, Link, Collapse } from '@material-ui/core';
import { reduxForm, Field, SubmissionError, initialize} from "redux-form";
import TextInput from '../library/form/TextInput';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Redirect, Link as RouterLink} from 'react-router-dom';
import { actionTypes, initResetPasswordForm } from '../../store/actions/AuthActions';
import axios from 'axios';
import PasswordField from '../library/form/PasswordField';

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

const ResetPassword = (props) => {
  const classes = useStyles();
  const codeInputRef = useRef();
  const passwordInputRef = useRef();
  const { initResetPasswordForm, handleSubmit, submitting, error, pristine, invalid, formSteps } = props
  useEffect(() => {
    document.title = "Reset Password | " + process.env.REACT_APP_NAME;
    initResetPasswordForm();
  }, [initResetPasswordForm]);
  useEffect(() => {
    if(formSteps.emailStep)
      codeInputRef.current && codeInputRef.current.focus();
  }, [formSteps.emailStep])
  useEffect(() => {
    if(formSteps.codeStep)
      codeInputRef.current && codeInputRef.current.focus();
  }, [formSteps.codeStep])

  if(props.auth.uid)
    return <Redirect to="my/dashboard" />
  if(formSteps.passwordStep)
  {
    initResetPasswordForm(); //reset form steps state
    return <Redirect to="/signin" />
  }
  return (
    <Box className={classes.box} height={{xs: "100%", md: "80%"}}>
      <Box width={420} minWidth={300}>
        <form onSubmit={handleSubmit}>
          <Collapse in={!formSteps.emailStep}>
            <Box mb={2}>
                <Field
                  component={TextInput}
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth={true}
                  autoFocus={!formSteps.emailStep}
                  variant="outlined"
                  placeholder="Enter your email address"
                />
              </Box>
          </Collapse>
          <Collapse in={formSteps.emailStep && !formSteps.codeStep}>
            <Box mb={2}>
                <Field
                  component={TextInput}
                  id="code"
                  name="code"
                  label="6 Digit Code"
                  fullWidth={true}
                  autoFocus={true}
                  variant="outlined"
                  placeholder="Enter 6 digit verification code"
                  inputRef={codeInputRef}
                />
                <FormHelperText>
                  An email with 6 digit code is sent to your email address
                </FormHelperText>
            </Box>
          </Collapse>
          <Collapse in={formSteps.emailStep && formSteps.codeStep}>
            <Box mb={2}>
              <PasswordField inputRef={passwordInputRef} />
              <FormHelperText>
                Enter new password
              </FormHelperText>
            </Box>
          </Collapse>
          <Box textAlign="center" mb={2}>
            <Button type="submit" variant="contained" color="primary" disabled={pristine || submitting || invalid} >
              { formSteps.emailStep && formSteps.codeStep ? 'Change Password' : '' }
              { formSteps.emailStep && !formSteps.codeStep ? 'Verify Code' : '' }
              { !formSteps.emailStep && !formSteps.codeStep ? 'Reset Password' : '' } 
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
            <Link to="/signin" type="button" component={RouterLink}>Sign in to my account</Link>
        </Typography>
      </Box>
    </Box>
  );
}


const onSubmit = (values, dispatch, props) => {
  const user = {
    email: values.email,
  };
  if(props.formSteps.emailStep) //email Step done
    user.code = values.code;
  if(props.formSteps.codeStep)
  {
    user.codeVerified = true;
    user.password = values.password;
  }
  return axios.post('/auth/resetPassword', user).then( response => {
    const payload = { emailStep : true };
    if(props.formSteps.emailStep)
      payload.codeStep = true;
    if(props.formSteps.codeStep)
      payload.passwordStep = true;
    dispatch({
      type: actionTypes.RESET_PASSWORD_SUCCESS,
      payload
    });
    dispatch(initialize('resetPassword', values));
  }).catch(err => {
    throw new SubmissionError({
      _error: err.response && err.response.data.message ? err.response.data.message: err.message
    });
  })
}

const validate = (values, props) => {
  const errors = {};
  if(!values.email)
    errors.email = 'Required';
  if(values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email))
    errors.email = "Invalid email address";
  if(props.formSteps.emailStep && !values.code)
    errors.code = "Required";
  if(props.formSteps.emailStep && values.code && isNaN(values.code))
    errors.code = "Code should be numeric";
  if(props.formSteps.emailStep && values.code && values.code.length > 6)
    errors.code = "Code should be 6 digits";
  if(props.formSteps.codeStep && !values.password)
    errors.password = 'Required';
  if(props.formSteps.codeStep && values.password && values.password.length < 6)
    errors.password = "Password should be at least 6 characters";
  return errors;
}


const mapStateToProps = state => {
  return {
    auth: state.auth,
    formSteps: state.auth.resetPassword
  }
}

export default compose(
  connect(mapStateToProps, {initResetPasswordForm}),
  reduxForm({
  form: 'resetPassword',
  onSubmit,
  validate
}))(ResetPassword);