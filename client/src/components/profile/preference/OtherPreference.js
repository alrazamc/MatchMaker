import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import { systemSelector } from '../../../store/selectors/systemSelector';
import CheckboxGroup from '../../library/form/CheckboxGroup';
import FormRow from '../../library/form/FormRow';

const EducationCareerPreference = (props) => {
  let { profileCreatedBy, diet } = props.system;
  profileCreatedBy = useMemo(() => {
    if(profileCreatedBy.length === 0) return profileCreatedBy;
    return [{
      id: null,
      title: "Doesn't matter"
    }, ...profileCreatedBy];
  }, [profileCreatedBy]);
  diet = useMemo(() => {
    if(diet.length === 0) return diet;
    return [{
      id: null,
      title: "Doesn't matter"
    }, ...diet];
  }, [diet]);
  return (
    <>
      <FormRow label="Profile Created By">
        <Field 
          component={CheckboxGroup}
          options={profileCreatedBy}
          id="profileCreatedBy"
          name="profileCreatedBy"
          fullWidth={true}
          />
      </FormRow>
      <FormRow label="Diet">
        <Field 
          component={CheckboxGroup}
          options={diet}
          id="diet"
          name="diet"
          fullWidth={true}
          />
      </FormRow>
    </>
  );
}


const mapStateToProps = (state) => {
  return {
    system: systemSelector(state, ['profileCreatedBy', 'diet'])
  }
}
 
export default connect(mapStateToProps)(EducationCareerPreference);