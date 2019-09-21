import React from 'react';
import { Toolbar, AppBar, Button, makeStyles, Container } from '@material-ui/core';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logOut } from '../../store/actions/AuthActions';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(2)
  },
  logo: {
    flexGrow: 1
  },
  button: {
    margin: theme.spacing(1)
  }
}));

const AppNavbar = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Container>
          <Toolbar>
            <Link to="/" className={classes.logo}>
              <img src={logo} alt="logo" className={classes.title} />
            </Link>
            <Button className={classes.button} onClick={props.logOut} variant="outlined" color="inherit">Log Out</Button>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

const mapStateToProps = state => {
  return {};
}

export default  connect(mapStateToProps, { logOut })(AppNavbar);