import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Badge,  IconButton, Toolbar, AppBar } from '@material-ui/core';
import { Mail as MailIcon, Notifications as NotificationsIcon} from '@material-ui/icons';
import logo from '../../../assets/images/logo.png';
import { Link as RouterLink } from 'react-router-dom';
import MainMenu from './MainMenu';
import AccountMenu from './AccountMenu';
import SubNavigation from './SubNavigation';
import Drawer from "./Drawer";
import { useWidth } from '../../../config/MuiTheme';
import { isSmallScreen } from '../../../utils';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2)
  },
  logo: {
    flexGrow: 1,
    [theme.breakpoints.up('md')] : {
      flexGrow: 0,
    }
  }
}));

const AppNavbar = props =>  {
  const classes = useStyles();
  const screenWidth = useWidth();
  const isMobile = useMemo(() => (isSmallScreen(screenWidth)), [screenWidth]);
  return (
    <div className={classes.root}>
      <AppBar position="static" elevation={isMobile ? 2 : 0}>
        <Container>
          <Toolbar>
            { isMobile ? <Drawer /> : null }
            <RouterLink to="/" className={classes.logo}>
              <img src={logo} alt="logo" className={classes.title} />
            </RouterLink>
            { isMobile ? null : <MainMenu history={props.history} /> }
            <div>
              <IconButton aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton aria-label="show 17 new notifications" color="inherit">
                <Badge badgeContent={17} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <AccountMenu />
            </div>
          </Toolbar>
        </Container>
      </AppBar>
      { 
        isMobile ? null : <SubNavigation match={props.match} history={props.history}/>
      }
    </div>
  );
}


export default  AppNavbar;