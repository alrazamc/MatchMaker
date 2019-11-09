import React from 'react';
import { reduxForm, Field, SubmissionError, initialize } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import RadioInput from '../../library/form/RadioInput';
import { Box, Button, CircularProgress, makeStyles, Icon, Tooltip, IconButton } from '@material-ui/core';
import { systemSelector } from '../../../store/selectors/systemSelector';
import FormMessage from '../../library/FormMessage';
import { actionTypes } from '../../../store/actions/PhotoActions';
import HelpIcon from '@material-ui/icons/HelpOutline';
import withSystem from '../../library/withSystem';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  tooltip: {
    maxWidth: 200,
    fontSize: '12px'
  }
}));

const Settings = (props) => {
  const classes = useStyles();
  const { system, handleSubmit, pristine, submitting, error, invalid, submitSucceeded } = props;
  return (
    <Box my={1} >
      <form onSubmit={handleSubmit}>
        <Box display="flex">
          <Box>
            <Field 
              component={RadioInput}
              options={system.photoVisibility}
              label="Photos Settings"
              id="visibility"
              name="visibility"
              fullWidth={true}
              />
          </Box>
          <Box my="auto">
            <Tooltip
            classes={{ tooltip: classes.tooltip }} 
            title="'Members I like' are members who you have either sent an request to or whose request you have accepted">
              <IconButton aria-label="help">
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </Box>
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
  );
}

const mapStateToProps = (state) => {
  return {
    system: systemSelector(state, ['photoVisibility']),
    initialValues: state.profile && state.profile.photos ? { visibility: state.profile.photos.visibility } : undefined,
    profileId: state.profile._id ? state.profile._id : null,
    uid: state.auth.uid
  }
}

export const validate = (values) => {
  const errors = {};
  if(!values.visibility)
    errors.visibility = "Required";
  return errors;
}

const onSubmit = (values, dispatch, props) => {
  const data = {
    profileId: props.profileId,
    payload: {
      "photos.visibility": values.visibility
    }
  }
  return axios.post('/api/profile', data).then( response => {
    if(response.data.success)
    {
      dispatch({
        type: actionTypes.PHOTOS_VISIBILITY_UPDATED,
        data: values.visibility
      })
      dispatch(initialize('photoSettings', values)); 
    }
  }).catch(err => {
    throw new SubmissionError({
      _error: err.response && err.response.data.message ? err.response.data.message: err.message
    });
  });
}

export default compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'photoSettings',
    validate,
    onSubmit
  }),
  withSystem(['photoVisibility'])
)(Settings);