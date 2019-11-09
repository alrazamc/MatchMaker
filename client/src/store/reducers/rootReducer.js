import { reducer as formReducer } from 'redux-form';
import { combineReducers } from 'redux';
import  authReducer  from './authReducer';
import profileReducer from './profileReducer';
import systemReducer from './systemReducer';
import routesReducer from './routesReducer';
import peopleReducer from './peopleReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  system: systemReducer,
  form: formReducer,
  routes: routesReducer,
  people: peopleReducer
});

export default rootReducer;
