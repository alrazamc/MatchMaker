import React from 'react';
import Navbar from './components/template/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Home from './components/home/Home';
import Profile from './components/profile/Profile';
import EditProfile from './components/profile/edit/EditProfile';
import AppPreloader from './components/template/AppPreloader';
import { connect } from 'react-redux';





function App({ isAuthLoaded }) {
  if(!isAuthLoaded) return <AppPreloader />;
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route exact path="/profile" component={Profile} />
          <Route path="/profile/edit" component={EditProfile} />
        </Switch>
      </div>
    </Router>
  );
}

const mapStateToProps = state => {
  return {
    isAuthLoaded: state.firebase.auth.isLoaded
  }
}

export default connect(mapStateToProps)(App);
