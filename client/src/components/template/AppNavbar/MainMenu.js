import React from 'react';
import { makeStyles, Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import ActiveIcon from '@material-ui/icons/ArrowDropUp';

const useStyles = makeStyles(theme => ({
  menuContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: "center"
  },
  menuButton: {
    margin: theme.spacing(0, 2),
    position: "relative"
  },
  activeIcon: {
    position: "absolute",
    top: "27px",
    fontSize: "40px"
  }
}))


const MainMenu = (props) => {
  const pathName = props.history.location.pathname;
  const classes = useStyles();

  return (
    <div className={classes.menuContainer}>
      <Button color="inherit" to="/my/dashboard" className={classes.menuButton} component={RouterLink}>
        Dashboard 
        { pathName.startsWith("/my/") && <ActiveIcon className={classes.activeIcon} /> }
      </Button>
      <Button color="inherit" to="/matches/suggestions" className={classes.menuButton} component={RouterLink}>
        Matches
        { pathName.startsWith("/matches/") && <ActiveIcon className={classes.activeIcon} /> }
      </Button>
      <Button color="inherit" to="/search/basic?editBasic=true" className={classes.menuButton} component={RouterLink}>
        Search
        { pathName.startsWith("/search/") && <ActiveIcon className={classes.activeIcon} /> }
      </Button>
      <Button color="inherit" to="/inbox/sent" className={classes.menuButton} component={RouterLink}>
        Inbox
        { pathName.startsWith("/inbox/") && <ActiveIcon className={classes.activeIcon} /> }
      </Button>
    </div>
  );
}
 
export default MainMenu;