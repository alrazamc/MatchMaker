import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
//console.log(window.__REDUX_DEVTOOLS_EXTENSION__());
const store = createStore(rootReducer, 
  window.__REDUX_DEVTOOLS_EXTENSION__  && process.env.NODE_ENV !== 'production' ?
  compose(   applyMiddleware(thunk),  window.__REDUX_DEVTOOLS_EXTENSION__() ) : 
  applyMiddleware(thunk)
);

export default store;