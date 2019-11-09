import React from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import dayjs from 'dayjs';
import DotIcon from '@material-ui/icons/FiberManualRecord';

const useStyles = makeStyles(theme => ({
  active:{
    color: theme.palette.text.hint,
    marginBottom: 3
  },
  online: {
    color: theme.palette.text.primary
  },
  OnlineDot: {
    color: "green"
  }
}));

const Online = ({ time, currentTime}) => {
  const classes = useStyles();
  const refreshTime = parseInt(process.env.REACT_APP_ACTIVE_INTERVAL) - 1;
  const now = dayjs(currentTime);
  const minuteDiff = now.diff(time, 'minute');
  const hourDiff = now.diff(time, 'hour');
  const dayDiff = now.diff(time, 'day');
  return (
    <Box display="flex" alignItems="center">
      <Box>
        <DotIcon className={minuteDiff >= 0 && minuteDiff <= refreshTime ? classes.OnlineDot : classes.active} fontSize="small" />
      </Box>
      <Typography className={classes.active}>
      { minuteDiff >= 0 && minuteDiff <= refreshTime ? <span className={classes.online} > Online</span> : null}
      { minuteDiff > refreshTime && minuteDiff <= 59 ? `${ minuteDiff }m ago` : null}
      {hourDiff !== 0 && hourDiff <= 23 ? `${ hourDiff }h ago` : null}
      { dayDiff !== 0 && dayDiff < 7 ? `${ dayDiff }d ago` : null}
      { dayDiff !== 0 && dayDiff > 7 && dayDiff < 14 ? '1w ago' : null}
      { dayDiff !== 0 && dayDiff >= 14 ? '2w ago' : null}
    </Typography>
    </Box>
  );
}
 
export default Online;