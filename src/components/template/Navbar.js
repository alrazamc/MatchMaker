import React from 'react';
import PublicNavbar from './PublicNavbar';
import AppNavbar from './AppNavBar';
import { connect } from 'react-redux';

const Navbar = ({ auth }) => {
  return auth.uid ? <AppNavbar /> : <PublicNavbar />;
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth
  }
}

export default connect(mapStateToProps)(Navbar);