import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, makeStyles, Typography, Fab } from '@material-ui/core';
import { reduxForm, Field, SubmissionError, formValueSelector } from "redux-form";
import SelectInput from '../../../library/form/SelectInput';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { systemSelector } from '../../../../store/selectors/systemSelector';
import { actionTypes } from '../../../../store/actions/ProfileActions';
import FormMessage from '../../../library/FormMessage';
import TextInput from '../../../library/form/TextInput';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import CheckboxInput from '../../../library/form/CheckboxInput';
import AutoComplete from '../../../library/form/AutoComplete';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  roundBtn: {
    position: "absolute",
    right: '1px'
  }
}))

const EducationCareerForm = (props) => {
  const classes = useStyles();
  const [secondCollege, setSecondCollege] = useState(false);
  useEffect(() => {
    if(props.initialValues && props.initialValues.college2)
      setSecondCollege(true);
  }, [props.initialValues]);
  const { system, cancel, change, formValues, handleSubmit, pristine, submitting, error, invalid } = props;
  return (
      <Box minWidth={280} maxWidth={400} my={2}>
        <form onSubmit={handleSubmit}>
          <Box mb={2} display="flex" flexWrap="wrap" justifyContent="space-between">
            <Box width={{xs: "100%", sm: "45%"}} >
              <Field 
                component={SelectInput}
                options={system.educationLevel}
                label="Education Level"
                id="education-level"
                name="educationLevel"
                fullWidth={true}
              />
            </Box>
            <Box width={{xs: "100%", sm: "5%"}} alignSelf="flex-end" textAlign="center" mt={{xs: 2, sm: 0}}>
              <Typography variant="body1">in</Typography>
            </Box>
            <Box width={{xs: "100%", sm: "45%"}} >
              <Field 
                component={SelectInput}
                options={system.educationField}
                label="Education Field"
                id="education-field"
                name="educationField"
                fullWidth={true}
              />
            </Box>
          </Box>
          <Box mb={2} position="relative">
            <Field 
              component={TextInput}
              label="College/University Attended"
              id="college-uni-1"
              name="college1"
              fullWidth={true}
            />
            { 
              secondCollege ? null :
              <Fab size="small" color="primary" className={classes.roundBtn} onClick={()=> setSecondCollege(true)}>
                <AddIcon />
              </Fab>
            }
          </Box>
          {
            !secondCollege ? null : 
            <Box mb={2} position="relative">
              <Field 
                component={TextInput}
                label="Second College/University Attended"
                id="college-uni-2"
                name="college2"
                fullWidth={true}
              />
              <Fab size="small" color="secondary" className={classes.roundBtn} onClick={()=> {setSecondCollege(false); change('college2', '')}}>
                <RemoveIcon />
              </Fab>
            </Box>
          }
          <Box mb={2}>
            <Field 
              component={SelectInput}
              options={system.workingWith}
              label="Working With"
              id="working-with"
              name="workingWith"
              fullWidth={true}
            />
          </Box>
          {
            formValues.workingWith && formValues.workingWith !== 5 ?// 5=Not working
            <React.Fragment>
              {
              formValues.workingWith && formValues.workingWith === 1 ?
              <Box mb={2}>
                <Field 
                  component={TextInput}
                  label="Employer Name"
                  id="employerName"
                  name="employerName"
                  fullWidth={true}
                />
              </Box>
              : null
              }
              <Box mb={2}>
                <Field 
                  component={AutoComplete}
                  options={system.occupations}
                  label="Working As"
                  id="working-as"
                  name="workingAs"
                  placeholder="Select occupation"
                  fullWidth={true}
                />
              </Box>
              <Box mb={2}>
                <Field 
                  component={SelectInput}
                  options={system.annualIncome}
                  label="Annual Income"
                  id="annual-income"
                  name="annualIncome"
                  fullWidth={true}
                />
              </Box>
              {
                formValues.annualIncome && formValues.annualIncome !== 13 && formValues.annualIncome !== 14 ?
                <Box mb={2}>
                  <Field 
                    component={CheckboxInput}
                    label="Keep Income private"
                    name="hideIncome"
                  />
                </Box>
                : null
              }
            </React.Fragment>
            :
            null
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

const validate = values => {
  const errors = {}
  return errors;
}

const onSubmit = (values, dispatch, props) => {
  const data = {
    profileId: props.profileId,
    payload: {
      educationCareer: values
    }
  }
  return axios.post('/api/profile', data).then( response => {
    if(response.data.success)
      dispatch({
        type: actionTypes.PROFILE_EDUCATION_CAREER_UPDATED,
        data: values
      });
    props.formSubmitted();
  }).catch(err => {
    throw new SubmissionError({
      _error: err.response && err.response.data.message ? err.response.data.message: err.message
    });
  })
}

const selector = formValueSelector('educationCareer');

const mapStateToProps = state => {
  return {
    system: systemSelector(state, ['educationLevel', 'educationField', 'workingWith', 'occupations', 'annualIncome']),
    auth: state.auth,
    initialValues: state.profile ? state.profile.educationCareer : {},
    profileId: state.profile._id ? state.profile._id : null,
    formValues: selector(state, 'workingWith', 'annualIncome', 'college2')
  }
}

export default compose(
connect(mapStateToProps),
reduxForm({
  form: 'educationCareer',
  onSubmit,
  validate
})
)(EducationCareerForm);