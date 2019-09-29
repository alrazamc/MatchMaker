import React, { useState } from 'react';
import { Box, Button, CircularProgress, FormHelperText, makeStyles } from '@material-ui/core';
import { reduxForm, Field, SubmissionError, formValueSelector } from "redux-form";
import SelectInput from '../../library/form/SelectInput';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { systemSelector } from '../../../store/selectors/systemSelector';
import { getFirestore } from 'redux-firestore';
import { profileBasicInfoUpdated } from '../../../store/actions/ProfileActions';
import FormMessage from '../../library/FormMessage';
import DateInput from '../../library/form/DateInput';
import dayjs from 'dayjs';
import RadioInput from '../../library/form/RadioInput';
import SliderInput from '../../library/form/SliderInput';
import TextInput from '../../library/form/TextInput';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  sliderValueLabel: {
    textAlign: "center"
  }
}))

const BasicInfoForm = (props) => {
  const [heightLabel, setHeightLabel] = useState("");
  const classes = useStyles();
  const { system, cancel, formValues, initialValues, handleSubmit, pristine, submitting, error, invalid } = props;
  const getHeightValueLabel = (value) => {
    const text = system.data.height[value] ? system.data.height[value].labelUnit : "";
    setHeightLabel(text);
    return text;
  }
  return (
      <Box minWidth={280} maxWidth={400} my={2}>
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
          {
            initialValues && initialValues.gender ? 
            null :
            <Box mb={2}>
              <Field 
              component={RadioInput}
              options={system.gender}
              label="Gender"
              id="gender"
              name="gender"
              fullWidth={true}
            />
            <FormHelperText>
              Choose carefully, can't be changed later
            </FormHelperText>
            </Box>
          }
          {
            initialValues && initialValues.dateOfBirth ? 
            null : 
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
              />
              <FormHelperText>
                Choose carefully, can't be changed later
              </FormHelperText>
            </Box>
          }
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
          { initialValues && initialValues.height ? null : 
            <Box mb={2}>
              <Field 
                component={SliderInput}
                label="Height"
                valueLabel={heightLabel}
                name="height"
                fullWidth={true}
                step={1}
                marks={system.height}
                min={1}
                max={system.height.length}
                valueLabelFormat={getHeightValueLabel}
                valueLabelDisplay="auto"
                classes={{
                  valueLabel: classes.sliderValueLabel
                }}
              />
              <FormHelperText>
                Choose carefully, can't be changed later
              </FormHelperText>
            </Box>
          }
          <Box mb={2}>
            <Field 
              component={RadioInput}
              options={system.bodyType}
              label="Body Type"
              id="body-type"
              name="bodyType"
              fullWidth={true}
              />
          </Box>
          <Box mb={2}>
            <Field 
              component={TextInput}
              label="Body Weight (kgs)"
              id="body-weight"
              name="bodyWeight"
              fullWidth={true}
            />
          </Box>
          <Box mb={2}>
            <Field 
              component={SelectInput}
              options={system.healthInfo}
              label="Health Information"
              id="health-information"
              name="healthInfo"
              fullWidth={true}
            />
          </Box>
          { formValues.healthInfo === '7' &&
          <Box mb={2}>
            <Field 
              component={TextInput}
              id="health-info-text"
              name="healthInfoText"
              label={
                formValues.healthInfoText && 
                  `${100 - formValues.healthInfoText.length} charcters remaining`
              }
              placeholder="Health information (max 100 characters)"
              inputProps={{maxLength: 100}}
              multiline={true}
              rowsMax={3}
              rows={3}
              fullWidth={true}
            />
          </Box>
          }
          <Box mb={2}>
            <Field 
              component={RadioInput}
              options={system.skinTone}
              label="Skin Tone"
              id="skin-tone"
              name="skinTone"
              fullWidth={true}
              />
          </Box>
          <Box mb={2}>
            <Field 
              component={RadioInput}
              options={system.disability}
              label="Any Disability?"
              id="disablitiy"
              name="disability"
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
          <Box textAlign="center" >
            <Button type="submit" variant="contained" color="primary" disabled={pristine || submitting || invalid} className={classes.button}>
             Update { submitting && <CircularProgress size={20} /> }
            </Button>
            <Button type="button" variant="outlined" color="primary" disabled={submitting} onClick={cancel} className={classes.button}>
              Cancel
            </Button>
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

const onSubmit = (values, dispatch, props) => {
  const update = {
    lastUpdated: getFirestore().FieldValue.serverTimestamp(),
    basicInfo: values
  }
  return getFirestore().collection('users').doc(props.auth.uid).set(update, {merge: true}).then(response => {
    props.formSubmitted();
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
  if(!values.gender)
    errors.gender = 'Required';
  if(!values.dateOfBirth)
    errors.dateOfBirth = 'Required';
  if(!values.maritalStatus)
    errors.maritalStatus = 'Required';
  if(!values.height)
    errors.height = 'Required';
  if(values.bodyWeight && isNaN(values.bodyWeight))
    errors.bodyWeight = 'Should be a number';
  return errors;
}

const selector = formValueSelector('basicInfo');

const mapStateToProps = state => {
  return {
    system: systemSelector(state, ['profileCreatedBy', 'gender', 'maritalStatus', 'height', 'bodyType', 'healthInfo', 'skinTone', 'disability', 'bloodGroup'],
      ['height']),
    auth: state.firebase.auth,
    initialValues: state.firebase.profile ? state.firebase.profile.basicInfo : {},
    formValues: selector(state, 'healthInfo', 'healthInfoText')
  }
}

export default compose(
connect(mapStateToProps),
reduxForm({
  form: 'basicInfo',
  validate,
  onSubmit
})
)(BasicInfoForm);