import React from 'react';
import { connect } from 'react-redux';
import { Box, Button, makeStyles } from '@material-ui/core';
import BackIcon from '@material-ui/icons/KeyboardBackspaceOutlined';
import { updatePageNumber } from '../../../store/actions/PeopleActions';

const useStyles = makeStyles(theme => ({
  btn:{
    margin: theme.spacing(0, 0.5)
  },
  numBtn:{
    margin: theme.spacing(0, 0.5),
    padding: 5,
    minWidth: 40
  },
  flipIcon: {
    transform: "rotate(180deg)"
  }
}))

const ProfileListPagination = ({ updatePageNumber, pageNumber, totalRecords, perPage }) => {
  const classes = useStyles();
  const totalPages = totalRecords === 0 ? 0 : Math.ceil(totalRecords/perPage);
  const nums = [pageNumber];
  if(totalPages - pageNumber >= 1)
    nums.push(pageNumber + 1);
  if(totalPages - pageNumber >= 2)
  nums.push(pageNumber + 2);
  if(totalPages - pageNumber >= 3)
    nums.push(pageNumber + 3);
  if(nums.length < 4 && pageNumber - 1 > 0)
    nums.unshift(pageNumber - 1);
  if(nums.length < 4 && pageNumber - 2 > 0)
    nums.unshift(pageNumber - 2);
  if(nums.length < 4 && pageNumber - 3 > 0)
    nums.unshift(pageNumber - 3);
  return (
    <Box width="100%" textAlign="center">
      <Button disabled={pageNumber === 1} onClick={() => updatePageNumber(1)} variant="outlined" color="primary" className={classes.numBtn}><BackIcon /></Button>
      {
        nums.map(number => 
          <Button disabled={pageNumber === number} onClick={() => updatePageNumber(number)} key={number} variant={pageNumber === number ? "contained" : "outlined"} color="primary" className={classes.numBtn} >{number}</Button>
        )
      }
      <Button disabled={pageNumber === totalPages} onClick={() => updatePageNumber(pageNumber + 1)} variant="outlined" color="primary" className={classes.numBtn}><BackIcon className={classes.flipIcon} /></Button>
    </Box>
  );
}

const mapStateToProps = state => {
  return{
    pageNumber: state.people.pageNumber,
    totalRecords: state.people.totalRecords,
    perPage: state.people.perPage
  }
}
 
export default connect(mapStateToProps, {updatePageNumber})(ProfileListPagination);