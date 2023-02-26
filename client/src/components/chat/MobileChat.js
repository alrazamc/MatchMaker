import React from 'react';
import { Dialog } from '@material-ui/core';
import ChatBox from './ChatBox';

const MobileChat = (props) => {
  const profileId = props.match.params.profileId
  return (
    <Dialog open={true} maxWidth="sm" fullWidth={true} fullScreen={true}>
      <ChatBox profileId={profileId} />
    </Dialog>
  );
}
 
export default MobileChat;