import React from 'react';
import { Box } from '@material-ui/core';

const MemberProfile = (props) => {
  return (
    <Box>
      <h1>{props.match.params.profileId}</h1>
    </Box>
  );
}
 
export default MemberProfile;