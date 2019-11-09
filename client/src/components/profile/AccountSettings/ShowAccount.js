import React from 'react';
import Panel from '../../library/Panel';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, SubmissionError } from 'redux-form';
import { Box, makeStyles, Button, CircularProgress, Icon, Typography } from '@material-ui/core';
import FormMessage from '../../library/FormMessage';
import { actionTypes } from '../../../store/actions/AuthActions';
import axios from 'axios';
import dayjs from 'dayjs';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}));

const ShowAccount = (props) => {
  const classes = useStyles();
  const {  handleSubmit, submitting, error, invalid, submitSucceeded } = props;
  return (
    <Panel id="show-account" heading="Activate Profile"  expanded>
      <Box display="flex" flexDirection="column">
        <Typography color="textSecondary" component="div" >
          Your profile is currently hidden and will be activated on { dayjs(props.auth.account.status.activateProfileOn).format('DD MMM, YYYY') }
        </Typography>
        <Box minWidth={280} maxWidth={400} my={2}>
          <form onSubmit={handleSubmit} >
            <Box display="flex" >
              <Button type="submit" variant="contained" color="primary" disabled={submitting || invalid} className={classes.button}>
                Activate Profile Now { submitting && <CircularProgress size={20} /> }
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
      </Box>
    </Panel>
  );
}

const onSubmit = (values, dispatch, props) => {
  return axios.post('/api/user/activate', values).then( response => {
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



const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
}
 
export default compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'showAccount',
    onSubmit
  })
)(ShowAccount);