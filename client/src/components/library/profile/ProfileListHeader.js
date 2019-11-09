import React from 'react';
import { Box, Typography } from '@material-ui/core';
import SortBy from './SortBy';


const ProfileListHeader = ({Heading}) => {
  return (
    <Box display="flex" alignItems="center">
      <Box flexGrow={1}>
        <Typography gutterBottom>
          {Heading}
        </Typography>
      </Box>
      <Box display={{xs: 'none', md: "inline"}}>
        <SortBy />
      </Box>
    </Box>
  );
}

export default ProfileListHeader;