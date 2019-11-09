import React, { useState, useCallback, useMemo } from 'react';
import { Menu, MenuItem, Button, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@material-ui/core';
import { connect } from 'react-redux';
import { shortlist, undoShortlist, dontShow, block } from '../../../store/actions/PeopleActions';
import ArrowIcon from '@material-ui/icons/ArrowDropDownCircleOutlined';
import FavoriteIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIconFilled from '@material-ui/icons/Favorite';
import ReportProfileForm from './ReportProfileForm';


const ProfileActions = ({ profileId, isShortlisted, ...actions }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const closeReportModal = useCallback(() => {
    setReportModalOpen(false);
  }, []);

  const menuId = 'app-navbar-account-menu';
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
      <MenuItem onClick={() => { actions.dontShow(profileId);  handleMenuClose(); }}>Don't Show Again</MenuItem>
      <MenuItem onClick={() => { setReportModalOpen(true);  handleMenuClose(); }}>Report Profile</MenuItem>
      <MenuItem onClick={() => { actions.block(profileId);  handleMenuClose(); }}>Block Profile</MenuItem>
    </Menu>
  ),  [anchorEl, handleMenuClose, isMenuOpen, actions, profileId]);
  
  return (
    <>
      <Tooltip title={isShortlisted ? "Remove from shortlist" : "Shortlist"}>
        {
          !isShortlisted ? 
          <IconButton onClick={() => actions.shortlist(profileId)}>
            <FavoriteIcon />
          </IconButton>
          :
          <IconButton onClick={() => actions.undoShortlist(profileId)}>
            <FavoriteIconFilled />
          </IconButton>
        }
      </Tooltip>
      <IconButton
        edge="end"
        aria-label="account of current user"
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={handleProfileMenuOpen}
        color="default"
      >
        <ArrowIcon  />
      </IconButton>
      {renderMenu}
      <Dialog open={reportModalOpen} onClose={closeReportModal} maxWidth="sm" fullWidth={true}>
        <DialogTitle id="confirmation-dialog-title">Report Profile</DialogTitle>
        <DialogContent dividers>
          <ReportProfileForm profileId={profileId}  />
        </DialogContent>
        <DialogActions>
          <Box width="100%" textAlign="center">
            <Button type="button" onClick={closeReportModal} color="primary">Close</Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
const mapStateToProps = (state, props) => {
  let shortlisted = state.profile.shortlisted ? state.profile.shortlisted : []
  return {
    isShortlisted: shortlisted.filter(item => item === props.profileId).length ? true : false
  }
}
export default  connect(mapStateToProps, {shortlist, undoShortlist, dontShow, block})(ProfileActions);