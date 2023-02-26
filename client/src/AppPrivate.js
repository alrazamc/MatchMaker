import React, { useEffect, useState } from 'react';
import AppNavbar from './components/template/AppNavbar/AppNavbar';
import { BrowserRouter as Router, Switch, Route, useHistory, Redirect } from 'react-router-dom';
import { connect, useStore } from 'react-redux';
import { makeStyles, Container, Snackbar } from '@material-ui/core';
import clsx from 'clsx';
import ProfileRouter from './components/profile/ProfileRouter';
import MatchesRouter from './components/matches/MatchesRouter';
import SearchRouter from './components/search/SearchRouter';
import InboxRouter from './components/inbox/InboxRouter';
import MemberProfile from './components/memberProfile/MemberProfile';
import { signinWithFirebase } from './store/actions/AuthActions';
import { loadAllConnections } from './store/actions/ConnectionActions';
import { loadNotifications } from './store/actions/NotificationActions';
import MobileChat from './components/chat/MobileChat';
import DesktopChat from './components/chat/DesktopChat';

import { staticReducers  } from './store/reducers/rootReducer';
import { firebaseReducer } from 'react-redux-firebase'; 
import { firestoreReducer } from 'redux-firestore';
import { combineReducers } from 'redux';

import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import firebase from './config/FbConfig';
import Dashboard from './components/profile/dashboard/Dashboard';
import { saveDeviceToken } from './store/actions/NotificationActions';
import { reqNotificationPermission, monitorDeviceToken, messaging } from './config/FbConfig';

const rootReducerWithFirebase = combineReducers({
  ...staticReducers,
  firebase: firebaseReducer,
  firestore: firestoreReducer
})

const reactReduxFirebaseConfig = {
  firebase,
  config: {},
  createFirestoreInstance
}



const useStyles = makeStyles(theme => ({
  app: {
    display: 'flex',
    flexFlow: "column",
    height: "100%"
  },
  container: {
    flexGrow: 1
  }
}));

function AppPrivate({ signinWithFirebase, loadAllConnections, loadNotifications, saveDeviceToken }) {
  const classes = useStyles();
  const store = useStore();
  const [open, setOpen] = useState(false); //notification Snackbar
  const [message, setMessage] = useState("");
  useEffect(() => {
    store.replaceReducer(rootReducerWithFirebase);
  }, [])
  useEffect(() => {
    loadNotifications(true);//true=>firsttime, don't merge payload to requests
    let activeInterval = setInterval(loadNotifications, process.env.REACT_APP_ACTIVE_INTERVAL * 60 * 1000)
    return () => {
      activeInterval && clearInterval(activeInterval);
    }
  }, [loadNotifications]);
  useEffect(() => {
    signinWithFirebase(firebase);
    let timeout = setTimeout(loadAllConnections, 2000);
    return () => timeout && clearTimeout(timeout)
  }, [signinWithFirebase, loadAllConnections])

  useEffect(() => {
    reqNotificationPermission(saveDeviceToken);
    monitorDeviceToken(saveDeviceToken);
  }, [saveDeviceToken])

  useEffect(() => {
    messaging.onMessage((payload) => {
      if(payload.notification)
      {
        setMessage(payload.notification.body);
        setOpen(true);
      }
    });
    return () => messaging.onMessage((payload) => {})
  }, [])
  return (
    <ReactReduxFirebaseProvider { ...reactReduxFirebaseConfig } dispatch={store.dispatch}>
      <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={open} message={message} onClose={() => setOpen(false)} />
      <Router>
        <AuthCheck />
        <div className={clsx('App', classes.app)}>
          <AppNavbar />
          <Container className={classes.container} >
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route path="/my/" component={ProfileRouter} />
              <Route path="/matches/" component={MatchesRouter} />
              <Route path="/search/" component={SearchRouter} />
              <Route path="/inbox/" component={InboxRouter} />
              <Route path="/profile/:profileId" component={MemberProfile} />
              <Route path="/chat/:profileId" component={MobileChat} />
            </Switch>
          </Container>
          <DesktopChat />
        </div>
      </Router>
    </ReactReduxFirebaseProvider>
  );
}

const routes = ['/', '/signin', '/signup', '/reset-password'];
const AuthCheck = () => {
  const history = useHistory();
  if(!routes.includes(history.location.pathname)) return null;
  return <Redirect to="/my/dashboard" />
}

export default 
connect(null, { signinWithFirebase, loadAllConnections, loadNotifications, saveDeviceToken })
(AppPrivate);
