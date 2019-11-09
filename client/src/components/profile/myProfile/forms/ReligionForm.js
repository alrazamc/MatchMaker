import React from 'react';
import { Box, Button, CircularProgress, FormHelperText, makeStyles } from '@material-ui/core';
import { reduxForm, Field, SubmissionError, formValueSelector } from "redux-form";
import SelectInput from '../../../library/form/SelectInput';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { systemSelector } from '../../../../store/selectors/systemSelector';
import { actionTypes } from '../../../../store/actions/ProfileActions';
import FormMessage from '../../../library/FormMessage';
import RadioInput from '../../../library/form/RadioInput';
import TextInput from '../../../library/form/TextInput';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}))

const ReligionForm = (props) => {
  const classes = useStyles();
  const { system, cancel, formValues, initialValues, handleSubmit, pristine, submitting, error, invalid } = props;
  let communities = !formValues.religion ? [] : system.communities.filter(item => (item.religion === formValues.religion) );
  // communities = communities.sort((a, b) => parseInt(a.id) - parseInt(b.id));
  // let languages = [...system.languages];
  // languages = languages.sort((a, b) => parseInt(a.id) - parseInt(b.id));
  return (
      <Box minWidth={280} maxWidth={400} my={2}>
        <form onSubmit={handleSubmit}>
          {
            initialValues && initialValues.religion ? null : 
            <Box mb={2}>
              <Field 
                  component={SelectInput}
                  options={system.religions}
                  label="Religion"
                  id="religion"
                  name="religion"
                  fullWidth={true}
                  autoFocus={true}
                />
              <FormHelperText>
                Choose carefully, can't be changed later
              </FormHelperText>
            </Box>
          }
          {
            initialValues && initialValues.community ? null :
            (
              communities.length > 0 &&
            <Box mb={2}>
              <Field 
                component={SelectInput}
                options={communities}
                label="Community"
                id="community"
                name="community"
                fullWidth={true}
              />
              <FormHelperText>
                Choose carefully, can't be changed later
              </FormHelperText>
            </Box>
            )
          }
          <Box mb={2}>
            <Field 
              component={SelectInput}
              options={system.languages}
              label="Mother Tongue"
              id="mother-tongue"
              name="motherTongue"
              fullWidth={true}
            />
          </Box>
          <Box mb={2}>
            <Field 
              component={TextInput}
              label="Caste"
              id="caste"
              name="caste"
              fullWidth={true}
            />
          </Box>
          { formValues.religion !== 1 ? null :  //1=> Islam
            <React.Fragment>
              <Box mb={2}>
                <Field 
                  component={SelectInput}
                  options={system.namaaz}
                  label="Namaaz/Salaah"
                  id="namaaz"
                  name="namaaz"
                  fullWidth={true}
                />
              </Box>
              <Box mb={2}>
                <Field 
                  component={RadioInput}
                  options={system.yesNo}
                  label="Zakaat"
                  id="zakaat"
                  name="zakaat"
                  fullWidth={true}
                  />
              </Box>
              <Box mb={2}>
                <Field 
                  component={RadioInput}
                  options={system.yesNo}
                  label="Fasting in Ramadan"
                  id="fasting"
                  name="fasting"
                  fullWidth={true}
                  />
              </Box>
            </React.Fragment>
          }
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
      religionCaste: values
    }
  }
  return axios.post('/api/profile', data).then( response => {
    if(response.data.success)
      dispatch({
        type: actionTypes.PROFILE_RELIGION_CASTE_UPDATED,
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
  if(!values.religion)
    errors.religion = 'Required';
  if(!values.motherTongue)
    errors.motherTongue = 'Required';
  return errors;
}

const selector = formValueSelector('religionCaste');

const mapStateToProps = state => {
  return {
    system: systemSelector(state, ['religions', 'communities', 'languages', 'namaaz', 'yesNo']),
    auth: state.auth,
    initialValues: state.profile ? state.profile.religionCaste : {},
    profileId: state.profile._id ? state.profile._id : null,
    formValues: selector(state, 'religion', 'caste')
  }
}

export default compose(
connect(mapStateToProps),
reduxForm({
  form: 'religionCaste',
  validate,
  onSubmit
})
)(ReligionForm);