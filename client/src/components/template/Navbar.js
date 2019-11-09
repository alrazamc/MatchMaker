import React from 'react';
import PublicNavbar from './PublicNavbar';
import AppNavbar from './AppNavbar/AppNavbar';
import { connect } from 'react-redux';
import { withRouter  } from 'react-router-dom';

const Navbar = ({ auth, ...props }) => {
  return auth.uid ? <AppNavbar {...props} /> : <PublicNavbar {...props} />;
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

export default withRouter(connect(mapStateToProps)(Navbar));