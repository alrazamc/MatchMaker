import axios from 'axios';
import { actionTypes as profileActionTypes } from './ProfileActions';

export const actionTypes = {
  SIGNUP_SUCCESS: 'signUpSuccess',
  LOGIN_SUCCESS: 'loginSuccess',
  LOADAUTH_SUCCESS: 'loadAuthSuccess',
  LOADAUTH_ERROR: 'loadAuthError',
  LOGOUT_SUCCESS: 'logOutSuccess',
  AUTH_FAILED: 'authFailed',
  ACCOUNT_SETTINGS_UPDATED: 'accountSettingsUpdated',
  RESET_PASSWORD_SUCCESS: 'resetPasswordSuccess',
  INIT_RESET_PASSWORD_FORM: 'initResetPasswordForm'
}

export const loadAuth = () => {
  return (dispatch, getState) => {
    axios.get('/api/user/profile').then(({ data }) => {
      if(data.systemVersion && localStorage && localStorage.getItem('systemV') !== data.systemVersion)
        localStorage.removeItem('systemV');
      if(data.profile)
        dispatch({
          type: profileActionTypes.PROFILE_LOADED,
          profile: data.profile
        });
      if(data.user)
        dispatch({
          type: actionTypes.LOADAUTH_SUCCESS,
          user: data.user
        });
    }).catch(err => err); // auto catched in response interceptor
  }
}

export const logOut = (firebase, msg) => {
  return (dispatch, getState) => {
    localStorage.removeItem(process.env.REACT_APP_JWT_TOKEN);
    localStorage.removeItem(process.env.REACT_APP_FB_TOKEN);
    firebase.auth().signOut().then(function() {
      dispatch( {
        type: actionTypes.LOGOUT_SUCCESS,
        message: typeof msg === 'string' ? msg : "Logged out, Please login to continue"
      });
    }, function(error) {
      dispatch( {
        type: actionTypes.LOGOUT_SUCCESS,
        message: typeof msg === 'string' ? msg : "Logged out, Please login to continue"
      });
    });
  }
}

//reset form steps state
export const initResetPasswordForm = () => {
  return {
    type: actionTypes.INIT_RESET_PASSWORD_FORM
  }
}

export const signinWithFirebase = (firebase) => {
  return (dispatch, getState) => {
    const fbtoken = localStorage.getItem(process.env.REACT_APP_FB_TOKEN);
    if(!fbtoken) return;
    const state = getState();
    if(state.firebase.auth.uid) return;
    firebase.auth().signInWithCustomToken(fbtoken).then(() => {
      localStorage.removeItem(process.env.REACT_APP_FB_TOKEN);
    }).catch(function(error) {
     localStorage.removeItem(process.env.REACT_APP_FB_TOKEN);
    });
  }
}