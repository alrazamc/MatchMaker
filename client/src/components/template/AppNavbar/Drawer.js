import React, { useState, useCallback } from 'react';
import { makeStyles, SwipeableDrawer, IconButton, List, Divider, ListItem, ListItemIcon, ListItemText, Box, Typography, Collapse } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import CollapsedIcon from '@material-ui/icons/ChevronRightOutlined';
import ExpandedIcon from '@material-ui/icons/ExpandMoreOutlined';

import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import ProfileIcon from '@material-ui/icons/PersonOutlineOutlined';
import PhotosIcon from '@material-ui/icons/PhotoLibraryOutlined';
import PartnerIcon from '@material-ui/icons/WcOutlined';
import SettingsIcon from '@material-ui/icons/Settings';

import SuggestedIcon from '@material-ui/icons/PeopleAltOutlined';
import ShortlistedIcon from '@material-ui/icons/FavoriteBorderOutlined';

import SearchIcon from '@material-ui/icons/SearchOutlined';
import AdvancedSearchIcon from '@material-ui/icons/FindInPageOutlined';

import SentRequestIcon from '@material-ui/icons/CallMadeOutlined';
import ReceivedRequestIcon from '@material-ui/icons/CallReceivedOutlined';
import ConnectionsIcon from '@material-ui/icons/SyncAltOutlined';

import ProfileAvatar from '../../library/ProfileAvatar';
import { connect } from 'react-redux';
import { Link as RouterLink, withRouter } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    display: "inline-flex",
    marginRight: theme.spacing(2)
  },
  list: {
    width: 320,
  },
  subList: {
    paddingLeft: theme.spacing(3)
  },
  activeMenu: {
    backgroundColor: theme.palette.grey['200']
  }
}));

const Drawer = ({name, email, phoneNumber, location}) => {
  const classes = useStyles();
  const [opened, setOpened] = useState(false);
  const [menus, setMenus] = useState(props => {
    const segments =  location.pathname.split('/');
    const menuState = {
      my: false,
      matches: true,
      search: true,
      inbox: true
    }
    if(segments[1] && menuState[segments[1]] !== undefined)
      menuState[segments[1]] = true;
    return menuState;
  });
  
  const toggleMenu = useCallback((name, value=null) => {
    setMenus({
      ...menus,
      [name]: !menus[name]
    })
  }, [menus]);
  
  const toggleDrawer = useCallback( (open) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift'))
      return;
    setOpened(open);
  }, []);

  const SubItem = useCallback(({to, Icon, label}) => {
    return (
      <ListItem button key={to} component={RouterLink} className={location.pathname === to.split('?')[0] ? classes.activeMenu : null} to={to} onClick={toggleDrawer(false)}>
        <ListItemIcon>{<Icon />}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItem>
    )
  }, [toggleDrawer, classes.activeMenu, location.pathname])

  return (
    <div className={classes.root}>
      <IconButton
        edge="start"
        className={classes.drawerButton}
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer(true)}
        >
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        open={opened}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
      <div className={classes.list} role="presentation"  onKeyDown={toggleDrawer(false)} >
        <Box display="flex" justifyContent="space-between">
          <Box padding={1} paddingX={0}>
            <IconButton to="/my/profile" component={RouterLink} onClick={toggleDrawer(false)}>
              <ProfileAvatar size={60} />
            </IconButton>
          </Box>
          <Box alignSelf="center" flexGrow={1} position="relative">
            <Typography variant="h6" >{name}</Typography>
            <Typography color="textSecondary">{email ? email : phoneNumber}</Typography>
            <Box position="absolute" top={-25} right={1}>
              <IconButton to="/my/account-settings" component={RouterLink}  onClick={toggleDrawer(false)}>
                <SettingsIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Divider />
          <List>
            <ListItem button key="profile" onClick={() => toggleMenu('my')} className={location.pathname.startsWith('/my/') ? classes.activeMenu : null}>
              <ListItemIcon>{ menus.my ? <ExpandedIcon /> : <CollapsedIcon /> }</ListItemIcon>
              <ListItemText primary="My Profile" />
            </ListItem>
            <Collapse in={menus.my} className={classes.subList}>
              <SubItem to="/my/dashboard" Icon={DashboardIcon} label="Dashboard" />
              <SubItem to="/my/profile" Icon={ProfileIcon} label="Edit Profile" />
              <SubItem to="/my/photos" Icon={PhotosIcon} label="Photos" />
              <SubItem to="/my/partner-preference" Icon={PartnerIcon} label="Partner Preference" />
              <SubItem to="/my/account-settings" Icon={SettingsIcon} label="Settings" />
            </Collapse>
            <ListItem button key="matches" onClick={() => toggleMenu('matches')} className={location.pathname.startsWith('/matches/') ? classes.activeMenu : null}>
              <ListItemIcon>{ menus.matches ? <ExpandedIcon /> : <CollapsedIcon /> }</ListItemIcon>
              <ListItemText primary="Matches" />
            </ListItem>
            <Collapse in={menus.matches} className={classes.subList}>
              <SubItem to="/matches/suggestions" Icon={SuggestedIcon} label="Suggestions" />
              <SubItem to="/matches/shortlisted" Icon={ShortlistedIcon} label="Shortlisted" />
            </Collapse>
            <ListItem button key="search" onClick={() => toggleMenu('search')} className={location.pathname.startsWith('/search/') ? classes.activeMenu : null}>
              <ListItemIcon>{ menus.search ? <ExpandedIcon /> : <CollapsedIcon /> }</ListItemIcon>
              <ListItemText primary="Search" />
            </ListItem>
            <Collapse in={menus.search} className={classes.subList} >
              <SubItem to="/search/basic?editBasic=true" Icon={SearchIcon} label="Basic Search" />
              <SubItem to="/search/advanced?editAdvanced=true" Icon={AdvancedSearchIcon} label="Advanced Search" />
            </Collapse>
            <ListItem button key="inbox" onClick={() => toggleMenu('inbox')} className={location.pathname.startsWith('/inbox/') ? classes.activeMenu : null}>
              <ListItemIcon>{ menus.inbox ? <ExpandedIcon /> : <CollapsedIcon /> }</ListItemIcon>
              <ListItemText primary="Inbox" />
            </ListItem>
            <Collapse in={menus.inbox} className={classes.subList}>
              <SubItem to="/inbox/sent" Icon={SentRequestIcon} label="Sent Requests" />
              <SubItem to="/inbox/received" Icon={ReceivedRequestIcon} label="Received Requests" />
              <SubItem to="/inbox/connections" Icon={ConnectionsIcon} label="Connections" />
            </Collapse>
          </List>
        </div>
      </SwipeableDrawer>
    </div>
  );
}

const mapStateToProps = (state) => {
  let name = ""; 
  let email = "";
  let phoneNumber = "";
  if(state.profile && state.profile.basicInfo)
  {
    if(state.profile.basicInfo.firstName)
      name += state.profile.basicInfo.firstName;
    if(state.profile.basicInfo.lastName)
      name += " " + state.profile.basicInfo.lastName;
  }
  if(state.auth.account.email)
    email = state.auth.account.email;
  if(state.auth.account.phoneNumber)
    phoneNumber = state.auth.account.phoneNumber;
  return {
    name,
    email,
    phoneNumber
  }
}

export default withRouter(connect(mapStateToProps)(Drawer));