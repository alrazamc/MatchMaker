import React from 'react';
import { BrowserRouter as Router, Switch, Route, useHistory, Redirect } from 'react-router-dom';
import { makeStyles, Container } from '@material-ui/core';
import clsx from 'clsx';
import PublicNavbar from './components/template/PublicNavbar';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import ResetPassword from './components/auth/ResetPassword';

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

const AppPublic = () => {
  const classes = useStyles();
  return (
    <Router>
      <AuthCheck />
      <div className={clsx('App', classes.app)}>
        <PublicNavbar />
        <Container className={classes.container} >
          <Switch>
            <Route exact path="/" component={SignIn} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/reset-password" component={ResetPassword} />
          </Switch>
        </Container>
      </div>
    </Router>
  );
}

const routes = ['/', '/signin', '/signup', '/reset-password'];
const AuthCheck = () => {
  const history = useHistory();
  if(routes.includes(history.location.pathname)) return null;
  return <Redirect to="/" />
}

export default AppPublic;
