import { actionTypes } from '../actions/BlockedActions';

const initState = [];

const blockedReducer = (state=initState, action) => {
  switch(action.type){
    case actionTypes.BLOCKED_ME_ADD_PROFILE:
      if(!state.find(item => item === action.profileId))
        return [...state, action.profileId];
      else return state;
    case actionTypes.BLOCKED_ME_REMOVE_PROFILE:
      return state.filter(item => item !== action.profileId);
    default:
      return state;
  }
}

export default blockedReducer;