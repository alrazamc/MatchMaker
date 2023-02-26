import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { IconButton, Badge, Popover, List, ListItem, ListItemText, ListItemAvatar, makeStyles, Typography, Box } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import { firestoreConnect } from 'react-redux-firebase';
import MemberAvatar from '../../memberProfile/MemberAvatar';
import { openChatBox } from '../../../store/actions/ChatActions';
import { useWidth } from '../../../config/MuiTheme';
import { isSmallScreen } from '../../../utils';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    width: 280,
    backgroundColor: theme.palette.background.paper,
    maxHeight: 300,
    overflowY: 'auto',
    '& li': {
      padding: theme.spacing(0, 2),
    },
    '& li:hover': {
      cursor: "pointer",
      backgroundColor: "#e8e8e8"
    }
  },
  inline: {
    display: 'inline',
  },
  notSeen: {
    backgroundColor: "#e8e8e8",
  }
}));


const MessageNotifications = ({notifications, profileId, connections, openChatBox}) => {
  const classes = useStyles();
  const screenWidth = useWidth();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = event => {
      setAnchorEl(event.currentTarget);
  };

  const openChatWindow = (profileId) => {
    if(isSmallScreen(screenWidth))
      history.push(`/chat/${profileId}`);
    else
      openChatBox(profileId);
    handleClose();
  }

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'messages-notifications' : undefined;
  const profiles = [];
  let count = 0;
  notifications.forEach(item => {
    if(item.requestFrom === profileId)
    {
      if(connections[item.requestTo])
      {
        profiles.push({
          profile: connections[item.requestTo],
          isSeen: item.seenFrom
        })
        if(!item.seenFrom)
          count++;
      }
    }else if(item.requestTo === profileId)
    {
      if(connections[item.requestFrom])
      {
        profiles.push({
          profile: connections[item.requestFrom],
          isSeen: item.seenTo
        })
        if(!item.seenTo)
          count++;
      }
    }
  })
  profiles.sort((a,b) => {
    return (a.isSeen === b.isSeen)? 0 : !a.isSeen? -1 : 1
  })
  
  return (
    <>
      <IconButton aria-label="" color="inherit" onClick={handleClick}>
        <Badge badgeContent={count} color="secondary">
          <MailIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        { profiles.length === 0 ?  
          <Box width={280} p={2}>
            <Typography align="center" color="textSecondary">No Messages</Typography>
          </Box> : 
          <List className={classes.root}>
            {
              profiles.map(item => {
                const {profile, isSeen} = item;
                return (
                <ListItem alignItems="flex-start" key={profile._id} onClick={() => openChatWindow(profile._id)} className={isSeen === true ? null : classes.notSeen}>
                  <ListItemAvatar>
                    <MemberAvatar photos={profile.photos} gender={profile.basicInfo.gender ? profile.basicInfo.gender : 1} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={ profile && profile.basicInfo && profile.basicInfo.firstName ? profile.basicInfo.firstName + ' ' + profile.basicInfo.lastName : "" }
                    secondary="Open Chat"
                  />
                </ListItem>
              )}
              )
            }
          </List>
        }
      </Popover>
    </>
  );
}
 
const mapStateToProps = (state) => {
  let notifications = [];
  if(state.firestore && state.firestore.ordered.notifications) notifications = notifications.concat(state.firestore.ordered.notifications);
  if(state.firestore && state.firestore.ordered.notifications2) notifications = notifications.concat(state.firestore.ordered.notifications2);
  return{
    profileId: state.profile._id,
    notifications,
    connections: state.connections,
    firebaseUid: state.firebase ? state.firebase.auth.uid : null
  }
}
export default compose(
connect(mapStateToProps, {openChatBox}),
firestoreConnect(props => !props.firebaseUid ? [] : [{
  collection: 'conversations',
  where: [['requestFrom', '==', props.profileId]],
  storeAs: 'notifications'
},{
  collection: 'conversations',
  where: [['requestTo', '==', props.profileId]],
  storeAs: 'notifications2'
}])
)(MessageNotifications);