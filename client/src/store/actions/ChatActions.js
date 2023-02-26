export const actionTypes = {
  CHAT_NEW_CONVERSATION_CREATED: 'chatNewConversationCreated',
  CHAT_NEW_MESSAGE_SENT: 'chatNewMessageSent',
  CHAT_OPEN_CHATBOX: 'chatOpenBox',
  CHAT_CLOSE_BOX: 'chatCloseBox',
  CHAT_CLOSE_ALL: 'chatCloseAll'
}

export const createConversation = (request, firestore) => {
  return (dispatch, getState) => {
    firestore.collection('conversations').doc(request._id).set({
      requestFrom: request.from,
      requestTo: request.to,
      seenFrom: true,
      seenTo: true
    }, { merge: true }).then(() => {
      dispatch({type: actionTypes.CHAT_NEW_CONVERSATION_CREATED});
    })
  }
}

export const sendMessage = (requestId, message, firebase) => {
  return (dispatch) => {
    message.sentOn = firebase.firestore.FieldValue.serverTimestamp();
    firebase.firestore().collection('conversations').doc(requestId).collection('messages').add(message).then(() => {
      dispatch({type: actionTypes.CHAT_NEW_MESSAGE_SENT});
    })
  }
}

export const openChatBox = profileId => {
  return (dispatch, getState) => {
    const records = getState().chat.activeConversations;
    if(!records.find(item => item === profileId))
      dispatch( { type: actionTypes.CHAT_OPEN_CHATBOX, profileId } )
  }
}
export const closeChatBox = profileId => {
  return {
    type: actionTypes.CHAT_CLOSE_BOX,
    profileId
  }
}

export const closeAllChats = () => {
  return {
    type: actionTypes.CHAT_CLOSE_ALL
  }
}