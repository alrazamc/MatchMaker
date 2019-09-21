import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {  getFirebase } from 'react-redux-firebase';
import {  getFirestore, reduxFirestore } from 'redux-firestore';
import rootReducer from './reducers/rootReducer';
import fbConfig from '../config/FbConfig';

const store = createStore(rootReducer,
  compose(
    applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore })),
    reduxFirestore(fbConfig),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  ),
);

export default store;