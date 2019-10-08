import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { reduxForm, Field  } from 'redux-form';
import { Box } from '@material-ui/core';

const PartnerPreference = () => {
  return (
    <Box>
      
    </Box>
  );
}

const mapStateToProps = (state) => {
  return {

  }
}

const onSubmit = (values) => {

}
const validate = (values) => {
  const errors = {};
  return errors;
}
 
export default compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'partnerPreference',
    onSubmit,
    validate
  }),
  firestoreConnect()
)(PartnerPreference);