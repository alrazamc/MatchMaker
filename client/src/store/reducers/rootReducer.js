import { reducer as formReducer } from 'redux-form';
import { combineReducers } from 'redux';
import  authReducer  from './authReducer';
import profileReducer from './profileReducer';
import systemReducer from './systemReducer';
import routesReducer from './routesReducer';
import peopleReducer from './peopleReducer';
import chatReducer from './chatReducer';
import connectionReducer from './connectionReducer';
import notificationReducer from './notificationReducer';
import inboxReducer from './inboxReducer';
import blockedReducer from './blockedReducer';
import memberReducer from './memberReducer';

export const staticReducers = {
  auth: authReducer,
  profile: profileReducer,
  system: systemReducer,
  form: formReducer,
  routes: routesReducer,
  people: peopleReducer,
  chat:chatReducer,
  connections: connectionReducer,
  notifications: notificationReducer,
  inbox: inboxReducer,
  blocked: blockedReducer,
  memberProfile: memberReducer
}
const rootReducer = combineReducers(staticReducers);

export default rootReducer;
