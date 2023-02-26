import React from 'react';
import ChatBox from './ChatBox';
import { makeStyles, Box } from '@material-ui/core';
import { connect } from 'react-redux';

const useStyles = makeStyles(theme => ({
  root: {
    width: 284,
    height: 351,
    position: "fixed",
    bottom: 0,
    right: 20
  }
}))

const DesktopChat = ({chatSessions}) => {
  const classes = useStyles();
  if(chatSessions.length === 0) return null;
  return (
    <>
    { chatSessions.map((profileId, index) => (
        <Box className={classes.root} key={profileId} style={{right: (index * 284 + 20 + index * 20)}}>
          <ChatBox profileId={profileId} desktop={true} />
        </Box>
      )) 
    }
    </>
  );
}
 
const mapStateToProps = state => {
  return {
    chatSessions: state.chat.activeConversations
  }
}
export default connect(mapStateToProps)(DesktopChat);