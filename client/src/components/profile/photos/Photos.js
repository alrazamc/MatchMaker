import React, { useEffect } from 'react';
import { Container, Grid, Hidden, Box, Divider } from '@material-ui/core';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Panel from '../../library/Panel';
import Settings from './Settings';
import Upload from './Upload';
import PhotoGrid from './PhotoGrid';

const Photos = (props) => {
  useEffect(() => {
    document.title = "My Photos | " + process.env.REACT_APP_NAME;
  }, []);
  
  if(!props.auth.uid)
    return <Redirect to="/signin" />
  return (
    <Box>
      <Container>
        <Grid container spacing={2}>
          <Hidden smDown>
            <Grid item xs={12} md={2} >
              {null}
            </Grid>
          </Hidden>
          <Grid item xs={12} md={7}>
            <Panel id="my-photos" heading="My Photos" expanded>
              <Box width="100%">
                <Settings />
                <Divider />
                <Upload />
                <Divider />
                <PhotoGrid />
              </Box>
            </Panel>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
 
const mapStateToProps = (state) => {
  return{
    auth: state.auth,
    photos: state.profile ? state.profile.photos : {},
  }
}

export default connect(mapStateToProps)(Photos);