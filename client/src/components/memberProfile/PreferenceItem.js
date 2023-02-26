import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, makeStyles, Button } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';

const useStyles = makeStyles(theme => ({
  root:{
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: theme.palette.grey[200],
    display: 'flex',
    justifyContent: "space-between",
    alignItems: "center"
  },
  check:{
    color: 'green'
  },
  noMatch:{
    backgroundColor: theme.palette.grey[400],
    width: 25,
    height: 3
  }
}))

const PreferenceItem = ({label, preference, check=false}) => {
  const classes = useStyles();
  const [wrap, setWrap] = useState(true);
  const preferenceRef = useRef();
  useEffect(() => {
    if(!preferenceRef.current) return;
    if(preferenceRef.current.scrollWidth <= preferenceRef.current.offsetWidth)
      setWrap(false);
  }, []);
  return (
    <Box className={classes.root} px={1} mb={1}>
      <Box minWidth={0}>
        <Typography color="primary">{label}</Typography>
        <Box display="flex" justifyContent="space-between" alignItems="baseline">
          <Typography color="textSecondary" gutterBottom noWrap={wrap} ref={preferenceRef}>
            {preference}
          </Typography>
          {
            !wrap ? null :
            <Box ml={1}>
              <Button color="primary" onClick={() => setWrap(false)}>More</Button>
            </Box> 
          }
        </Box>
      </Box>
      <Box className={classes.check} minWidth={30} ml={3} textAlign="center">
        {check ? <CheckIcon /> : <div className={classes.noMatch}></div>}
      </Box>
    </Box>
  );
}
 
export default PreferenceItem;