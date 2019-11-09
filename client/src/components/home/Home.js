import React, { useEffect } from 'react';
import { Box, Typography, Container } from '@material-ui/core';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const Home = (props) => {
  useEffect(() => {
    document.title = process.env.REACT_APP_NAME;
  }, [])
  if(props.auth.uid)
    return <Redirect to="my/dashboard" />
  return (
    <Container>
      <Box m={6} textAlign="center">
        <Typography variant="h4">
          Home Page
        </Typography>
      </Box>
    </Container>
  );
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}
export default connect(mapStateToProps)(Home);