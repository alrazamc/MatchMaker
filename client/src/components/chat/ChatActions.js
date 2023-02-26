import React, { useState, useCallback, useMemo } from 'react';
import { Menu, MenuItem, IconButton, Dialog, DialogContent, makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { declineRequest, block } from '../../store/actions/PeopleActions';
import { closeChatBox } from '../../store/actions/ChatActions';
import ReportProfileForm from '../library/profile/ReportProfileForm';
import { useWidth } from '../../config/MuiTheme';
import MoreIcon from '@material-ui/icons/MoreVert';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import FbAnalytics from '../../config/FbAnalytics';
const useStyles = makeStyles(theme => ({
  iconBtn: {
    color: theme.palette.common.white,
    cursor: "pointer",
    padding: 2,
    marginRight: 0
  },
  mobileBtn:{
    padding: 7
  }
}))

const ChatActions = ({ profileId, desktop, closeChatBox, request, isShortlisted, ...actions }) => {
  const classes = useStyles();
  const screenWidth = useWidth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const isMenuOpen = Boolean(anchorEl);
  const history = useHistory();

  const handleMenuOpen = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const closeReportModal = useCallback(() => {
    setReportModalOpen(false);
  }, []);

  const doAction = (action) => {
    action(profileId);
    handleMenuClose();
    desktop ?  closeChatBox(profileId) : history.push(`/profile/${profileId}`)
  }

  const menuId = 'chat-actions';
  const renderMenu = useMemo(() => (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem onClick={() => { handleMenuClose(); history.push(`/profile/${profileId}`) }}>Visit Profile</MenuItem>
      <MenuItem onClick={() => { setReportModalOpen(true);  handleMenuClose(); }}>Report Profile</MenuItem>
      <MenuItem onClick={() => {FbAnalytics.logEvent('profile_blocked'); doAction(actions.block)}}>Block Profile</MenuItem>
      {
        request.from === profileId ?
        <MenuItem onClick={() => { FbAnalytics.logEvent('connect_request_declined'); doAction(actions.declineRequest)}}>Decline Request</MenuItem>
        : null
      }
    </Menu>
  ),  [anchorEl, handleMenuClose, isMenuOpen, actions, profileId]);
  
  return (
    <div>
      <IconButton
        edge="end"
        aria-label="Chat Actions"
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={handleMenuOpen}
        color="default"
        className={clsx(classes.iconBtn, desktop ? null : classes.mobileBtn)}
        >
        <MoreIcon fontSize={desktop ? "small" : "large"}  />
      </IconButton>
      {renderMenu}
      <Dialog open={reportModalOpen} onClose={closeReportModal} maxWidth="sm" fullWidth={true} fullScreen={screenWidth === 'xs'}>
        <DialogContent dividers>
          <ReportProfileForm cancelReport={closeReportModal} profileId={profileId}  />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default  connect(null, {block, declineRequest, closeChatBox})(ChatActions);