import { actionTypes } from '../actions/AuthActions';
const resetPassword = {
  emailStep: false,
  codeStep: false,
  passwordStep: false
}
const initState = {
  uid: null,
  account: {},
  isLoaded: false,
  error: null,
  success: null,
  resetPassword
}

const authReducer = (state = initState, action) => {
  switch(action.type)
  {
    case actionTypes.AUTH_FAILED:
    case actionTypes.LOGOUT_SUCCESS:
    case actionTypes.LOADAUTH_ERROR:
      return {
        ...state,
        uid: null,
        account: {},
        isLoaded: true,
        success: null,
        error: action.message,
        resetPassword
      }
    case actionTypes.LOADAUTH_SUCCESS:
    case actionTypes.SIGNUP_SUCCESS:
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        uid: action.user._id,
        account: action.user,
        isLoaded: true,
        success: null,
        error: {},
        resetPassword
      }  
    case actionTypes.ACCOUNT_SETTINGS_UPDATED:
      return {
        ...state,
        resetPassword,
        account: action.data
      }
    case actionTypes.INIT_RESET_PASSWORD_FORM:
      return {
        ...state,
        resetPassword
      }
    case actionTypes.RESET_PASSWORD_SUCCESS:
      return { 
        ...state,
        success: action.payload.passwordStep ?  "Password changed successfully. Login with new password" : null,
        resetPassword: action.payload
      };
    default:
      return state;
  }
}

export default authReducer;