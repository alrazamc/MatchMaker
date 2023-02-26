import React, { useEffect } from 'react';
import { Tabs, Tab, makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { updateFilters } from '../../store/actions/InboxActions';
import { useLocation, useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    borderBottom: 1,
    borderBottomStyle: "solid",
    borderBottomColor: theme.palette.grey[400]
  },
  tab: {
    paddingTop: 0,
    paddingBottom: 0
  }
}))

const Navigation = ({ updateFilters, tabs }) => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const status = location.pathname.split('/').pop();
  const [value, setValue] = React.useState(0);
  useEffect(() => {
    if(status)
    {
      let index = tabs.findIndex(item => item.title.toLowerCase() === status);
      if(index !== value)
        setValue(index);
    }
  }, [status, value, tabs])
  const handleChange = (event, newValue) => {
    if (newValue === value) return;
    history.push(tabs[newValue].title.toLowerCase())
    setValue(newValue);
    updateFilters('status', tabs[newValue] ? tabs[newValue].id : 1);
  }
  return (
    <Tabs
      value={value}
      onChange={handleChange}
      indicatorColor="primary"
      textColor="primary"
      scrollButtons="on"
      variant="standard"
      centered={true}
      className={classes.root}
    >
      {
        tabs.map((item, index) => (
          <Tab className={classes.tab} key={item.id} label={item.title} />
        ))
      }
    </Tabs>
  );
}

export default connect(null, { updateFilters })(Navigation)