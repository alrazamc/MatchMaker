import React, { useEffect, useState } from 'react';
import Navbar from './components/template/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Home from './components/home/Home';
import AppPreloader from './components/template/AppPreloader';
import { connect } from 'react-redux';
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



function App({ isAuthLoaded, loadAuth, updateLastActive, uid }) {
  const classes = useStyles();
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
    updateLastActive();
    setActiveInterval(
      setInterval(updateLastActive, process.env.REACT_APP_ACTIVE_INTERVAL * 60 * 1000)
    );
    return () => {
      activeInterval && clearInterval(activeInterval) && setActiveInterval(null);
    }
  }, [updateLastActive, uid, activeInterval]);

  if(!isAuthLoaded) return <AppPreloader />;
  return (
    <Router>
      <div className={clsx('App', classes.app)}>
        <Navbar />
        <Container className={classes.container} >
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/reset-password" component={ResetPassword} />
            <Route path="/my/" component={ProfileRouter} />
            <Route path="/matches/" component={MatchesRouter} />
            <Route path="/search/" component={SearchRouter} />
            <Route path="/inbox/" component={InboxRouter} />
            <Route path="/profile/:profileId" component={MemberProfile} />
          </Switch>
        </Container>
      </div>
    </Router>
  );
}

const mapStateToProps = state => {
  return {
    isAuthLoaded: state.auth.isLoaded,
    uid: state.auth.uid ? state.auth.uid : null
  }
}

export default connect(mapStateToProps, { loadAuth, updateLastActive })(App);
