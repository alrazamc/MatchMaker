import { actionTypes } from '../actions/ChatActions';

const initState = {
  activeConversations: []
}

const chatReducer = (state = initState, action) => {
  switch(action.type){
    case actionTypes.CHAT_OPEN_CHATBOX:
      return {
        ...state,
        activeConversations: [...state.activeConversations, action.profileId]
      }
    case actionTypes.CHAT_CLOSE_BOX:
      return {
        ...state,
        activeConversations: state.activeConversations.filter(item => item !== action.profileId)
      }
    case actionTypes.CHAT_CLOSE_ALL:
      return initState;
    default:
    return state;  
  }
}

export default chatReducer;