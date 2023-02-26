import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { updateFilters } from '../../store/actions/InboxActions';
import { FormControl, FormGroup, FormControlLabel, Checkbox, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  label:{
    fontSize: "14px"
  },
  formGroup:{
    marginTop: 5,
    marginBottom: 10,
    display: "flex",
    justifyContent: "center"
  },
  checkbox:{
    padding: 0
  }
}))

const initState = { connect: false, photo: false }

const Navigation = ({ updateFilters, reqType }) => {
  const classes = useStyles();
  const [type, setType] = React.useState(() => {
    if(reqType)
    {
      return {
        connect: reqType === 1,
        photo: reqType === 2
      }
    }
    return initState
  });

  const lastType = useRef();
  useEffect(() => {
    if(lastType.current && type.connect) // not mount &&
      updateFilters('type', 1);
    else if(lastType.current && type.photo)
      updateFilters("type", 2);
    else if (lastType.current && (lastType.current.connect || lastType.current.photo))
      updateFilters("type", null);
    lastType.current = type;
  }, [type, updateFilters]);
  
  useEffect(() => {
    if(!reqType)
      setType(initState)
  }, [reqType])

  return (
    <FormControl fullWidth={true}>
      <FormGroup row={true} className={classes.formGroup}>
        <FormControlLabel checked={type.connect} classes={{ label: classes.label }} onChange={() => setType({ connect: !type.connect, photo: false })} label="Connect Requests" control={<Checkbox className={classes.checkbox} color="primary" />} labelPlacement="end" />
        <FormControlLabel checked={type.photo} classes={{ label: classes.label }} onChange={() => setType({ connect: false, photo: !type.photo })} label="Photo Requests" control={<Checkbox className={classes.checkbox} color="primary" />} labelPlacement="end" />
      </FormGroup>
    </FormControl>
  );
}

const mapStateToProps = state => {
  return {
    reqType: state.inbox.filters ? state.inbox.filters.type : null
  }
}
export default connect(mapStateToProps, { updateFilters })(Navigation)