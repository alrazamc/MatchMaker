import React from 'react';
import Panel from '../../library/Panel';
import { Box, Button, CircularProgress, Typography, Icon, FormHelperText } from '@material-ui/core';
import { reduxForm, Field, SubmissionError } from "redux-form";
import SelectInput from '../../library/form/SelectInput';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { systemSelector } from '../../../store/selectors/systemSelector';
import { getFirestore } from 'redux-firestore';
import { profileBasicInfoUpdated } from '../../../store/actions/ProfileActions';
import FormMessage from '../../library/FormMessage';
import DateInput from '../../library/form/DateInput';
import dayjs from 'dayjs';

const EditBasicInfo = (props) => {
  const { system, initialValues, handleSubmit, pristine, submitting, error, invalid, submitSucceeded } = props;
  console.log(props);
  return (
    <Panel id="basic-info" heading="Basic Info" expanded={true}>
      <Box width={280}>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <Field 
              component={SelectInput}
              options={system.profileCreatedBy}
              label="Profile Created By"
              id="profile-created-by"
              name="profileCreatedBy"
              fullWidth={true}
            />
          </Box>
          <Box mb={2}>
            {
              initialValues && initialValues.dateOfBirth ? 
              <Typography>Date Of Birth: <b>{ initialValues.dateOfBirth }</b></Typography> : 
              <Box>
                <Field 
                component={DateInput}
                initialFocusedDate={dayjs().subtract(18, 'year')}
                maxDate={dayjs().subtract(18, 'year')}
                label="Date of Birth"
                id="date-of-birth"
                name="dateOfBirth"
                dateFormat="DD MMMM, YYYY"
                fullWidth={true} 
                />
                <FormHelperText>
                  Choose carefully, can't be changed later
                </FormHelperText>
              </Box>
            }
          </Box>
          <Box mb={2}>
            <Field 
              component={SelectInput}
              options={system.maritalStatus}
              label="Marital Status"
              id="marital-status"
              name="maritalStatus"
              fullWidth={true}
            />
          </Box>
          <Box mb={2}>
            <Field 
              component={SelectInput}
              options={system.bloodGroup}
              label="Blood Group"
              id="blood-group"
              name="bloodGroup"
              fullWidth={true}
            />
          </Box>
          <Box textAlign="center" display="flex">
            <Button type="submit" variant="contained" color="primary" disabled={pristine || submitting || invalid} >
             Update { submitting && <CircularProgress size={20} /> }
            </Button>
            { !submitting && !pristine && submitSucceeded && 
              <Icon style={{ fontSize: 40, color: "green" }}>done</Icon>
            }
            { error && 
              <FormMessage error={true}>
              { error }
              </FormMessage>  
            }
          </Box>
        </form>
      </Box>
    </Panel>
  );
}

const onSubmit = (values, dispatch, props) => {
  const update = {
    lastUpdated: getFirestore().FieldValue.serverTimestamp(),
    basicInfo: values
  }
  return getFirestore().collection('users').doc(props.auth.uid).set(update, {merge: true}).then(response => {
    dispatch(profileBasicInfoUpdated());
  }).catch(err => {
    throw new SubmissionError({
      _error: err.message
    });
  })
}

const validate = values => {
  const errors = {};
  if(!values.profileCreatedBy)
    errors.profileCreatedBy = 'Required';
  if(!values.maritalStatus)
    errors.maritalStatus = 'Required';
  if(!values.dateOfBirth)
    errors.dateOfBirth = 'Required';
  return errors;
}

const mapStateToProps = state => {
  return {
    system: systemSelector(state, ['profileCreatedBy', 'maritalStatus', 'bloodGroup']),
    auth: state.firebase.auth,
    initialValues: state.firebase.profile ? state.firebase.profile.basicInfo : {}
  }
}
export default compose(
connect(mapStateToProps),
reduxForm({
  form: 'basicInfo',
  validate,
  onSubmit
})
)(EditBasicInfo);