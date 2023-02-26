import React from 'react';
import { Box, Paper } from '@material-ui/core';
import ProfileName from './ProfileName';
import ProfileActions from '../../library/profile/ProfileActions';
import ProfileInfo from './ProfileInfo';

const PrimaryInfo = ({profile, noActions=false}) => {
  return (
    <Paper>
      <Box py={1} px={0} position="relative">
        <ProfileName profile={profile} />
        <ProfileInfo profile={profile} />
        { noActions ? null : <ProfileActions profileId={profile._id} /> }
      </Box>
    </Paper>
  );
}
 
export default PrimaryInfo;