import React from 'react';
import { Paper, Typography, makeStyles, Box, Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { undoBlock, undoDontShow } from '../../store/actions/PeopleActions';

const useStyles = makeStyles(theme => ({
  noProfile: {
    width: '100%'
  }
}))

const NoProfile = ({type="inActive", profileId=false, undoBlock, undoDontShow}) => {
  const classes = useStyles();
  return (
    <Paper elevation={4} className={classes.noProfile}>
      <Box display="flex" justifyContent="center" alignItems="center" p={2} textAlign="center" height={{xs: 150, md: 200}}>
        <Typography color="textSecondary" variant="subtitle1" align="center">
            {type === 'inActive' ? "Profile not available. It may be temporarily hidden by member or suspended/deleted " : null} 
            {type === 'blocked' ? "You have blocked this person " : null} 
            {type === 'filtered' ? "You have filtered this person to not to show again " : null} 
            {type === 'blocked' ? <Button onClick={() => undoBlock(profileId)} color="primary">UnBlock</Button> : null}
            {type === 'filtered' ? <Button onClick={() => undoDontShow(profileId)} color="primary">Undo</Button> : null}
        </Typography>
      </Box>
    </Paper> 
  );
}
 
export default connect(null, { undoBlock, undoDontShow })(NoProfile);