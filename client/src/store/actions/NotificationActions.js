import axios from 'axios';
import { actionTypes as blockedActions } from './BlockedActions';
import { actionTypes as profileActions } from './ProfileActions';
import { actionTypes as connActions } from './ConnectionActions';
export const actionTypes = {
  NOTIFICATIONS_LOADING: 'notificationsLoading',
  NOTIFICATIONS_LOADED: 'notificationsLoaded',
  NOTIFICATIONS_ALL_SEEN: 'notificationsAllSeen',
  NOTIFICATIONS_DEVICE_TOKEN_UPDATED: 'notificationsDeviceTokenUpdated'
}

export const loadNotifications = (firstTime=false, newNotifications=true) => {
  return (dispatch, getState) => {
    const state = getState();
    const length = state.notifications.notifications.length;
    dispatch({type: actionTypes.NOTIFICATIONS_LOADING});
    const params = {
      profileId: state.profile._id,
    }
    if(newNotifications && length)
      params.after = state.notifications.notifications[0].time;
    else if(!newNotifications && length)
      params.before = state.notifications.notifications[length - 1].time;
    const requests = [];
    const requestIds = [];
    axios.get('/api/notifications', {params}).then(({data}) => {
      let notifications = data;
      if(notifications.length)
      {
        notifications.forEach(item => {
          if(item.type === 11) //blocked
            dispatch({type: blockedActions.BLOCKED_ME_ADD_PROFILE, profileId: item.from})
          else if(item.type === 12) //unblocked
            dispatch({type: blockedActions.BLOCKED_ME_REMOVE_PROFILE, profileId: item.from})
          else if(item.type <= 8){ //photo/connect request type notifications
            if(!requestIds.includes(item.payload._id)) //only recent request, prevent overwrite from old request
            {
              requests.push(item.payload);
              requestIds.push(item.payload._id);
            }
          }
          
          if(!firstTime && item.type === 5) //connected request accepted, add connection
            dispatch({type: connActions.CONNECTION_ADD_PROFILE, profile: item.profile});
          else if(!firstTime && (item.type === 7 || item.type === 11)) //connect request declined or blocked me
            dispatch({type: connActions.CONNECTION_REMOVE_PROFILE, profileId: item.from});
          else if(!firstTime && item.type === 12) //unblocked
          {
            if(state.profile.requests && state.profile.requests.length)
            {
              let isConnected = state.profile.requests.find(req => (req.from === item.from || req.to === item.from) && req.type === 1 && req.status === 2);
              if(isConnected)
                dispatch({type: connActions.CONNECTION_ADD_PROFILE, profile: item.profile})
            }
          }
        })
        if(requests.length && !firstTime)
          dispatch({type: profileActions.PROFILE_UPDATE_REQUESTS, requests})
      }
      dispatch({
        type: actionTypes.NOTIFICATIONS_LOADED,
        notifications: notifications,
        newNotifications
      })
    }).catch(err => {} )

  }
}

export const markAllSeen = () => {
  return (dispatch, getState) => {
    const params = {
      profileId: getState().profile._id,
    }
    axios.post('/api/notifications/seen', params).then(() => {
      dispatch({ type: actionTypes.NOTIFICATIONS_ALL_SEEN, })
    }).catch(err => {} )
  }
}

export const saveDeviceToken = (token) => {
  return (dispatch, getState) => {
    const state = getState();
    axios.post('/api/profile/', {
      payload: {
        deviceToken: token
      }
    }).then(() => {
      dispatch({
        type: actionTypes.NOTIFICATIONS_DEVICE_TOKEN_UPDATED, token
      })
    }).catch(err => {});
  }
}