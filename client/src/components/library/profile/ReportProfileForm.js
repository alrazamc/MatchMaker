import React from 'react';
import { reduxForm, Field, SubmissionError, initialize } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import TextInput from '../../library/form/TextInput';
import { Box, Button, CircularProgress, makeStyles, Icon, Typography } from '@material-ui/core';
import FormMessage from '../../library/FormMessage';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}));

const ReportProfileForm = (props) => {
  const classes = useStyles();
  const { handleSubmit, pristine, submitting, error, invalid, submitSucceeded } = props;
  return (
    <Box my={1} width="100%">
      <Typography gutterBottom color="textSecondary">
        We are trying to make this platform a safer place. Please tell us what you want to report about this profile.
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box>
          <Field 
            component={TextInput}
            name="description"
            autoFocus={true}
            fullWidth={true}
            variant="outlined"
            multiline={true}
            rows={5}
            />
        </Box>
        <Box display="flex">
          <Button type="submit" variant="contained" color="primary" disabled={pristine || submitting || invalid} className={classes.button}>
            Send Report { submitting && <CircularProgress size={20} /> }
          </Button>
          { !submitting && submitSucceeded && 
            <FormMessage success={true} >
              <Box display="flex">
                <Icon>done</Icon> Report sent successfully 
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
  );
}
 
const validate = values => {
  const errors = {}
  if(!values.description)
    errors.description = "Required";
  return errors;
}

const onSubmit = (values, dispatch, props) => {
  const data = {
    profileId: props.myProfileId,
    reportedProfileId: props.profileId,
    ...values
  }
  return axios.post('/api/report', data).then( response => {
    if(response.data.success)
      dispatch(initialize('reportProfile', {description: ""})); 
  }).catch(err => {
    throw new SubmissionError({
      _error: err.response && err.response.data.message ? err.response.data.message: err.message
    });
  });
}

const mapStateToProps = (state) => {
  return {
    myProfileId: state.profile._id ? state.profile._id : null
  }
}


export default compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'reportProfile',
    validate,
    onSubmit
  })
)(ReportProfileForm);
