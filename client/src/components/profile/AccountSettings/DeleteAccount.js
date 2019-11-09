import React from 'react';
import Panel from '../../library/Panel';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, Field, SubmissionError, formValueSelector } from 'redux-form';
import { Box, makeStyles, Button, CircularProgress, Icon, Typography } from '@material-ui/core';
import FormMessage from '../../library/FormMessage';
import { logOut } from '../../../store/actions/AuthActions';
import { systemSelector } from '../../../store/selectors/systemSelector';
import axios from 'axios';
import RadioInput from '../../library/form/RadioInput';
import TextInput from '../../library/form/TextInput';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}));

const DeleteAccount = (props) => {
  const classes = useStyles();
  const { system, reason, handleSubmit, submitting, error, invalid, submitSucceeded } = props;

  return (
    <Panel id="delete-account" heading="Delete Profile"  expanded>
      <Box display="flex" flexDirection="column">
        <Box minWidth={280} maxWidth={400} my={2}>
          <form onSubmit={handleSubmit} >
            <Box mb={2}>
              <Field
                component={RadioInput}
                options={system.deleteProfileReason}
                name="reason"
                type="number"
                fullWidth={true}
                label="Please Select a Reason"
              />
            </Box>
            {
              reason === 4 || reason === 5 ?
              <Box mb={2}>
                <Field
                  component={TextInput}
                  variant="outlined"
                  name="deleteReasonText"
                  fullWidth={true}
                  multiline
                  rows="4"
                  placeholder="Please share more details"
                />
              </Box>
              : null
            }
            <Box display="flex" >
              <Button type="submit" variant="contained" color="primary" disabled={submitting || invalid} className={classes.button}>
                Delete Profile { submitting && <CircularProgress size={20} /> }
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
        <Typography color="textSecondary" component="div" >
          <b>Note:</b> After deleting account, Your data and photos will be deleted permanently 
          and you won't be able to login again or create a new account with same phone/email
        </Typography>
      </Box>
    </Panel>
  );
}

const onSubmit = (values, dispatch, props) => {
  return axios.post('/api/user/delete', values).then( response => {
    if(response.data.message)
      props.logOut(response.data.message);
  }).catch(err => {
    throw new SubmissionError({
      _error: err.response && err.response.data.message ? err.response.data.message: err.message
    });
  })
}

const validate = (values, props) => {
  const errors = {};
  if(!values.reason)
    errors.reason = "Required";
  if(values.reason && (props.reason === 4 || props.reason === 5) && !values.deleteReasonText)
    errors.deleteReasonText = "Required";
  return errors;
}

const selector = formValueSelector('deleteAccount');

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    system: systemSelector(state, ['deleteProfileReason']),
    reason: parseInt(selector(state, 'reason'))
  }
}
 
export default compose(
  connect(mapStateToProps, { logOut }),
  reduxForm({
    form: 'deleteAccount',
    validate,
    onSubmit
  })
)(DeleteAccount);