import React from 'react';
import { Box, Typography, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import MemberAvatar from '../memberProfile/MemberAvatar';

const useStyles = makeStyles(theme => ({
  message: {
    maxWidth: "80%",
    display: "inline-block"
  },
  text:{
    borderRadius: 5,
    padding: theme.spacing(1),
    whiteSpace: "pre-line",
  },
  memText: {
    backgroundColor: theme.palette.grey[200],
  },
  mytext:{
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  smallFont: {
    fontSize: "13px",
    lineHeight: "16px"
  }
}));

const Message = ({message, profile, desktop, myProfileId}) => {
  const classes = useStyles();
  const msgClasses = clsx(classes.text, message.from === myProfileId ? classes.mytext : classes.memText, desktop ? classes.smallFont : null );
  return (
    <Box textAlign={message.from === myProfileId ? 'right' : 'left'}>
      <Box my={1} className={classes.message}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" pr={message.from === myProfileId ? 2 : 0}>
          { message.from === myProfileId ? null :
            <Box maxWidth={desktop ? 28 : 40} px={1} alignSelf="flex-end">
              { !profile ? null : <MemberAvatar photos={profile.photos} gender={profile.basicInfo.gender ? profile.basicInfo.gender : 1} size={desktop ? 28 : 40} /> }
            </Box>
          }
          <Box>
            <Typography className={msgClasses} align="left">{message.message}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
 
export default Message;