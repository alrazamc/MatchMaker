import React, { useEffect } from 'react'
import { Paper, Tabs, Tab, makeStyles  } from '@material-ui/core';
import { connect } from 'react-redux';
import {  matchesRoutes } from '../../../config/routes';
import { useHistory } from 'react-router-dom';

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


const SubNavigation = ({ routes }) => {
  const classes = useStyles();
  const history = useHistory();
  const [value, setValue] = React.useState(0);
  useEffect(() => {
    const index = routes.findIndex(item => item.path.split('?')[0] === history.location.pathname);
    if(index >= 0) setValue(index);
  }, [history.location.pathname, routes])  
  const handleChange = (event, newValue) => {
    if(newValue === value) return;
    history.push(routes[newValue].path);
    setValue(newValue);
  };
  
  return (
    <Paper className={classes.root} elevation={3} square>
      <Tabs
      value={routes[value] ? value : 0}
      onChange={handleChange}
      indicatorColor="primary"
      textColor="primary"
      scrollButtons="on"
      variant="standard" 
      centered={true}
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
 
const mapStateToProps = state => {
  return {
    routes: state.routes.length ? state.routes : matchesRoutes
  }
}
export default connect(mapStateToProps)(SubNavigation);