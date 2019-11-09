import React, { useMemo } from 'react';
import { FormHelperText } from '@material-ui/core';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';
import { systemSelector } from '../../../store/selectors/systemSelector';
import AutoComplete from '../../library/form/AutoComplete';
import { automCompleteFormat, automCompleteNormalize } from '../../../utils';
import SelectInput from '../../library/form/SelectInput';
import CheckboxInput from '../../library/form/CheckboxInput';
import FormRow from '../../library/form/FormRow';

const EducationCareerPreference = (props) => {
  const { system, formValues, educatedIn=false } = props;
  let { educationLevel, educationField, workingWith, occupations, annualIncome } = system;
  educationLevel = useMemo(() => {
    if(educationLevel.length === 0) return educationLevel;
    return [{
      id: null,
      title: "Doesn't matter"
    }, ...educationLevel];
  }, [educationLevel]);

  educationField = useMemo(() => {
    if(educationField.length === 0) return educationField;
    return [{
      id: null,
      title: "Doesn't matter"
    }, ...educationField];
  }, [educationField]);

  workingWith = useMemo(() => {
    if(workingWith.length === 0) return workingWith;
    return [{
      id: null,
      title: "Doesn't matter"
    }, ...workingWith];
  }, [workingWith]);

  occupations = useMemo(() => {
    if(occupations.length === 0) return occupations;
    return [{
      id: null,
      title: "Doesn't matter"
    }, ...occupations];
  }, [occupations]);

  annualIncome = useMemo(() => {
    if(annualIncome.length === 0) return annualIncome;
    let income = [{
      id: null,
      title: "Doesn't matter"
    }, ...annualIncome];
    if(income.length > 13){
      income.pop(); // Remove Don't want to specify option
    }
    return income;
  }, [annualIncome]);
  return (
    <>
      <FormRow label="Education">
        <Field 
          component={AutoComplete}
          options={educationLevel}
          id="education-level" name="educationLevel"
          fullWidth={true} isMulti={true}
          format={automCompleteFormat}
          normalize={automCompleteNormalize}
        />
      </FormRow>
      {
        !educatedIn ? null :
        <FormRow label="Education Area">
          <Field 
            component={AutoComplete}
            options={educationField}
            id="education-field" name="educationField"
            fullWidth={true} isMulti={true}
            format={automCompleteFormat}
            normalize={automCompleteNormalize}
          />
        </FormRow>
      }
      <FormRow label="Working With">
        <Field 
          component={AutoComplete}
          options={workingWith}
          id="working-with" name="workingWith"
          fullWidth={true} isMulti={true}
          format={automCompleteFormat}
          normalize={automCompleteNormalize}
        />
      </FormRow>
      <FormRow label="Profession Area">
        <Field 
          component={AutoComplete}
          options={occupations}
          id="working-as" name="workingAs"
          fullWidth={true} isMulti={true}
          format={automCompleteFormat}
          normalize={automCompleteNormalize}
        />
        { formValues.workingAs ?
            <FormHelperText>
              This selection will significantly reduce the number of matches.
              "Doesn't matter" option is recomended
            </FormHelperText> : null
        }
      </FormRow>
      <FormRow label="Minimum Annual Income">
        <Field 
          component={SelectInput}
          options={annualIncome}
          id="annual-income" name="annualIncome"
          fullWidth={true} displayEmpty={true}
          renderValue={(value) => {
            const selected = system.annualIncome.find(item => item.id === value);
            return selected ? selected.title : "Doesn't matter";
          }}
        />
      </FormRow>
      {
        formValues.annualIncome ?
        <FormRow label="">
          <Field 
            component={CheckboxInput}
            label="Include Profiles who have not specified their income"
            name="noIncomeProfiles"
          />
        </FormRow>
        : null
      }
    </>
  );
}

const mapStateToProps = (state, props) => {
  const selector = formValueSelector(props.formName);
  return {
    system: systemSelector(state, ['educationLevel', 'educationField', 'workingWith', 'occupations', 'annualIncome']),
    formValues: selector(state, 'annualIncome', 'workingAs')
  }
}
 
export default connect(mapStateToProps)(EducationCareerPreference);