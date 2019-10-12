import React, { useState, useEffect } from 'react';
import { Box,  Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { Field, formValueSelector, change } from 'redux-form';
import { systemSelector } from '../../../store/selectors/systemSelector';
import AutoComplete from '../../library/form/AutoComplete';
import { automCompleteFormat, automCompleteNormalize } from '../../../utils';

const LocationPreference = (props) => {
  const { system, formValues } = props;
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if(!formValues.country)
    {
      setStates([]);
      change('partnerPreference', 'state', null);
    }
  }, [formValues.country])

  useEffect(() => {
    if(!formValues.state)
    {
      setCities([]);
      change('partnerPreference', 'city', null);
    }
  }, [formValues.state])

  return (
    <>
      <Box mb={2} display="flex">
        <Box width="20%" alignSelf="center"> <Typography>Country living in</Typography> </Box>
        <Box width="80%">
            <Field 
              component={AutoComplete}
              options={system.countries}
              id="country"
              name="country"
              fullWidth={true}
              isMulti={true}
              format={automCompleteFormat}
              normalize={automCompleteNormalize}
            />
          </Box>
      </Box>
      { formValues.country && states.length ?
        <Box mb={2} display="flex">
          <Box width="20%" alignSelf="center"> <Typography> State living in </Typography> </Box>
          <Box width="80%">
              <Field 
                component={AutoComplete}
                options={states}
                id="state"
                name="state"
                fullWidth={true}
                isMulti={true}
                format={automCompleteFormat}
                normalize={automCompleteNormalize}
              />
            </Box>
        </Box>
        : null
      }

      { formValues.state && cities.length ?
        <Box mb={2} display="flex">
          <Box width="20%" alignSelf="center"> <Typography> City living in </Typography> </Box>
          <Box width="80%">
              <Field 
                component={AutoComplete}
                options={cities}
                id="city"
                name="city"
                fullWidth={true}
                isMulti={true}
                format={automCompleteFormat}
                normalize={automCompleteNormalize}
              />
            </Box>
        </Box>
        : null
      }
    </>
  );
}

const selector = formValueSelector('partnerPreference');

const mapStateToProps = (state) => {
  const system = systemSelector(state, ['countries']);
  const optionalFields = ['countries'];
  optionalFields.forEach(field => {
    if(system[field].length && system[field][0].id !== null)
      system[field].unshift({
        id: null,
        title: "Doesn't matter"
      });
  })
  return {
    system: system,
    formValues: selector(state, 'country', 'state', 'city')
  }
}
 
export default connect(mapStateToProps)(LocationPreference);