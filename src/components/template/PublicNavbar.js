import React from 'react';
import { Toolbar, AppBar, Button, makeStyles, Container } from '@material-ui/core';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  logo: {
    flexGrow: 1
  },
  button: {
    margin: theme.spacing(1)
  }
}));

const PublicNavbar = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Container>
          <Toolbar>
            <Link to="/" className={classes.logo}>

              <img src={logo} alt="logo" className={classes.title} />
            </Link>
            <Button component={Link} to="/signin" className={classes.button} variant="outlined" color="inherit">Sign In</Button>
            <Button component={Link} to="/signup" className={classes.button} variant="outlined" color="inherit">Sign Up</Button>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}
 
export default PublicNavbar;