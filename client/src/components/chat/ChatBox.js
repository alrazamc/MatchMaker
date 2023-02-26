import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Box, makeStyles } from '@material-ui/core';
import MessageContainer from './MessageContainer';
import MessageInput from './MessageInput';
import Header from './Header';
import { loadConnectionProfile } from '../../store/actions/ConnectionActions';
import { closeChatBox } from '../../store/actions/ChatActions';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root:{
    boxShadow: "0px 0px 13px 4px rgba(201,201,201,1)"
  }
}));

const ChatBox = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { profileId, myProfileId, request, isBlocked, profile, loadConnectionProfile, closeChatBox, desktop=false} = props;
  useEffect(() => {
    if(!request || isBlocked) return;
    if(!profile)
      loadConnectionProfile(profileId);
  }, [request, profile, isBlocked, loadConnectionProfile])

  useEffect(() => {
    if(request && !isBlocked) return;
    desktop ? closeChatBox(profileId) : history.push('/');
  }, [request, isBlocked, desktop, closeChatBox])
  
  if(isBlocked || !request)
    return null;
  return (
    <Box className={classes.root} display="flex" flexDirection="column" justifyContent="space-between" height="100%">
      <Header profile={profile} desktop={desktop} profileId={profileId} request={request} />
      <MessageContainer profile={profile} request={request} myProfileId={myProfileId} desktop={desktop} />
      <MessageInput request={request} myProfileId={myProfileId} desktop={desktop} />
    </Box>
  );
}
 
const mapStateToProps = (state, props) => {
  const profileId = props.profileId;
  const myProfileId = state.profile._id;
  const requests = state.profile.requests ? state.profile.requests : [];
  const blocked = state.profile.blocked ? state.profile.blocked : [];
  const connect = requests.find(req => (req.from === profileId || req.to === profileId) && req.type === 1 && req.status === 2) //accepted connect request sent/received by this user
  return{
    myProfileId,
    request: connect,
    profile: state.connections[profileId],
    isBlocked: blocked.filter(item => item === profileId).length || state.blockedMe.filter(item => item === profileId).length
  }
}
export default connect(mapStateToProps, {loadConnectionProfile, closeChatBox})(ChatBox);