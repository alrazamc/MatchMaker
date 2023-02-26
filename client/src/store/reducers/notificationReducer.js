import { actionTypes } from '../actions/NotificationActions';

const initState = {
  loading: false,
  notifications: []
}

const notificationReducer = (state=initState, action) => {
  switch(action.type){
    case actionTypes.NOTIFICATIONS_LOADING:
      return {
        ...state,
        loading: true
      }
    case actionTypes.NOTIFICATIONS_LOADED:
      let notifications = [];
      if(action.newNotifications)
        notifications = [...action.notifications, ...state.notifications];
      else
        notifications = [...state.notifications, ...action.notifications];
      return {
        ...state,
        loading: false,
        notifications: notifications
      }
    case actionTypes.NOTIFICATIONS_ALL_SEEN:
      return {
        ...state,
        loading: false,
        notifications: state.notifications.map(item => item.isSeen ? item : { ...item, isSeen: true })
      }
    default:
      return state;
  }
}

export default notificationReducer;