import React, { useState, useRef } from 'react';
import { Box, TextField, Paper, makeStyles, Fab } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { connect } from 'react-redux';
import { sendMessage } from '../../store/actions/ChatActions';
import { useFirestore, useFirebase } from 'react-redux-firebase';

const useStyles = makeStyles(theme => ({
  input: {
    marginTop: theme.spacing(0)
  }
}))
const MessageInput = ({request, desktop, myProfileId, fbRequest, sendMessage}) => {
  const classes = useStyles();
  const firebase = useFirebase();
  const [text, setText] = useState("");
  const inputRef = useRef();
  const firestore = useFirestore();
  const sendMsg = () => {
    let msg = text.trim();
    if(msg === '') return;
    const message = {
      from: myProfileId,
      to: request.from === myProfileId ? request.to : request.from,
      message: msg,
      attachment: "",
      seen: false
    }
    sendMessage(request._id, message, firebase);
    setText("");
    inputRef.current.focus();
    markNotSeen();
  }

  const handleKeyPress = e => {
    if(desktop && e.key === "Enter" && !e.shiftKey){
      e.preventDefault();
      sendMsg();
    }
  }

  const markSeen = async () => {
    if(!fbRequest) return;
    if(fbRequest.seenFrom && fbRequest.seenTo) return;
    if(fbRequest.requestFrom === myProfileId && fbRequest.seenFrom) return;
    if(fbRequest.requestTo === myProfileId && fbRequest.seenTo) return;
    let update = {};
    if(fbRequest.requestFrom === myProfileId && !fbRequest.seenFrom)
      update.seenFrom = true;
    else if(fbRequest.requestTo === myProfileId && !fbRequest.seenTo)
      update.seenTo = true;
    await firestore.update({
      collection: 'conversations',
      doc: request._id
    }, update);
  }

  //mark not seen for other 
  const markNotSeen = async () => {
    if(!fbRequest) return;
    if(fbRequest.requestFrom === myProfileId && !fbRequest.seenTo) return; //already not seen by other
    if(fbRequest.requestTo === myProfileId && !fbRequest.seenFrom) return; //already not seeen by other
    let update = {};
    if(fbRequest.requestFrom === myProfileId && fbRequest.seenTo)
      update.seenTo = false;
    else if(fbRequest.requestTo === myProfileId && fbRequest.seenFrom)
      update.seenFrom = false;
    await firestore.update({
      collection: 'conversations',
      doc: request._id
    }, update);
  }

  return (
    <Box>
      <Paper square onClick={(e) => { e.preventDefault(); inputRef.current.focus();  }}>
        <Box p={1} pt={0} display="flex" justifyContent="space-between" alignItems="center">
          <TextField
            fullWidth={true}
            variant="outlined"
            placeholder="Type a message..."
            value={text}
            onKeyDown={handleKeyPress}
            multiline={true}
            rowsMax={6}
            margin={"dense"}
            onChange={($event) => setText($event.target.value)}
            className={classes.input}
            inputRef={inputRef}
            onFocus={markSeen}
          />
          <Box ml={1} alignSelf="flex-end" >
              <Fab size={desktop ? "small" : "medium"} onClick={sendMsg} color="primary" disabled={text === ''}><SendIcon /></Fab>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

const mapStateToProps = (state, props) => {
  return {
    fbRequest: state.firestore.data.conversations ? state.firestore.data.conversations[props.request._id] : null,
  }
}
export default connect(mapStateToProps, {sendMessage})(MessageInput);