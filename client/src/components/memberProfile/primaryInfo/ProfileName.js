import React, { useMemo } from 'react';
import { Typography, Box, makeStyles } from '@material-ui/core';
import Online from '../../library/profile/Online';


const useStyles = makeStyles(theme => ({
  name:{
    color: theme.palette.grey[800]
  }
}));

const ProfileName = ({profile}) => {
  const classes = useStyles();
  const { basicInfo } = profile;
  let name = profile._id.substr(0, 6);
  if(basicInfo && basicInfo.firstName)
    name = basicInfo.firstName + ' ' + basicInfo.lastName;
  const OnlineMemo = useMemo(() => {
    return (<Online time={profile.lastActive} currentTime={profile.currentTime} />);
  }, [profile.lastActive, profile.currentTime]);
  return (
    <Box px={2} py={0} >
      <Typography variant="h6" className={classes.name}  >
        {name}
      </Typography>
      {OnlineMemo}
    </Box>
  );
}
 
export default ProfileName;