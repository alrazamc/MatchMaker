import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, makeStyles } from '@material-ui/core';
import { reduxForm, Field, SubmissionError, formValueSelector, change } from "redux-form";
import { compose } from 'redux';
import { connect } from 'react-redux';
import { systemSelector } from '../../../store/selectors/systemSelector';
import { getFirestore } from 'redux-firestore';
import { profileLocationUpdated } from '../../../store/actions/ProfileActions';
import FormMessage from '../../library/FormMessage';
import TextInput from '../../library/form/TextInput';
import AutoComplete from '../../library/form/AutoComplete';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  roundBtn: {
    position: "absolute",
    right: '1px'
  }
}))

const LocationForm = ({ system, cancel, formValues, initialValues, handleSubmit, pristine, submitting, error, invalid }) => {
  const classes = useStyles();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  //get states for select country
  useEffect(() => {
    if(!formValues.country)
      return;
    getFirestore().collection('system').doc('states').collection('choices').where("country_id", '==', formValues.country).get().then(snapshot => {
      const records = [];
      snapshot.forEach(doc => records.push(doc.data()));
        setStates(records);
        if(initialValues && formValues.country !== initialValues.country)
        {
          change('location', 'state', {});change('location', 'city', {});
          setCities([]);
        }
      })
  }, [formValues.country, initialValues]);

  //Get cities for select state
  useEffect(() => {
    if(!formValues.state || !formValues.state.id)
      return;
    getFirestore().collection('system').doc('cities').collection('choices').where("state_id", '==', formValues.state.id).get().then(snapshot => {
      const records = [];
      snapshot.forEach(doc => records.push(doc.data()));
        setCities(records);
        if(initialValues && formValues.state !== initialValues.state)
        {
          change('location', 'city', {});
        }
      })
  }, [formValues.state, initialValues]);



  return (
      <Box minWidth={280} maxWidth={400} my={2}>
        <form onSubmit={handleSubmit} autoComplete="false">
          <Box mb={2}>
            <Field 
              component={AutoComplete}
              options={system.countries}
              label="Country"
              id="country"
              name="country"
              placeholder="Select Country"
              fullWidth={true}
            />
          </Box>
          <Box mb={2}>
            <Field 
              component={AutoComplete}
              options={states}
              label="State"
              id="state"
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
              label="City"
              id="city"
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
  const update = {
    lastUpdated: getFirestore().FieldValue.serverTimestamp(),
    location: values
  }
  return getFirestore().collection('users').doc(props.auth.uid).set(update, {merge: true}).then(response => {
    props.formSubmitted();
    dispatch(profileLocationUpdated());
  }).catch(err => {
    throw new SubmissionError({
      _error: err.message
    });
  })
}

const selector = formValueSelector('location');

const mapStateToProps = state => {
  return {
    system: systemSelector(state, ['countries']),
    auth: state.firebase.auth,
    initialValues: state.firebase.profile ? state.firebase.profile.location : {},
    formValues: selector(state, 'country', 'state', 'city')
  }
}

export default compose(
connect(mapStateToProps),
reduxForm({
  form: 'location',
  onSubmit,
  validate
})
)(LocationForm);