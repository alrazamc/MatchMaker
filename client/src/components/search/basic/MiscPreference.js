import React, { useMemo } from 'react';
import { Field  } from 'redux-form';
import { connect } from 'react-redux';
import CheckboxGroup from '../../library/form/CheckboxGroup';
import FormRow from '../../library/form/FormRow';
import CheckboxInput from '../../library/form/CheckboxInput';
import { systemSelector } from '../../../store/selectors/systemSelector';

const photoOptions = [{
  id: 1,
  title: "Visible to all"
},{
  id: 2,
  title: "Protected Photo"
}]

const MiscPreference = ({ profileCreatedBy, online=false, profileBy=false }) => {
  profileCreatedBy = useMemo(() => {
    if(profileCreatedBy.length === 0) return profileCreatedBy;
    return [{
      id: null,
      title: "Doesn't matter"
    }, ...profileCreatedBy];
  }, [profileCreatedBy]);
  return (
    <>
      { !online ? null : 
        <FormRow label="Online Status">
          <Field 
            component={CheckboxInput}
            label="Online Now"
            name="availableForChat"
            fullWidth={true}
            />
        </FormRow>
      }
      <FormRow label="Photo Settings">
        <Field 
          component={CheckboxGroup}
          options={photoOptions}
          name="visibility"
          fullWidth={true}
          />
      </FormRow>
      { !profileBy ? null : 
        <FormRow label="Profile Created by">
          <Field 
            component={CheckboxGroup}
            options={profileCreatedBy}
            name="profileCreatedBy"
            fullWidth={true}
            />
        </FormRow>
      }
      <FormRow label="Do Not Show">
        <Field 
          component={CheckboxInput}
          label="Profiles that have Filtered me out"
          name="notFilteredMe"
          fullWidth={true}
          />
        <Field 
          component={CheckboxInput}
          label="Profiles that I have already Viewed"
          name="notViewedOnly"
          fullWidth={true}
          />
      </FormRow>
    </>
  );
}

const mapStateToProps = (state) => {
  let system = systemSelector(state, ['profileCreatedBy']);
  return {
    profileCreatedBy: system.profileCreatedBy
  }
}
 
export default connect(mapStateToProps)(MiscPreference);
