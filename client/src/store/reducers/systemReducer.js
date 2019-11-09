import { actionTypes } from '../actions/SystemActions';

const systemReducer = (state = {}, action) => {
  switch(action.type)
  {
    case actionTypes.SYSTEM_VALUES_UPDATED:
      return {
        ...state,
        ...action.values
      }
    default:
      return state;
  }
}

export default systemReducer;