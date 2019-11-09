import React from 'react';
import { Box, Button, CircularProgress, makeStyles, InputLabel } from '@material-ui/core';
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

const FamilyForm = (props) => {
  const classes = useStyles();
  const { system, cancel, formValues, handleSubmit, pristine, submitting, error, invalid } = props;
  return (
      <Box minWidth={280} maxWidth={400} my={2}>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <Field 
              component={SelectInput}
              options={system.fatherStatus}
              label="Father's Status"
              id="father-status"
              name="fatherStatus"
              fullWidth={true}
            />
          </Box>
          {
            formValues.fatherStatus === 1 || formValues.fatherStatus === 3  ? // 1=Employed 2=Retired
            <React.Fragment>
              <Box mb={2}>
                <Field 
                  component={TextInput}
                  label={formValues.fatherStatus === 1 ? 'With' : 'From'}
                  id="father-company-name"
                  name="fatherCompanyName"
                  placeholder="Father's company name"
                  fullWidth={true}
                />
              </Box>
              <Box mb={2}>
                <Field 
                  component={TextInput}
                  label="As"
                  id="father-company-position"
                  name="fatherCompanyPosition"
                  placeholder="Father's role in company"
                  fullWidth={true}
                />
              </Box>
            </React.Fragment>
            :
            null
          }
          {
            formValues.fatherStatus === 2  ? // 2=Business
              <Box mb={2}>
                <Field 
                  component={TextInput}
                  label="Father's Nature of Business"
                  id="father-business-nature"
                  name="fatherBusinessNature"
                  fullWidth={true}
                />
              </Box>
            :
            null
          }


          <Box mb={2}>
            <Field 
              component={SelectInput}
              options={system.motherStatus}
              label="Mother's Status"
              id="mother-status"
              name="motherStatus"
              fullWidth={true}
            />
          </Box>
          {
            formValues.motherStatus === 2 || formValues.motherStatus === 4  ? // 2=Employed 4=Retired
            <React.Fragment>
              <Box mb={2}>
                <Field 
                  component={TextInput}
                  label={formValues.motherStatus === 2 ? 'With' : 'From'}
                  id="mother-company-name"
                  name="motherCompanyName"
                  placeholder="Mother's company name"
                  fullWidth={true}
                />
              </Box>
              <Box mb={2}>
                <Field 
                  component={TextInput}
                  label="As"
                  id="mother-company-position"
                  name="motherCompanyPosition"
                  placeholder="Mother's role in company"
                  fullWidth={true}
                />
              </Box>
            </React.Fragment>
            :
            null
          }
          {
            formValues.motherStatus === 3  ? // 3=Business
              <Box mb={2}>
                <Field 
                  component={TextInput}
                  label="Mother's Nature of Business"
                  id="mother-business-nature"
                  name="motherBusinessNature"
                  fullWidth={true}
                />
              </Box>
            :
            null
          }
          <Box mb={2}>
            <Field 
              component={TextInput}
              label="Family Location"
              id="family-location"
              name="familyLocation"
              fullWidth={true}
              placeholder="Example: Lahore, Pakistan"
            />
          </Box>
          <Box mb={2}>
            <Field 
              component={TextInput}
              label="Native Place"
              id="native-place"
              name="familyNativePlace"
              fullWidth={true}
            />
          </Box>

          <Box mb={2} display="flex" flexWrap="wrap" justifyContent="space-between">
            <Box width="100%" >
              <InputLabel shrink>
                Number of Brothers
              </InputLabel>
            </Box>
            <Box width={{xs: "100%", sm: "49%"}} >
              <Field 
                component={TextInput}
                label="Not Married"
                id="not-married-brothers"
                name="notMarriedBrothers"
                fullWidth={true}
                variant="outlined"
                inputProps={{type: 'number', 'min': 0}}
                margin="dense"
              />
            </Box>
            <Box width={{xs: "100%", sm: "49%"}} >
              <Field 
                component={TextInput}
                label="Married"
                id="married-brothers"
                name="marriedBrothers"
                fullWidth={true}
                variant="outlined"
                inputProps={{type: 'number', 'min': 0}}
                margin="dense"
              />
            </Box>
          </Box>

          <Box mb={2} display="flex" flexWrap="wrap" justifyContent="space-between">
            <Box width="100%" >
              <InputLabel shrink>
                Number of Sisters
              </InputLabel>
            </Box>
            <Box width={{xs: "100%", sm: "49%"}} >
              <Field 
                component={TextInput}
                label="Not Married"
                id="not-married-sisters"
                name="notMarriedSisters"
                fullWidth={true}
                variant="outlined"
                inputProps={{type: 'number', 'min': 0}}
                margin="dense"
              />
            </Box>
            <Box width={{xs: "100%", sm: "49%"}} >
              <Field 
                component={TextInput}
                label="Married"
                id="married-sisters"
                name="marriedSisters"
                fullWidth={true}
                variant="outlined"
                inputProps={{type: 'number', 'min': 0}}
                margin="dense"
              />
            </Box>
          </Box>
          <Box mb={2}>
            <Field 
              component={RadioInput}
              options={system.familyType}
              label="Family Type"
              id="family-type"
              name="familyType"
              fullWidth={true}
              />
          </Box>
          <Box mb={2}>
            <Field 
              component={RadioInput}
              options={system.familyValues}
              label="Family Values"
              id="family-values"
              name="familyValues"
              fullWidth={true}
              />
          </Box>
          <Box mb={2}>
            <Field 
              component={SelectInput}
              options={system.familyAffluence}
              label="Family Affluence"
              id="famiy-affluence"
              name="familyAffluence"
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

const validate = values => {
  const errors = {}
  const fields = ['notMarriedBrothers', 'marriedBrothers', 'notMarriedSisters', 'marriedSisters'];
  fields.forEach(key => {
    if(!values[key]) return ;
    if(isNaN(values[key]))
      errors[key] = "Should be a number";
    else if(parseInt(values[key]) < 0)
      errors[key] = "Should be 0 or greater";
  });
  return errors;
}

const onSubmit = (values, dispatch, props) => {
  const data = {
    profileId: props.profileId,
    payload: {
      family: values
    }
  }
  return axios.post('/api/profile', data).then( response => {
    if(response.data.success)
      dispatch({
        type: actionTypes.PROFILE_FAMILY_INFO_UPDATED,
        data: values
      });
    props.formSubmitted();
  }).catch(err => {
    throw new SubmissionError({
      _error: err.response && err.response.data.message ? err.response.data.message: err.message
    });
  })
}

const selector = formValueSelector('familyInfo');

const mapStateToProps = state => {
  return {
    system: systemSelector(state, ['fatherStatus', 'motherStatus', 'familyType', 'familyValues', 'familyAffluence']),
    auth: state.auth,
    initialValues: state.profile ? state.profile.family : {},
    profileId: state.profile._id ? state.profile._id : null,
    formValues: selector(state, 'fatherStatus', 'motherStatus')
  }
}

export default compose(
connect(mapStateToProps),
reduxForm({
  form: 'familyInfo',
  onSubmit,
  validate
})
)(FamilyForm);