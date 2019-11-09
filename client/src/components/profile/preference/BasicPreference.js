import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';
import RangeSliderInput from '../../library/form/RangeSliderInput';
import { systemSelector } from '../../../store/selectors/systemSelector';
import AutoComplete from '../../library/form/AutoComplete';
import { automCompleteFormat, automCompleteNormalize } from '../../../utils';
import FormRow from '../../library/form/FormRow';

const BasicPreference = (props) => {
  const { system, formValues } = props;
  let communities = !formValues.religion ? [] : system.communities.filter(item => formValues.religion.includes(item.religion) && item.title !== "Other" );
  if(communities.length)
    communities.unshift({
      id: null,
      title: "Doesn't matter"
    });
  let { maritalStatus, religions, languages } = system;
  maritalStatus = useMemo(() => {
    if(maritalStatus.length === 0) return maritalStatus;
    return [{
      id: null,
      title: "Doesn't matter"
    }, ...maritalStatus];
  }, [maritalStatus]);
  religions = useMemo(() => {
    if(religions.length === 0) return religions;
    return [{
      id: null,
      title: "Doesn't matter"
    }, ...religions];
  }, [religions]);
  languages = useMemo(() => {
    if(languages.length === 0) return languages;
    return [{
      id: null,
      title: "Doesn't matter"
    }, ...languages];
  }, [languages]);

  return (
    <>
      <FormRow label="Age">
          <Field 
            component={RangeSliderInput} name="age"
            fromLabel={(value) => (`From ${value} Years`)}
            toLabel={(value) => (`To ${value} Years`)}
            fullWidth={true}  step={1} min={18} max={66}
            defaultValue={[18, 30]}
            valueLabelDisplay="off"
          />
      </FormRow>
      <FormRow label="Height">
        <Field 
          component={RangeSliderInput} name="height"
          fromLabel={(value) => (`From ${ system.height.length && system.height[value]  && system.height[value].labelSymbol }`)}
          toLabel={(value) => (`To ${ system.height.length && system.height[value] && system.height[value].labelSymbol }`)}
          fullWidth={true} step={1}  marks={system.height} max={system.height.length - 1}
          defaultValue={[6, 18]}
          valueLabelDisplay="off"
        />
      </FormRow>
      <FormRow label="Marital Status">
        <Field 
          component={AutoComplete}
          options={maritalStatus}
          id="marital-status" name="maritalStatus"
          fullWidth={true} isMulti={true}
          format={automCompleteFormat}
          normalize={automCompleteNormalize}
        />
      </FormRow>
      <FormRow label="Religion">
        <Field 
          component={AutoComplete}
          options={religions}
          id="religion" name="religion" fullWidth={true} isMulti={true}
          format={automCompleteFormat}
          normalize={automCompleteNormalize}
        />
      </FormRow>
      { formValues.religion && communities.length ?
        <FormRow label="Community">
          <Field 
            component={AutoComplete}
            options={communities}
            id="community" name="community"
            fullWidth={true} isMulti={true}
            format={automCompleteFormat}
            normalize={automCompleteNormalize}
          />
        </FormRow>
        : null
      }
      <FormRow label="Mother Tongue">
        <Field 
          component={AutoComplete}
          options={languages}
          id="mother-tongue" name="motherTongue"
          fullWidth={true} isMulti={true}
          format={automCompleteFormat}
          normalize={automCompleteNormalize}
        />
      </FormRow>
    </>
  );
}



const mapStateToProps = (state, props) => {
  const selector = formValueSelector(props.formName);
  return {
    system: systemSelector(state, ['height', 'maritalStatus', 'religions', 'communities', 'languages']),
    formValues: { religion:  selector(state, 'religion') }
  }
}
 
export default connect(mapStateToProps)(BasicPreference);