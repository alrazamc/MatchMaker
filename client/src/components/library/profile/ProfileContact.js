import React from 'react';
import { Button, Box, makeStyles, Typography, Tooltip, IconButton } from '@material-ui/core';
import SendIcon from '@material-ui/icons/SendOutlined';
import CancelSendIcon from '@material-ui/icons/CancelScheduleSend';
import ChatIcon from '@material-ui/icons/ChatBubbleOutline';
import PersonIcon from '@material-ui/icons/PersonOutline';
import { connect } from 'react-redux';
import { sendRequest, cancelRequest, acceptRequest, declineRequest } from '../../../store/actions/PeopleActions';
import AcceptIcon from '@material-ui/icons/Done';
import DeclineIcon from '@material-ui/icons/Close';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  mb1:{
    marginBottom: theme.spacing(1)
  },
  respondBtn:{
    padding: 5,
    marginRight: 7,
    marginLeft: 7
  }
}));
const ProfileContact = ({profileId, sent, received, sendRequest, cancelRequest, acceptRequest, declineRequest}) => {
  const classes = useStyles();
  return (
    <Box pl={{xs: 2, sm: 0}} height="auto" display="flex" justifyContent="center" alignItems="center" flexWrap="wrap" maxWidth={137} minWidth={126}>
      { !sent && !received ? <Button onClick={() => sendRequest(profileId, 'connect')} variant="outlined" className={classes.mb1} fullWidth={true} endIcon={<SendIcon />}>Connect </Button> : null }
      {
        sent && sent.status === 1 ? 
        <>
          <Typography color="textSecondary" align="center">Request Sent</Typography>
          <Button onClick={() => cancelRequest(profileId, 'connect')} variant="outlined" className={classes.mb1} fullWidth={true} endIcon={<CancelSendIcon />}>Cancel </Button>
        </> : null
      }
      {
        (sent && sent.status === 2) || (received && received.status === 2) ? 
        <>
          <Typography color="textSecondary" align="center">Connected</Typography>
          <Button variant="outlined" className={classes.mb1} fullWidth={true} endIcon={<ChatIcon />}>Chat </Button>
        </> : null
      }
      {sent && sent.status === 3 ? <Typography color="textSecondary" align="center">Connect Request Declined</Typography>: null }
      {
        received && received.status === 1 ? 
        <>
          <Typography color="textSecondary" align="center">Request Received</Typography>
          <Tooltip title="Accept Request">
            <IconButton onClick={() => acceptRequest(profileId, 'connect')} className={classes.respondBtn} variant="outlined"><AcceptIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Decline Request">
            <IconButton onClick={() => declineRequest(profileId, 'connect')} className={classes.respondBtn} variant="outlined"><DeclineIcon /></IconButton>
          </Tooltip>
        </> : null
      }
      {
        received && received.status === 3 ? 
        <>
          <Typography color="textSecondary" align="center">Request Declined</Typography>
          <Typography color="textSecondary" align="center">Mind Changed?</Typography>
          <Button onClick={() => acceptRequest(profileId, 'connect')} variant="outlined" className={classes.mb1} fullWidth={true} endIcon={<AcceptIcon />}>Accept </Button>
        </> : null
      }
      <Button variant="outlined" to={`/profile/${profileId}`} fullWidth={true} component={Link} endIcon={<PersonIcon />}>See More </Button>
    </Box>
  );
}
 
const mapStateToProps = (state, props) => {
  const requests = state.profile.requests ? state.profile.requests : [];
  return {
    sent: requests.find(req => req.from === state.profile._id && req.to === props.profileId && req.type === 1 && req.status > 0),
    received: requests.find(req => req.to === state.profile._id && req.from === props.profileId && req.type === 1 && req.status > 0)
  }
}
export default connect(mapStateToProps, {
  sendRequest, cancelRequest, acceptRequest, declineRequest
})(ProfileContact);