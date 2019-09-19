import React, { useState } from 'react';
import { Box, Button, makeStyles, FormHelperText } from '@material-ui/core';
import googleIcon from '../../assets/googleIcon.png';
import facebookIcon from '../../assets/facebookIcon.png';
import { getFirebase } from 'react-redux-firebase';

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(1)
  },
  socialButton: {
    marginBottom: theme.spacing(1),
    textTransform: "capitalize"
  },
  error: {
    textAlign: "center"
  }
}))

const SocialLogin = () => {
  const classes = useStyles();
  const [error, setError] = useState(null);
  const firebase = getFirebase();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  fbProvider.addScope('email');
  fbProvider.setCustomParameters({
    'display': 'popup'
  });
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  googleProvider.addScope('email');
  
  const login = provider => {
    firebase.auth().signInWithPopup(provider).then(function(result) {
    }).catch(function(error) {
      setError(error.message);
    });
  }

  return (
    <Box textAlign="center" mt={3}>
      <Button onClick={() => login(googleProvider)} type="button" variant="outlined" className={classes.socialButton}>
        <img src={googleIcon} alt="Google" className={classes.icon} /> Connect With Google
      </Button>
      <br />
      <Button onClick={() => login(fbProvider)} type="button" variant="outlined" className={classes.socialButton}>
        <img src={facebookIcon} alt="Facebook" className={classes.icon} /> Connect With Facebook
      </Button>
      <br />
      { error &&
        <FormHelperText className={classes.error} error={true} > {error} </FormHelperText> 
      }
    </Box>
  );
}
 
export default SocialLogin;