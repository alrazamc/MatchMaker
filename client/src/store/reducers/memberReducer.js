import { actionTypes } from '../actions/memberActions';

const initState = {
  loading: false,
  error: null,
  success: null,
  profile: null
}

const memberReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.MEMBER_LOADING:
      return {
        ...initState,
        loading: true,
        profile: action.profile
      }
    case actionTypes.MEMBER_LOADING_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case actionTypes.MEMBER_LOADING_SUCCESS:
      return {
        ...state,
        loading: false, error: null, success: null,
        profile: action.profile
      }
    default:
      return state;
  }
}

export default memberReducer;