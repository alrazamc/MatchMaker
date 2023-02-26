import React, { useEffect, useRef, useState } from 'react';
import { firestoreConnect, useFirestore } from 'react-redux-firebase';
import { Box, makeStyles, CircularProgress, Typography } from '@material-ui/core';
import { compose } from 'redux';
import { connect } from 'react-redux'
import { createConversation } from '../../store/actions/ChatActions';
import Message from './Message';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    flex: "1 1 auto",
    overflowY: "auto",
    height: 0
  }
}))

const MessageContainer = (props) => {
  const {request, profile, desktop, myProfileId, isRequested, isMsgsRequested, fbRequest, createConversation, messages} = props;
  const classes = useStyles();
  const firestore = useFirestore();
  const containerRef = useRef();
  const [firstTime, setFirstTime] = useState(true); //first time messages loading, scroll to bottom
  const [sortedMsgs, setSortedMsgs] = useState([]); //message sorted by sent on descending
  const [msgData, setMsgsData] = useState({}); //messages stored by id
  const [loadingMsgs, setLoadingMsgs] = useState(false); //loading messages on scroll up
  const [lastContainerHeight, setLastContainerHeight] = useState(0);//store last height of container before keyboard appears on mobile
  //load new messages
  useEffect(() => {
    const msgs = { ...msgData, ...messages };
    let msgsArray = []
    for(let key in msgs)
      if(msgs[key])
        msgsArray.push({ id: key, ...msgs[key] })
    msgsArray.sort((a,b) => a.sentOn && b.sentOn ? a.sentOn.seconds - b.sentOn.seconds : undefined)
    setMsgsData(msgs);
    if(msgsArray.length && sortedMsgs.length &&
       msgsArray[msgsArray.length - 1].id !== sortedMsgs[sortedMsgs.length - 1].id ) //last message of old and new array not same, new message sent/arrived
      setTimeout(() => containerRef.current.scrollTop = containerRef.current.scrollHeight, 10); //scroll to bottom on new msg
    if(msgsArray.length)
      setSortedMsgs(msgsArray);
  }, [messages]);
  //create a firestore coverstion before sending first message
  useEffect(() => {
    if(isRequested && !fbRequest)
      createConversation(request, firestore);
  }, [isRequested, fbRequest, createConversation, request])

  //scroll to bottom when chatbox opens
  useEffect(() => {
    if(!isMsgsRequested && messages.length === 0) return;
    if (firstTime) {
      setTimeout(() => {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
        setLastContainerHeight(containerRef.current.clientHeight);
      }, 100);
      setFirstTime(false);
    }
  }, [isMsgsRequested, firstTime, messages])
  //mobile Keyboard - window Resize adjust window scroll
  useEffect(() => {
    let handleResize = (e) => {
      if(containerRef.current.scrollTop + lastContainerHeight + 5 >= containerRef.current.scrollHeight)
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      setLastContainerHeight(containerRef.current.clientHeight);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [lastContainerHeight]);

  //load next batch of message on scrollup
  const loadMsgs = async () => {
    if(containerRef.current.scrollHeight > containerRef.current.clientHeight && containerRef.current.scrollTop === 0)
    {
      let oldScrollHeight = containerRef.current.scrollHeight;
      setLoadingMsgs(true);
      await firestore.get({
        collection: 'conversations',
        doc: request._id,
        subcollections: [{ collection: 'messages' }],
        orderBy: ["sentOn", 'desc'],
        storeAs: `${request._id}-messages`, // make sure to include this
        limit: 15,
        startAfter:  sortedMsgs[0].sentOn
      });
      setLoadingMsgs(false);
      if(containerRef.current.scrollHeight > oldScrollHeight)
          containerRef.current.scrollTop = containerRef.current.scrollHeight - oldScrollHeight - 64; //64 = preloader height
    }
  }

  return (
    <Box flexGrow={1} px={1} pb={0}  className={classes.root} ref={containerRef} onScroll={loadMsgs} >
      { isMsgsRequested && !loadingMsgs ? null : 
      <Box display="flex" justifyContent="center" alignItems="center" pt={5}>
        <CircularProgress size={24} color="primary" />
      </Box>
      }
      { isMsgsRequested && !loadingMsgs && sortedMsgs.length === 0 ?
        <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
          <Typography color="textSecondary" align="center">
            Start conversation by sending first message
          </Typography>
        </Box> : null
      }
      {
        sortedMsgs.map((item, index) => (
          <Message profile={profile} key={item.id ? item.id : index} message={item} myProfileId={myProfileId} desktop={desktop}  />
        ))
      }
    </Box>
  );
}

const mapStateToProps = (state, props) => {
  return {
    isRequested: state.firestore.status.requested[`conversations/${props.request._id}`],
    isMsgsRequested: state.firestore.status.requested[`${props.request._id}-messages`],
    fbRequest: state.firestore.data.conversations ? state.firestore.data.conversations[props.request._id] : null,
    messages: state.firestore.data[`${props.request._id}-messages`] ? state.firestore.data[`${props.request._id}-messages`] : []
  }
}

export default compose(
firestoreConnect(props => {
  return [{
    collection: 'conversations',
    doc: props.request._id
  },{
    collection: 'conversations',
    doc: props.request._id,
    subcollections: [{ collection: 'messages' }],
    orderBy: ["sentOn", 'desc'],
    storeAs: `${props.request._id}-messages`, // make sure to include this
    limit: 15
  }];
}),
connect(mapStateToProps, {createConversation})
)(MessageContainer);