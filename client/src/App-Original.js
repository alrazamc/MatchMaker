import React, { useEffect, useState } from 'react';
import Navbar from './components/template/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AppPreloader from './components/template/AppPreloader';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { loadAuth } from './store/actions/AuthActions';
import { updateLastActive } from './store/actions/ProfileActions';
import { makeStyles, Container } from '@material-ui/core';
import clsx from 'clsx';
import ResetPassword from './components/auth/ResetPassword';
import ProfileRouter from './components/profile/ProfileRouter';
import MatchesRouter from './components/matches/MatchesRouter';
import SearchRouter from './components/search/SearchRouter';
import InboxRouter from './components/inbox/InboxRouter';
import MemberProfile from './components/memberProfile/MemberProfile';
import withSystem from './components/library/withSystem';
import { systemNames } from './config/systemNames';
import { signinWithFirebase, signOutFromFirebase } from './store/actions/AuthActions';
import { loadAllConnections } from './store/actions/ConnectionActions';
import { loadNotifications } from './store/actions/NotificationActions';
import MobileChat from './components/chat/MobileChat';
import DesktopChat from './components/chat/DesktopChat';
import { useFirebase } from 'react-redux-firebase';

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

// function onRenderCallback(
//   id, // the "id" prop of the Profiler tree that has just committed
//   phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
//   actualDuration, // time spent rendering the committed update
//   baseDuration, // estimated time to render the entire subtree without memoization
//   startTime, // when React began rendering this update
//   commitTime, // when React committed this update
//   interactions // the Set of interactions belonging to this update
// ) {
//   const stats = {
//     id, // the "id" prop of the Profiler tree that has just committed
//   phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
//   duration: Math.round(actualDuration), // time spent rendering the committed update
//   }
//   if(phase === 'mount')
//   console.log(stats);
// }

function App({ isAuthLoaded, loadAuth, uid, signinWithFirebase, signOutFromFirebase, loadAllConnections, loadNotifications }) {
  const classes = useStyles();
  const firebase = useFirebase();
  const [activeInterval, setActiveInterval] = useState(null);
  useEffect(() => {
    loadAuth();
  }, [loadAuth]);
  
  useEffect(() => {
    if(!uid)
    {
      if(activeInterval)
      {
        clearInterval(activeInterval);
        setActiveInterval(null);
      }
      return;
    }
    if(activeInterval) return;
    loadNotifications(true);//true=>firsttime, don't merge payload to requests
    setActiveInterval(
      setInterval(loadNotifications, process.env.REACT_APP_ACTIVE_INTERVAL * 60 * 1000)
    );
    return () => {
      activeInterval && clearInterval(activeInterval) && setActiveInterval(null);
    }
  }, [loadNotifications, uid, activeInterval]);
  useEffect(() => {
    if(!isAuthLoaded) return;
    if(!uid) signOutFromFirebase(firebase);
    signinWithFirebase(firebase);
    if(uid){
      loadAllConnections();
    }
  }, [signinWithFirebase, signOutFromFirebase, uid, isAuthLoaded, loadAllConnections])

  if(!isAuthLoaded) return <AppPreloader />;
  return (
    <Router>
      <div className={clsx('App', classes.app)}>
        <Navbar />
        <Container className={classes.container} >
          <Switch>
            <Route exact path="/" component={SignIn} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/reset-password" component={ResetPassword} />
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
  );
}

// const MeasureSignin = () => (<Measure Component={SignIn} id="signin" />);
// const MeasureSignUp = () => (<Measure Component={SignUp} id="signup" />);
// const MeasureRestPassword = () => (<Measure Component={ResetPassword} id="reset-password" />);
// const MeasureMyProfile = () => (<Measure Component={ProfileRouter} id="my-profile" />);
// const MeasureMatches = () => (<Measure Component={MatchesRouter} id="matches" />);
// const MeasureSearch = () => (<Measure Component={SearchRouter} id="search" />);
// const MeasureInbox = () => (<Measure Component={InboxRouter} id="inbox" />);
// const MeasureMemberProfile = () => (<Measure Component={MemberProfile} id="mem-profile" />);
// const MeasureChat = () => (<Measure Component={MobileChat} id="mobile-chat" />);

// const Measure = ({Component, id}) => {
//   return (
//     <React.Profiler id={id} onRender={onRenderCallback}>
//       <Component />
//     </React.Profiler>
//   )
// }

const mapStateToProps = state => {
  return {
    isAuthLoaded: state.auth.isLoaded,
    uid: state.auth.uid
  }
}

export default compose(
withSystem(systemNames),
connect(mapStateToProps, { loadAuth, updateLastActive, signinWithFirebase, signOutFromFirebase, loadAllConnections, loadNotifications })
)(App);
