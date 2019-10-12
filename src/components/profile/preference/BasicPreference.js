import React from 'react';
import { Box,  Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';
import RangeSliderInput from '../../library/form/RangeSliderInput';
import { systemSelector } from '../../../store/selectors/systemSelector';
import AutoComplete from '../../library/form/AutoComplete';
import { automCompleteFormat, automCompleteNormalize } from '../../../utils';

const BasicPreference = (props) => {
  const { system, formValues } = props;
  let communities = !formValues.religion ? [] : system.communities.filter(item => formValues.religion.includes(item.religion) && item.title !== "Other" );
  if(communities.length)
    communities.unshift({
      id: null,
      title: "Doesn't matter"
    });
  return (
    <>
      <Box mb={2} display="flex">
        <Box width="20%" alignSelf="center"> <Typography> Age </Typography> </Box>
        <Box width="80%">
          <Field 
            component={RangeSliderInput}
            name="age"
            fromLabel={(value) => (`From ${value} Years`)}
            toLabel={(value) => (`To ${value} Years`)}
            fullWidth={true}
            step={1}
            min={18}
            max={66}
            defaultValue={[18, 30]}
            valueLabelDisplay="off"
          />
        </Box>
      </Box>
      <Box mb={2} display="flex">
        <Box width="20%" alignSelf="center"> <Typography> Height </Typography> </Box>
        <Box width="80%">
          <Field 
            component={RangeSliderInput}
            name="height"
            fromLabel={(value) => (`From ${ system.height.length && system.height[value].labelSymbol }`)}
            toLabel={(value) => (`To ${ system.height.length && system.height[value].labelSymbol }`)}
            fullWidth={true}
            step={1}
            marks={system.height}
            max={system.height.length - 1}
            defaultValue={[38, 49]}
            valueLabelDisplay="off"
          />
        </Box>
      </Box>
      <Box mb={2} display="flex">
        <Box width="20%" alignSelf="center"> <Typography>Marital Status</Typography> </Box>
        <Box width="80%">
            <Field 
              component={AutoComplete}
              options={system.maritalStatus}
              id="marital-status"
              name="maritalStatus"
              fullWidth={true}
              isMulti={true}
              format={automCompleteFormat}
              normalize={automCompleteNormalize}
            />
          </Box>
      </Box>
      <Box mb={2} display="flex">
        <Box width="20%" alignSelf="center"> <Typography>Religion</Typography> </Box>
        <Box width="80%">
            <Field 
              component={AutoComplete}
              options={system.religions}
              id="religion"
              name="religion"
              fullWidth={true}
              isMulti={true}
              format={automCompleteFormat}
              normalize={automCompleteNormalize}
            />
          </Box>
      </Box>
      { formValues.religion && communities.length ?
        <Box mb={2} display="flex">
          <Box width="20%" alignSelf="center"> <Typography>Community</Typography> </Box>
          <Box width="80%">
              <Field 
                component={AutoComplete}
                options={communities}
                id="community"
                name="community"
                fullWidth={true}
                isMulti={true}
                format={automCompleteFormat}
                normalize={automCompleteNormalize}
              />
            </Box>
        </Box>
        : null
      }
      <Box mb={2} display="flex">
        <Box width="20%" alignSelf="center"> <Typography>Mother Tongue</Typography> </Box>
        <Box width="80%">
            <Field 
              component={AutoComplete}
              options={system.languages}
              id="mother-tongue"
              name="motherTongue"
              fullWidth={true}
              isMulti={true}
              format={automCompleteFormat}
              normalize={automCompleteNormalize}
            />
          </Box>
      </Box>
    </>
  );
}

const selector = formValueSelector('partnerPreference');

const mapStateToProps = (state) => {
  const system = systemSelector(state, ['height', 'maritalStatus', 'religions', 'communities', 'languages']);
  const optionalFields = ['maritalStatus', 'religions', 'languages'];
  optionalFields.forEach(field => {
    if(system[field].length && system[field][0].id !== null)
      system[field].unshift({
        id: null,
        title: "Doesn't matter"
      });
  })
  return {
    system: system,
    formValues: { religion:  selector(state, 'religion') }
  }
}
 
export default connect(mapStateToProps)(BasicPreference);