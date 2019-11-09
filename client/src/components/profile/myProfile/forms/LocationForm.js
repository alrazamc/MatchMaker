import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, makeStyles } from '@material-ui/core';
import { reduxForm, Field, SubmissionError, formValueSelector, change } from "redux-form";
import { compose } from 'redux';
import { connect } from 'react-redux';
import { systemSelector } from '../../../../store/selectors/systemSelector';
import { actionTypes } from '../../../../store/actions/ProfileActions';
import FormMessage from '../../../library/FormMessage';
import TextInput from '../../../library/form/TextInput';
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

const LocationForm = ({ dispatch, system, cancel, formValues, initialValues, handleSubmit, pristine, submitting, error, invalid }) => {
  const classes = useStyles();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  //Load states on country change
  useEffect(() => {
    if(!formValues.country)
    {
      dispatch(change('location', 'state', {}));
      setStates([]);
      return;
    }
    axios.get('/api/system/states', { params: {countryId: formValues.country}}).then(response => {
      setStates(response.data);
      if(initialValues && formValues.country !== initialValues.country )
      {
        dispatch(change('location', 'state', {}));
      }
    });
  }, [formValues.country, initialValues, dispatch]);

  //Load cities on state change
  useEffect(() => {
    if(!formValues.state || !formValues.state.id)
    {
      dispatch(change('location', 'city', {}));
      setCities([]);
      return;
    }
    axios.get('/api/system/cities', { params: {stateId: formValues.state.id}}).then(response => {
      setCities(response.data);
      if(initialValues && initialValues.state && formValues.state.id !== initialValues.state.id)
      {
        dispatch(change('location', 'city', {}));
      }
    });
  }, [formValues.state, initialValues, dispatch]);

  //init Form 
  useEffect(() => {
    if(!initialValues) return;
    if(initialValues.state && initialValues.state.id)
      dispatch(change('location', 'state', initialValues.state ));
    if(initialValues.city && initialValues.city.id)
      dispatch(change('location', 'city', initialValues.city ));
  }, [initialValues, dispatch])


  return (
      <Box minWidth={280} maxWidth={400} my={2}>
        <form onSubmit={handleSubmit} autoComplete="false">
          <Box mb={2}>
            <Field 
              component={AutoComplete}
              options={system.countries}
              name="country"
              placeholder="Select Country"
              fullWidth={true}
            />
          </Box>
          <Box mb={2}>
            <Field 
              component={AutoComplete}
              options={states}
              name="state"
              placeholder="Select State"
              fullWidth={true}
              normalize={ id => {
                if(!id) return {};
                let [state] = states.filter(item => (item.id === id))
                return {id: state.id, name: state.title}
              }
              }
              format={ state => (state && state.id ? state.id : "")}
            />
          </Box>
          <Box mb={2}>
            <Field 
              component={AutoComplete}
              options={cities}
              name="city"
              placeholder="Select city"
              fullWidth={true}
              normalize={ id => {
                if(!id) return {};
                let [city] = cities.filter(item => (item.id === id))
                return {id: city.id, name: city.title}
              }
              }
              format={ city => (city && city.id ? city.id : "")}
            />
          </Box>
          <Box mb={2}>
            <Field 
              component={TextInput}
              label="Zip/Pin Code"
              id="zip-code"
              name="zipCode"
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
  if(!values.country)
    errors.country = 'Required';
  return errors;
}

const onSubmit = (values, dispatch, props) => {
  const data = {
    profileId: props.profileId,
    payload: {
      location: values
    }
  }
  return axios.post('/api/profile', data).then( response => {
    if(response.data.success)
      dispatch({
        type: actionTypes.PROFILE_LOCATION_UPDATED,
        data: values
      });
    props.formSubmitted();
  }).catch(err => {
    throw new SubmissionError({
      _error: err.response && err.response.data.message ? err.response.data.message: err.message
    });
  })
}

const selector = formValueSelector('location');

const mapStateToProps = state => {
  return {
    system: systemSelector(state, ['countries']),
    auth: state.auth,
    initialValues: state.profile ? state.profile.location : {},
    profileId: state.profile._id ? state.profile._id : null,
    formValues: selector(state, 'country', 'state', 'city')
  }
}

export default compose(
connect(mapStateToProps, {change}),
reduxForm({
  form: 'location',
  onSubmit,
  validate
})
)(LocationForm);