import React, { useEffect, useMemo } from 'react';
import { Box, makeStyles, Button, CircularProgress, FormHelperText, Link, Typography } from '@material-ui/core';
import { reduxForm, Field, SubmissionError } from "redux-form";
import TextInput from '../library/form/TextInput';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import SocialLogin from './SocialLogin';
import dayjs from 'dayjs';
import DateInput from '../library/form/DateInput';
import { Link as RouterLink} from 'react-router-dom';
import withSystem from '../library/withSystem';
import { systemSelector } from '../../store/selectors/systemSelector';
import RadioInput from '../library/form/RadioInput';
import axios from 'axios';
import { actionTypes } from '../../store/actions/AuthActions';
import { actionTypes as profileActionTypes} from '../../store/actions/ProfileActions';
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

const SignUp = (props) => {
  const classes = useStyles();
  useEffect(() => {
    document.title = "Sign Up | " + process.env.REACT_APP_NAME;
  }, []);
  const SocialLoginButtons = useMemo(() => (<SocialLogin />), [] );
  if(props.auth.uid)
    return <Redirect to="my/dashboard" />
  const { handleSubmit, pristine, submitting, error, invalid, system } = props
  return (
    <Box className={classes.box} height="100%">
      <Box width={420} minWidth={300}>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexWrap="wrap" justifyContent="space-between">
            <Box mb={2} width={{xs: "100%", sm: "49%"}}>
              <Field
              component={TextInput}
              id="first-name"
              name="firstName"
              label="First Name"
              fullWidth={true}
              variant="outlined"
              autoFocus={true}
              />    
            </Box>
            <Box mb={2} width={{xs: "100%", sm: "49%"}}>
              <Field
              component={TextInput}
              id="last-name"
              name="lastName"
              label="Last Name"
              fullWidth={true}
              variant="outlined"
              />
            </Box>
          </Box>
          <Box mb={2}>
            <Field 
              component={DateInput}
              initialFocusedDate={dayjs().subtract(18, 'year')}
              maxDate={dayjs().subtract(18, 'year')}
              label="Date of Birth"
              id="date-of-birth"
              name="dateOfBirth"
              dateFormat="DD MMMM, YYYY"
              fullWidth={true}
              inputVariant="outlined"
            />
            <FormHelperText>
              Choose carefully, can't be changed later
            </FormHelperText>
          </Box>
          <Box mb={2}>
            <Field 
              component={RadioInput}
              options={system.gender}
              label="Gender"
              id="gender"
              name="gender"
              fullWidth={true}
              defaultValue="1"
            />
          <FormHelperText>
            Choose carefully, can't be changed later
          </FormHelperText>
          </Box>
          <Box mb={2}>
            <Field
              component={TextInput}
              id="email-phone"
              name="emailPhone"
              label="Email"
              type="text"
              fullWidth={true}
              variant="outlined"
            />
          </Box>
          <Box mb={2}>
            <PasswordField />
          </Box>
          <Box textAlign="center">
            <Button type="submit" variant="contained" color="primary" disabled={pristine || submitting || invalid} >
              Sign Up 
              { submitting && <CircularProgress className={classes.progress} size={24} /> }
            </Button>
            { error && 
              <FormHelperText className={classes.formError} error={true}>
                <Typography component="span">{ error }</Typography>
              </FormHelperText>  
            }
          </Box>
        </form>
        { SocialLoginButtons }
        <Typography component="p" align="center">
            Already have an account ? <Link to="/signin" type="button" component={RouterLink}>Signin</Link>
        </Typography>
      </Box>
    </Box>
  );
}


const onSubmit = (values, dispatch) => {
  const user = {...values};
  delete user.emailPhone;
  user.email = values.emailPhone;
  // if(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.emailPhone))
  //   user.email = values.emailPhone;
  // else if(/^\d{10,11}$/i.test(values.emailPhone))
  //   user.phoneNumber = values.emailPhone;
  return axios.post('/auth/signup', user).then( response => {
    if(response.data.token)
      localStorage.setItem(process.env.REACT_APP_JWT_TOKEN, response.data.token);
    if(response.data.user)
      dispatch({
        type: actionTypes.SIGNUP_SUCCESS,
        user: response.data.user
      });
    if(response.data.profile)
      dispatch({
        type: profileActionTypes.PROFILE_LOADED,
        profile: response.data.profile
      });
  }).catch(err => {
    throw new SubmissionError({
      _error: err.response && err.response.data.message ? err.response.data.message: err.message
    });
  })
}

const validate = values => {
  const errors = {};
  const required = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'emailPhone', 'password'];
  required.forEach(item => {
    if(!values[item])
      errors[item] = 'Required';
  })
  if (
    values.emailPhone &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.emailPhone)  
  ) {
    errors.emailPhone = 'Invalid email address';
  }
  if(values.password && values.password.length < 6)
    errors.password = "Password should be at least 6 characters";
  return errors;
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    system: systemSelector(state, ['gender'])
  }
}

export default compose(
  connect(mapStateToProps),
  reduxForm({
  form: 'signup',
  onSubmit,
  validate
}),
withSystem(['gender'])
)(SignUp);