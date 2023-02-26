import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { IconButton, Badge, Popover, List, ListItem, ListItemText, ListItemAvatar, makeStyles, Box, Typography, CircularProgress } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MemberAvatar from '../../memberProfile/MemberAvatar';
import { loadNotifications, markAllSeen } from '../../../store/actions/NotificationActions';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 280,
    maxWidth: 432,
    backgroundColor: theme.palette.background.paper,
    '& li': {
      padding: theme.spacing(1, 2),
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


const Notifications = ({notifications, loading, loadNotifications, markAllSeen}) => {
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const [count, setCount] = useState(0);
  const containerRef = useRef();
  const handleClick = event => {
      setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if(count === 0 || anchorEl === null) return;
    let timer = null;
    if(count)
      timer = setTimeout(markAllSeen, 2000);
    return () => {
      if(timer)
        clearTimeout(timer)
    }
  }, [anchorEl, count, markAllSeen])

  const handleScroll = (event) => {
    event.preventDefault();
    if(loading) return;
    if(containerRef.current.scrollTop + containerRef.current.offsetHeight === containerRef.current.scrollHeight)
      loadNotifications(false, false);
  }

  const handleNotificationClick = (profileId) => {
    history.push(`/profile/${profileId}`);
    handleClose();
  }

  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    let unseen = 0;
    notifications.forEach(item => {
      if(item.isSeen === false)
        unseen++
    })
    setCount(unseen);
  }, [notifications])
  const open = Boolean(anchorEl);
  const id = open ? 'notifications' : undefined;
  return (
    <>
      <IconButton aria-label="" color="inherit" onClick={handleClick}>
        <Badge badgeContent={count} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        PaperProps={{
          ref: containerRef,
          onScroll: handleScroll
        }}
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
        {
          notifications.length === 0 ?  
          <Box width={280} p={2}>
            <Typography align="center" color="textSecondary">No notifications</Typography>
          </Box> : 
          <List className={classes.root} >
            {
              notifications.map(item => {
                const {profile, isSeen} = item;
                return (
                <ListItem alignItems="center" key={item._id} onClick={() => handleNotificationClick(profile._id)} className={isSeen === true ? null : classes.notSeen}>
                  <ListItemAvatar>
                    <MemberAvatar photos={profile.photos} gender={profile.basicInfo.gender ? profile.basicInfo.gender : 1} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.text}
                    secondary={dayjs(item.time).format('DD MMM hh:mm A')}
                    
                  />
                </ListItem>
              )}
              )
            }
            {
              !loading ? null :
              <Box  width="100%" height={50} display="flex" justifyContent="center" alignItems="center">
                <CircularProgress size={24} />
              </Box>
            }
          </List>
        }
      </Popover>
    </>
  );
}
 
const mapStateToProps = (state) => {
  const notShow = [3, 4, 11, 12]; //not show canclled blocked/unblock notifications
  const blockedMe = state.blockedMe;
  const blocked = state.profile.blocked ? state.profile.blocked : []; //blocked by me
  let blockIds = [...blockedMe, ...blocked];
  return{
    profileId: state.profile._id,
    loading: state.notifications.loading,
    notifications: state.notifications.notifications
      .filter(item => !notShow.includes(item.type))
      .filter(item => !blockIds.includes(item.from) )
  }
}
export default connect(mapStateToProps, {loadNotifications, markAllSeen})(Notifications);