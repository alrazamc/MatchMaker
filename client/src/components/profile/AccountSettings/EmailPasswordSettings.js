import React from 'react';
import Panel from '../../library/Panel';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { Box, makeStyles, Button, CircularProgress, Icon, Collapse, FormHelperText } from '@material-ui/core';
import FormMessage from '../../library/FormMessage';
import TextInput from '../../library/form/TextInput';
import PasswordField from '../../library/form/PasswordField';
import { actionTypes } from '../../../store/actions/AuthActions';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}));

const EmailPasswordSettings = (props) => {
  const classes = useStyles();
  const { initialValues, handleSubmit, pristine, submitting, error, invalid, submitSucceeded } = props;
  return (
    <Panel id="email-password-settings" heading="Account Settings"  expanded>
      <Box width="100%" my={0}>
        <form onSubmit={handleSubmit} >
          <Collapse> { /*To disable chrome Autofill */ }
            <label htmlFor="email">Email Address</label>
            <input type="email" name="email" id="email" />
            <input type="password" name="currentPassword" id="password"/>
          </Collapse>
          <Box mb={2}>
            <Field
              component={TextInput}
              name="email"
              type="email"
              label="Email Address"
              fullWidth={true}
             />
          </Box>
          <Box mb={2}>
            <Field
              component={TextInput}
              name="phoneNumber"
              type="text"
              label="Mobile Number"
              fullWidth={true}
             />
            <FormHelperText>Example Mobile Number: 03141234567</FormHelperText>
          </Box>
          { !initialValues.hasPassword ? null :
            <Box mb={2}>
              <Field
                component={PasswordField}
                name="currentPassword"
                label="Current Password"
                variant="standard"
                fullWidth={true}
              />
            </Box>
          }
          <Box mb={2}>
            <Field
              component={PasswordField}
              name="newPassword"
              label={(!initialValues.hasPassword ? "Add" : "New") + " Password"}
              variant="standard"
              fullWidth={true}
             />
          </Box>

          <Box display="flex">
            <Button type="submit" variant="contained" color="primary" disabled={pristine || submitting || invalid} className={classes.button}>
              Update { submitting && <CircularProgress size={20} /> }
            </Button>
            { !submitting && submitSucceeded && 
              <FormMessage success={true} >
                <Box display="flex">
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
  );
}

const onSubmit = (values, dispatch, props) => {
  return axios.post('/api/user/settings', values).then( response => {
    if(response.data._id)
    {
      dispatch({
        type: actionTypes.ACCOUNT_SETTINGS_UPDATED,
        data: response.data
      });
    }
  }).catch(err => {
    throw new SubmissionError({
      _error: err.response && err.response.data.message ? err.response.data.message: err.message
    });
  })
}

const validate = (values, props) => {
  const errors = {};
  if(!values.email && !values.phoneNumber)
    errors.phoneNumber = errors.email = "Please specify either email address or mobile number";
  if(props.initialValues.hasPassword && !values.currentPassword)
    errors.currentPassword = "Current password is required";
  if ( values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email) )
    errors.email = 'Invalid email address';
  if ( values.phoneNumber && !/^\d{10,11}$/i.test(values.phoneNumber) )
    errors.phoneNumber = 'Mobile number should be 10-11 digits';
  if(values.currentPassword && values.currentPassword.length < 6)
    errors.currentPassword = "Password should be at least 6 characters";
  if(values.newPassword && values.newPassword.length < 6)
    errors.newPassword = "Password should be at least 6 characters";
  return errors;
}

const asyncValidate = values => {
  return axios.post('/api/user/validate', {email: values.email, phoneNumber: values.phoneNumber}).then(({data}) => {
    if(data.email)
      return Promise.reject({ email: data.email })
    else if(data.phoneNumber)
      return Promise.reject({ phoneNumber: data.phoneNumber })
  })

}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    initialValues: state.auth.account ? state.auth.account : {}
  }
}
 
export default compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'accountSetting',
    validate,
    onSubmit,
    asyncValidate,
    asyncBlurFields: ['email', 'phoneNumber']
  })
)(EmailPasswordSettings);