import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FormHelperText } from '@material-ui/core';
import { connect } from 'react-redux';
import { Field, formValueSelector, change } from 'redux-form';
import { systemSelector } from '../../../store/selectors/systemSelector';
import AutoComplete from '../../library/form/AutoComplete';
import { automCompleteFormat, automCompleteNormalize } from '../../../utils';
import axios from 'axios';
import FormRow from '../../library/form/FormRow';

const LocationPreference = (props) => {
  const { system, formValues, dispatch, initialValues } = props;
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const countryRef = useRef();
  const stateRef = useRef();

  //Load states on country change
  useEffect(() => {
    if(formValues.country === countryRef.current) // run hook only on country change
      return;
    else
      countryRef.current = formValues.country;
    if(!formValues.country)
    {
      dispatch(change(props.formName, 'state', null));
      setStates([]);
      return;
    }
    axios.get('/api/system/states', { params: {ids: formValues.country}}).then(response => {
      response.data.unshift({
        id: null,
        title: "Doesn't matter"
      });
      setStates(response.data);
      if(initialValues && JSON.stringify(formValues.country) !== JSON.stringify(initialValues.country) )
      {
        let stateIds = [];
        response.data.forEach(state => {
          if(formValues.state && formValues.state.includes(state.id))
            stateIds.push(state.id)
        })
        if(stateIds.length === 0)
          dispatch(change(props.formName, 'state', null));
        else if(JSON.stringify(stateIds) !== JSON.stringify(formValues.state))
          dispatch(change(props.formName, 'state', stateIds));
      }
    });
  }, [formValues.country, formValues.state, initialValues, dispatch, props.formName]); //state added due to linter warning

  //Load cities on state change
  useEffect(() => {
    if(formValues.state === stateRef.current) // run hook only on state change
      return;
    else
      stateRef.current = formValues.state;
    if(!formValues.state)
    {
      dispatch(change(props.formName, 'city', null));
      setCities([]);
      return;
    }
    axios.get('/api/system/cities', { params: {ids: formValues.state }}).then(response => {
      response.data.unshift({
        id: null,
        title: "Doesn't matter"
      });
      setCities(response.data);
      if(initialValues && JSON.stringify(formValues.state) !== JSON.stringify(initialValues.state))
      {
        let cityIds = [];
        response.data.forEach(city => {
          if(formValues.city && formValues.city.includes(city.id))
            cityIds.push(city.id)
        })
        if(cityIds.length === 0)
          dispatch(change(props.formName, 'city', null));
        else if(JSON.stringify(cityIds) !== JSON.stringify(formValues.city))
          dispatch(change(props.formName, 'city', cityIds));
      }
    });
  }, [formValues.state, formValues.city, initialValues, dispatch, props.formName]); //country added due to linter warning

  //init Form 
  useEffect(() => {
    if(!initialValues) return;
    if(initialValues.state)
      dispatch(change(props.formName, 'state', initialValues.state ));
    if(initialValues.city)
      dispatch(change(props.formName, 'city', initialValues.city ));
  }, [initialValues, dispatch, props.formName])

  let countries = useMemo(() => {
    if(system.countries.length === 0) return system.countries;
    return [{
      id: null,
      title: "Doesn't matter"
    }, ...system.countries]; 
  }, [system.countries])

  return (
    <>
      <FormRow label="Country living in">
        <Field 
          component={AutoComplete}
          options={countries}
          name="country" fullWidth={true} isMulti={true}
          format={automCompleteFormat}
          normalize={automCompleteNormalize}
        />
      </FormRow>
      { formValues.country && states.length ?
        <FormRow label="State living in">
          <Field 
            component={AutoComplete}
            options={states}
            name="state" fullWidth={true} isMulti={true}
            format={automCompleteFormat}
            normalize={automCompleteNormalize}
          />
        </FormRow>
        : null
      }

      { formValues.state && cities.length ?
        <FormRow label="City living in">
          <Field 
            component={AutoComplete}
            options={cities}
            name="city" fullWidth={true} isMulti={true}
            format={automCompleteFormat}
            normalize={automCompleteNormalize}
          />
          { formValues.city ?
            <FormHelperText>
              This selection will significantly reduce the number of matches.
              "Doesn't matter" option is recomended
            </FormHelperText> : null
          }
        </FormRow>
        : null
      }
    </>
  );
}

const mapStateToProps = (state, props) => {
  const selector = formValueSelector(props.formName);
  return {
    system: systemSelector(state, ['countries']),
    formValues: selector(state, 'country', 'state', 'city')
  }
}
 
export default connect(mapStateToProps)(LocationPreference);