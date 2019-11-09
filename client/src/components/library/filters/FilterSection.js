import React, { useState, useEffect } from 'react';
import { Box, makeStyles, Typography, Collapse } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { useWidth } from '../../../config/MuiTheme';
import { isSmallScreen } from '../../../utils';

const useStyles = makeStyles(theme => ({
  header:{
    backgroundColor: theme.palette.grey[300],
    padding: theme.spacing(0.5, 1),
    color: theme.palette.grey[900],
    cursor: "pointer"
  },
  btn:{
    cursor:"pointer"
  }
}))

const FilterSection = ({ label, children }) => {
  const screenWidth = useWidth();
  useEffect(() => {
    setOpen((!isSmallScreen(screenWidth)))
  }, [screenWidth])
  const [open, setOpen] = useState(() => (!isSmallScreen(screenWidth)) );
  const classes = useStyles();
  return (
    <>
    <Box className={classes.header} display="flex" justifyContent="space-between" onClick={()=> setOpen(!open)} >
      <Typography variant="body2" color="inherit">{label}</Typography>
      { !open ? <AddIcon className={classes.btn} fontSize="small" /> : 
             <RemoveIcon className={classes.btn} fontSize="small" />
      }
    </Box>
    <Collapse in={open}>
      <Box p={1}>
        {children}
      </Box>
    </Collapse>
    </>
  );
}
 
export default FilterSection;