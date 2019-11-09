import React from 'react';
import { Typography } from '@material-ui/core';
import FormRow from '../../library/form/FormRow';
import { Field } from 'redux-form'
import TextInput from '../../library/form/TextInput';
import SelectInput from '../../library/form/SelectInput';
import { connect } from 'react-redux';

const SaveSearch = ({searches}) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>Save up to 5 searches</Typography>
      {
        searches.length >= 6 ? null :
        <FormRow label="Save Search as">
          <Field
            component={TextInput}
            fullWidth={true}
            placeholder="e.g. Punjab 20-25"
            name="searchName"
          />
        </FormRow>
      }
      {
        searches.length === 0 ? null :
        <FormRow label={ searches.length >= 6 ? "Overwrite Existing" : "or Overwrite Existing" }>
          <Field
            component={SelectInput}
            options={searches}
            fullWidth={true}
            name="_id"
            displayEmpty={true}
            renderValue={(value) => {
            const selected = searches.find(item => item.id === value);
            return selected ? selected.title : "Select a saved search";
          }}
          />
        </FormRow>
      }
    </>
  );
}
 
const mapStateToProps = (state) => {
  const searches = state.profile.searches ? [...state.profile.searches] : [];
  if(searches.length)
    searches.unshift({
      _id: null,
      searchName: "Select a saved search"
    })
  return{
    searches: searches.map(item => ({
      id: item._id,
      title: item.searchName
    }))
  }
}

export default connect(mapStateToProps)(SaveSearch);