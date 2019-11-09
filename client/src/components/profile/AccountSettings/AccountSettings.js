import React, { useEffect } from 'react';
import { Container, Grid, Hidden, Box } from '@material-ui/core';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { compose } from 'redux';
import withSystem from '../../library/withSystem';
import EmailPasswordSettings from './EmailPasswordSettings';
import HideAccount from './HideAccount';
import ShowAccount from './ShowAccount';
import DeleteAccount from './DeleteAccount';

const AccountSettings = ({ auth }) => {
  useEffect(() => {
    document.title = "Account Settings | " + process.env.REACT_APP_NAME;
  }, []);
  if(!auth.uid)
    return <Redirect to="/signin" />
  return (
    <Box>
      <Container>
        <Grid container spacing={2}>
          <Hidden smDown>
            <Grid item xs={12} md={3} >
              {null}
            </Grid>
          </Hidden>
          <Grid item xs={12} md={6}>
            <EmailPasswordSettings />
            { auth.account.status && auth.account.status.hidden ? 
              <ShowAccount /> : <HideAccount /> 
            }
            <DeleteAccount />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

const mapStateToProps = (state) => {
  return{
    auth: state.auth
  }
}
const systemNames = ['deleteProfileReason'];
                    
export default compose(
connect(mapStateToProps),
withSystem(systemNames)
)(AccountSettings);