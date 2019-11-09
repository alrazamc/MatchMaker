import React from 'react';
import { Box, Select, FormControl, MenuItem, makeStyles } from '@material-ui/core';
import { updateSortBy } from '../../../store/actions/PeopleActions';
import { connect } from 'react-redux';

const useStyles = makeStyles(theme => ({
  formControl:{
    marginTop: 0
  },
  select:{
    padding: theme.spacing(0, 1)
  }
}))

const SortBy = ({sortBy, updateSortBy}) => {
  const classes = useStyles();
  return (
    <Box minWidth={144}>
      <FormControl variant="outlined" color="primary" margin="dense" fullWidth={true} className={classes.formControl}>
        <Select autoWidth={true} value={sortBy} onChange={event => updateSortBy(event.target.value)} className={classes.select} >
          <MenuItem value="lastUpdated">Default</MenuItem>
          <MenuItem value="joinedOn">Newest First</MenuItem>
          <MenuItem value="lastActive">Last Active</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

const mapStateToProps = state => {
  return {
    sortBy: state.people.filters && state.people.filters.sortBy ? state.people.filters.sortBy : "lastUpdated"
  }
}
export default connect(mapStateToProps, {updateSortBy})(SortBy);