import React from 'react';
import { Box, Typography, Container } from '@material-ui/core';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const Profile = (props) => {
  if(!props.auth.uid)
    return <Redirect to="/signin" />
  return (
    <Container>
      <Box m={6} textAlign="center">
        <Typography variant="h4">
          Profile Page
        </Typography>
      </Box>
    </Container>
  );
}

const mapStateToProps = state =>  {
  return {
    auth: state.firebase.auth
  }
}

export default connect(mapStateToProps)(Profile);