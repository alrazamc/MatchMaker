import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles, Box, Typography, Link, Collapse } from '@material-ui/core';
import { changeFilters } from '../../store/actions/PeopleActions';
import { deleteSearch } from '../../store/actions/ProfileActions';
import { useHistory } from 'react-router-dom';
import { useWidth } from '../../config/MuiTheme';
import { isSmallScreen } from '../../utils';
import ArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const useStyles = makeStyles(theme => ({
  root:{
    borderRadius: 3
  },
  header:{
    backgroundColor: theme.palette.grey[400],
    padding: theme.spacing(1.3, 2),
    color: theme.palette.grey[800],
    cursor: "pointer",
    boxSizing: "border-box"
  },
  searchName: {
    fontWeight: theme.typography.fontWeightBold,
    cursor: "pointer"
  },
  actionBtn: {
    cursor: "pointer"
  }
}))

const SavedSearchesList = ({searches, editSearch, showResults, changeFilters, deleteSearch}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const routerHistory = useHistory();
  const screenWidth = useWidth();
  useEffect(() => {
    if(isSmallScreen(screenWidth))
      setOpen(false);
  }, [screenWidth])
  const routeType = routerHistory.location.pathname.split('/').pop();
  if(searches.length === 0) return null;
  const loadResults = (item) => {
    changeFilters(item); 
    showResults(true);
    if(routeType !== item.searchType)
      routerHistory.push('/search/' + item.searchType);
  }
  return (
    <Box width="100%" className={classes.root} border={1} borderColor="grey.400">
      <Box textAlign="center" width="100%" className={classes.header} mb={open ? 1 : 0} onClick={() => setOpen(!open)} display="flex" alignItems="center">
        <Box flexGrow={1} minWidth={0}>
          <Typography variant="body1" color="inherit" noWrap={true}> Saved Searches</Typography>
        </Box>
        { open ? <ArrowUpIcon /> : <ArrowDownIcon /> }
      </Box>
      <Collapse in={open}>
        {
          searches.map(item => (
            <Box px={2} mb={1} key={item._id} display="flex"  alignItems="center" justifyContent="space-between">
              <Box minWidth={0}>
                <Typography noWrap={true} className={classes.searchName} ><Link onClick={() => loadResults(item) }>{item.searchName}</Link></Typography>
              </Box>
              <Box minWidth={76}>
                <Typography variant="subtitle2">
                  <Link className={classes.actionBtn} onClick={() => editSearch(item)}>Edit</Link> | <Link onClick={() => deleteSearch(item._id)} className={classes.actionBtn}>Delete</Link>
                </Typography>
              </Box>
            </Box>
          ))
        }
      </Collapse>
    </Box>
  );
}
 
const mapStateToProps = state => {
  const searches = state.profile.searches ? state.profile.searches : []
  return { searches }
}
export default connect(mapStateToProps, {changeFilters, deleteSearch})(SavedSearchesList);