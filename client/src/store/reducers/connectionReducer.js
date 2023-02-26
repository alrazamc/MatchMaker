import { actionTypes } from '../actions/ConnectionActions';

const initState = {}

const connectionReducer = (state = initState, action) => {
  switch(action.type){
    case actionTypes.CONNECTION_FIND_PROFILE:
    case actionTypes.CONNECTION_LOAD_PROFILE:
    case actionTypes.CONNECTION_ADD_PROFILE:
      return {
        ...state,
        [action.profile._id]: action.profile
      }
    case actionTypes.CONNECTION_REMOVE_PROFILE:
      if(!state[action.profileId]) return state;
      const newState = {...state};
      delete newState[action.profileId];
      return newState;
    case actionTypes.CONNECTION_LOAD_ALL:
      let profiles = {}
      action.profiles.forEach(item => profiles[item._id] = item);
      return {
        ...state,
        ...profiles
      }
    default:
      return state;
  }
}

export default connectionReducer;