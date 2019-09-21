import React, { useEffect } from 'react';
import { Container, Grid, Hidden } from '@material-ui/core';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import EditBasicInfo from './EditBasicInfo';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';

const EditProfile = (props) => {
  useEffect(() => {
    document.title = "Profile | " + process.env.REACT_APP_NAME;
  }, []);
  if(!props.auth.uid)
    return <Redirect to="/signin" />
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={2} >
          <Hidden smDown>
            {null}
          </Hidden>
        </Grid>
        <Grid item xs={12} md={7}>
          <EditBasicInfo />
        </Grid>
      </Grid>
    </Container>
  );
}

const mapStateToProps = (state) => {
  return{
    auth: state.firebase.auth
  }
}

export default compose(
connect(mapStateToProps),
firestoreConnect((props) => ([
  {
    collection: 'system/profileCreatedBy/options'
  },
  {
    collection: 'system/maritalStatus/options'
  },
  {
    collection: 'system/bloodGroup/options'
  }
]))
)(EditProfile);