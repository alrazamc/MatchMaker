import React from 'react';
import { Box, makeStyles, Button, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { declineRequest, acceptRequest } from '../../../store/actions/PeopleActions';
import FbAnalytics from '../../../config/FbAnalytics';

const useStyles = makeStyles(theme => ({
  btn:{
    marginLeft: 4
  },
  fileInput: {
    visibility:"hidden",
    width: 0
  }
}))

const ConnectRequestActions = (props) => {
  const classes = useStyles();
  const { connectReceived, declineRequest, acceptRequest } = props;
  if(!connectReceived) return null;
  const status = connectReceived.status;
  return (
    <Box width="100%">
      { status === 1 ? null : <Typography color="textSecondary" component="span">Changed your mind ? </Typography> }
      { status === 1 || status === 3 ? //pending or declined
        <Button variant="outlined" className={classes.btn} color="primary" onClick={() => { FbAnalytics.logEvent('connect_request_accepted'); acceptRequest(connectReceived.from, 'connect')}}>Accept</Button>
        : null
      }
      {
        status === 1 || status === 2 ? //pending or approved
          <Button variant="outlined" className={classes.btn} color="secondary" onClick={() => { FbAnalytics.logEvent('connect_request_declined'); declineRequest(connectReceived.from, 'connect')}}>Decline</Button>
        : null
      }
    </Box>
  );
}
 
const mapStateToProps = (state, props) => {
   const requests = state.profile.requests ? state.profile.requests : [];
  return {
    myProfileId: state.profile._id ? state.profile._id : null,
    connectReceived: requests.find(req => req.to === state.profile._id && req.from === props.profileId && req.type === 1 && req.status > 0)
  }
}
export default connect(mapStateToProps, {declineRequest, acceptRequest})(ConnectRequestActions);