import React, { useMemo } from 'react';
import { Typography, Box, makeStyles, Link } from '@material-ui/core';
import Online from './Online';
import { isWidthUp } from '@material-ui/core/withWidth';
import { Link as RouterLink } from 'react-router-dom';


const useStyles = makeStyles(theme => ({
  name:{
    color: "#565656",
    "&:hover":{
      textDecoration: "underline"
    }
  },
  profileLink: {
    "&:hover": {
      textDecoration: "none"
    }
  }
}));

const ProfileName = ({profile, screenWidth}) => {
  const classes = useStyles();
  const { basicInfo } = profile;
  const name = basicInfo && basicInfo.firstName ? 
   (isWidthUp('sm', screenWidth) ? basicInfo.firstName + ' ' + basicInfo.lastName : basicInfo.firstName)  : profile._id.substring(0, 6);
   const OnlineMemo = useMemo(() => 
    (<Online time={profile.lastActive} currentTime={profile.currentTime} />)
  , [profile.lastActive, profile.currentTime]);
  return (
    <Link  to={`/profile/${profile._id}`} className={classes.profileLink} component={RouterLink}>
      <Box px={2} py={0} >
        <Typography variant="h6" className={classes.name}  >
          {name}
        </Typography >
        {OnlineMemo}
      </Box>
    </Link>
  );
}
 
export default ProfileName;