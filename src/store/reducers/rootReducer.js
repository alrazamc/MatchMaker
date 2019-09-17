import { firebaseReducer } from 'react-redux-firebase'; 
import { firestoreReducer } from 'redux-firestore';
import { reducer as formReducer } from 'redux-form';
import { combineReducers } from 'redux';

const mainReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  form: formReducer
});

export default mainReducer;
