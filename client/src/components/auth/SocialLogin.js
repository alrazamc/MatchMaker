import React, { useEffect } from 'react';
import { Box, Button, makeStyles } from '@material-ui/core';
import googleIcon from '../../assets/images/googleIcon.png';
import facebookIcon from '../../assets/images/facebookIcon.png';
import { connect } from 'react-redux';
import { loadAuth, logOut } from '../../store/actions/AuthActions';

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

const windowPopup = (url, title, w, h) => {
  var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  var dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
  var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width;
  var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : window.screen.height;
  var systemZoom = width / window.screen.availWidth;
  var left = (width - w) / 2 / systemZoom + dualScreenLeft
  var top = (height - h) / 2 / systemZoom + dualScreenTop
  var newWindow = window.open(url, title, 'scrollbars=yes,status=yes,location=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
  // Puts focus on the newWindow
  if (window.focus) newWindow.focus();
  return newWindow;
}

const SocialLogin = (props) => {
  const classes = useStyles();
  useEffect(() => {
    window.loadAuth = props.loadAuth;
    window.logOut = props.logOut;
    return () => {
      delete window.loadAuth;
      delete window.logOut;
    }
  }, [props.loadAuth, props.logOut]);
  
  const login = (url) => {
    windowPopup(process.env.REACT_APP_BASE_URL + url, '_blank', 520, 570);
  }

  return (
    <Box textAlign="center" mt={3}>
      <Button onClick={() => login('auth/google')} type="button" variant="outlined" className={classes.socialButton}>
        <img src={googleIcon} alt="Google" className={classes.icon} /> Connect With Google
      </Button>
      <br />
      <Button onClick={() => login('auth/facebook')} type="button" variant="outlined" className={classes.socialButton}>
        <img src={facebookIcon} alt="Facebook" className={classes.icon} /> Connect With Facebook
      </Button>
    </Box>
  );
}
 
export default connect(null, { loadAuth, logOut })(SocialLogin);