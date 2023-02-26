import React, { useMemo } from 'react';
import { makeStyles, Paper, Box, Typography, IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import { closeChatBox } from '../../store/actions/ChatActions';
import { connect } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import Online from '../library/profile/Online';
import MemberAvatar from '../memberProfile/MemberAvatar';
import ChatActions from './ChatActions';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(1),
    paddingRight: theme.spacing(0.5),
    maxHeight: 64,
  },
  backBtn: {
    color: theme.palette.common.white,
    cursor: "pointer",
    marginLeft: theme.spacing(-1.5)
  },
  closeBtn: {
    color: theme.palette.common.white,
    cursor: "pointer",
    padding: 4
  },
  profileLink: {
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}))

const Header = ({desktop, profileId, profile, request, closeChatBox}) => {
  const classes = useStyles();
  const history = useHistory();
  let name = "";
  if(profile && profile.basicInfo && profile.basicInfo.firstName)
    name = profile.basicInfo.firstName + ' ' + profile.basicInfo.lastName;
  const OnlineMemo = useMemo(() => {
    if(!profile) return null;
    return (<Online whiteText={true} time={profile.lastActive} currentTime={profile.currentTime} />);
  }, [profile]);
  return (
    <Paper className={classes.root} square>
      {
        desktop ? null :  <IconButton className={classes.backBtn} onClick={() => history.goBack()}> <ArrowBackIcon /> </IconButton>
      }
      <Box pr={1} className={classes.profileLink} onClick={() => { history.push(`/profile/${profileId}`) }}>
        { !profile ? null : <MemberAvatar photos={profile.photos} gender={profile.basicInfo.gender ? profile.basicInfo.gender : 1} size={desktop ? 28 : 50} /> }
      </Box>
      <Box flexGrow={1} >
        <Typography variant="body1" className={classes.profileLink} onClick={() => { history.push(`/profile/${profileId}`) }}>
          {name}
        </Typography>
        { desktop ? null : OnlineMemo }
      </Box>
      {
        !desktop ? null :  <IconButton className={classes.closeBtn} onClick={() => closeChatBox(profileId)}> <CloseIcon fontSize="small" /> </IconButton>
      }
      <ChatActions desktop={desktop} profileId={profileId} request={request} closeChatBox={closeChatBox} />
    </Paper>
  );
}
 
export default connect(null, {closeChatBox})(Header);