import React from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import RadioInput from '../../library/form/RadioInput';
import { Box, Button, CircularProgress, makeStyles, Icon, Tooltip, IconButton } from '@material-ui/core';
import { systemSelector } from '../../../store/selectors/systemSelector';
import FormMessage from '../../library/FormMessage';
import { getFirestore } from 'redux-firestore';
import { photosVisibilityUpdated } from '../../../store/actions/PhotoActions';
import HelpIcon from '@material-ui/icons/HelpOutline';

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
    initialValues: state.firebase.profile && state.firebase.profile.photos ? { visibility: state.firebase.profile.photos.visibility } : undefined,
    uid: state.firebase.auth.uid
  }
}

export const validate = (values) => {
  const errors = {};
  if(!values.visibility)
    errors.visibility = "Required";
  return errors;
}

const onSubmit = (values, dispatch, props) => {
  const update = {
    lastUpdated: getFirestore().FieldValue.serverTimestamp(),
    photos: {
      visibility: values.visibility
    }
  }
  return getFirestore().collection('users').doc(props.uid).set(update, {merge: true}).then(response => {
    dispatch( photosVisibilityUpdated() );
  }).catch(err => {
    throw new SubmissionError({
      _error: err.message
    });
  })
}

export default compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'photoSettings',
    validate,
    onSubmit
  }),
  firestoreConnect([{
    collection: 'system',
    doc: 'photoVisibility'
  }])
)(Settings);