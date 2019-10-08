import React, { useCallback } from 'react'
import { Paper, Tabs, Tab, makeStyles  } from '@material-ui/core';
import { useWidth } from '../../config/MuiTheme';
import { profileRoutes as routes  } from '../../config/routes';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(2)
  },
  tab: {
    paddingTop: 0,
    paddingBottom: 0
  }
}))


const Navigation = ({ match, history }) => {
  const classes = useStyles();
  const screenSize = useWidth();
  const [value] = React.useState( () => routes.findIndex(item => item.path === match.path) );  
  const handleChange = useCallback((event, newValue) => {
    history.push(routes[newValue].path);
  }, [history]);
  
  return (
    <Paper className={classes.root} elevation={3} square>
      <Tabs
      value={value}
      onChange={handleChange}
      indicatorColor="primary"
      textColor="primary"
      scrollButtons="on"
      variant={screenSize !== 'xs' ? "standard" : "scrollable"} 
      centered={screenSize !== 'xs'}
      >
      {
        routes.map((item, index) => (
          <Tab className={classes.tab} key={index} label={item.label} />
        ))
      }
      </Tabs>
    </Paper>
  );
}
 
export default Navigation;