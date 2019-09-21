import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './store/Store';
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import firebase from './config/FbConfig';
import theme from './config/MuiTheme';
import { ThemeProvider } from '@material-ui/styles';

const reactReduxFirebaseConfig = {
  firebase,
  config: { useFirestoreForProfile: true, userProfile: 'users', attachAuthIsReady: true },
  dispatch: store.dispatch,
  createFirestoreInstance
}

const AppSetup = (
  <Provider store={store}>
    <ReactReduxFirebaseProvider { ...reactReduxFirebaseConfig }>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ReactReduxFirebaseProvider>
  </Provider>
);
ReactDOM.render(AppSetup, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
