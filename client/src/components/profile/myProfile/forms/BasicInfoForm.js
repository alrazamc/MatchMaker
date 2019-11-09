import React, { useState } from 'react';
import { Box, Button, CircularProgress, FormHelperText, InputAdornment, makeStyles } from '@material-ui/core';
import { reduxForm, Field, SubmissionError, formValueSelector } from "redux-form";
import SelectInput from '../../../library/form/SelectInput';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { systemSelector } from '../../../../store/selectors/systemSelector';
import { actionTypes } from '../../../../store/actions/ProfileActions';
import FormMessage from '../../../library/FormMessage';
import DateInput from '../../../library/form/DateInput';
import dayjs from 'dayjs';
import RadioInput from '../../../library/form/RadioInput';
import SliderInput from '../../../library/form/SliderInput';
import TextInput from '../../../library/form/TextInput';
import axios from 'axios';

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
          <Box display="flex" flexWrap="wrap" justifyContent="space-between">
            <Box mb={2} width={{xs: "100%", sm: "49%"}}>
              <Field
                component={TextInput}
                id="first-name"
                name="firstName"
                label="First Name"
                fullWidth={true}
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
              />
            </Box>
          </Box>
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
              label="Body Weight"
              id="body-weight"
              name="bodyWeight"
              fullWidth={true}
              InputProps={{
                endAdornment:<InputAdornment position="end">Kgs</InputAdornment>
              }}
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
          { formValues.healthInfo === 7 &&
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
  const data = {
    profileId: props.profileId,
    payload: {
      basicInfo: values
    }
  }
  return axios.post('/api/profile', data).then( response => {
    if(response.data.success)
      dispatch({
        type: actionTypes.PROFILE_BASIC_INFO_UPDATED,
        data: values
      });
    props.formSubmitted();
  }).catch(err => {
    throw new SubmissionError({
      _error: err.response && err.response.data.message ? err.response.data.message: err.message
    });
  })
}

const validate = values => {
  const errors = {};
  const required = ['firstName', 'lastName', 'profileCreatedBy', 'dateOfBirth', 'gender', 'maritalStatus', 'height'];
  required.forEach(item => {
    if(!values[item])
      errors[item] = 'Required';
  });
  if(values.bodyWeight && isNaN(values.bodyWeight))
    errors.bodyWeight = 'Should be a number';
  return errors;
}

const selector = formValueSelector('basicInfo');

const mapStateToProps = state => {
  return {
    system: systemSelector(state, ['profileCreatedBy', 'gender', 'maritalStatus', 'height', 'bodyType', 'healthInfo', 'skinTone', 'disability', 'bloodGroup'],
      ['height']),
    auth: state.auth,
    initialValues: state.profile ? state.profile.basicInfo : {},
    profileId: state.profile._id ? state.profile._id : null,
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