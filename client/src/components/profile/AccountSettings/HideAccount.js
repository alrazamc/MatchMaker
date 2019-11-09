import React, { useMemo } from 'react';
import Panel from '../../library/Panel';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { Box, makeStyles, Button, CircularProgress, Icon, Typography } from '@material-ui/core';
import FormMessage from '../../library/FormMessage';
import SelectInput from '../../library/form/SelectInput';
import { actionTypes } from '../../../store/actions/AuthActions';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}));

const HideAccount = (props) => {
  const classes = useStyles();
  const {  handleSubmit, submitting, error, invalid, submitSucceeded } = props;
  const choices = useMemo(() => {
    return [...Array(25).keys()].map(index => {
      return {
        id: index + 6,
        title: `${index + 6} Days`
      }
    })
  }, []);
  return (
    <Panel id="hide-account" heading="Hide Profile"  expanded>
      <Box display="flex" flexDirection="column">
        <Box minWidth={280} maxWidth={400} my={2}>
          <form onSubmit={handleSubmit} >
            <Box mb={2}>
              <Field
                component={SelectInput}
                options={choices}
                name="hideDays"
                type="number"
                fullWidth={true}
                label="Hide My Profile For"
              />
            </Box>
            <Box display="flex" >
              <Button type="submit" variant="contained" color="primary" disabled={submitting || invalid} className={classes.button}>
                Hide Profile { submitting && <CircularProgress size={20} /> }
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
          <b>Note:</b> When you hide your profile, you will not be visible to any member
          of {process.env.REACT_APP_NAME}. You will not be able to send requests or Send
          messages or chat.
          <br />
          Use this feature if you have stopped looking temporarily or found
          someone but not yet sure
        </Typography>
      </Box>
    </Panel>
  );
}

const onSubmit = (values, dispatch, props) => {
  return axios.post('/api/user/hide', values).then( response => {
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
  if(!values.hideDays)
    errors.hideDays = "Required";
  if(values.hideDays && (values.hideDays < 6 || values.hideDays > 30))
    errors.hideDays = "Should be between 6 and 30 days";
  return errors;
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    initialValues: { hideDays: 6}
  }
}
 
export default compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'hideAccount',
    validate,
    onSubmit
  })
)(HideAccount);