import React, { useState, useMemo } from 'react';
import { Card, CardContent, Box, makeStyles, Typography, Link } from '@material-ui/core';
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';
import ProfilePhotos from './ProfilePhotos';
import ProfileInfo from './ProfileInfo';
import ProfileName from './ProfileName';
import ProfileContact from './ProfileContact';
import ProfileActions from './ProfileActions';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { undoDontShow, undoBlock } from '../../../store/actions/PeopleActions';

const useStyles = makeStyles(theme => ({
  card: {
    marginBottom: theme.spacing(2),
    cursor: "pointer"
  },
  content:{
    position: "relative",
    padding: theme.spacing(2),
    '&:last-child': {
      paddingBottom: theme.spacing(2)
    }
  },
  profileActions: {
    position: "absolute",
    top: 2,
    right: 14,
    [theme.breakpoints.down('xs')]: {
      display: "flex",
      maxWidth: 23,
      flexWrap: "wrap-reverse",
      "& button":{
        padding: 5
      }
    }
  }
}))
 
const ProfileCard = ({profile, width, isBlocked, isFiltered, undoBlock, undoDontShow}) => {
  const classes = useStyles();
  const [raised, setRaised] = useState(false);
  const profileNameMemo = useMemo(() => (<ProfileName screenWidth={width} profile={profile} />), [width, profile])
  const profilePhotosMemo = useMemo(() => (<ProfilePhotos profileId={profile._id} photos={profile.photos} gender={profile.basicInfo.gender} />), [profile._id, profile.photos, profile.basicInfo.gender])
  const profileContactMemo = useMemo(() => (<ProfileContact profileId={profile._id} />), [profile._id]);
  const gender = profile.basicInfo && profile.basicInfo.gender === 2 ? 'she' : 'he';
  return (
    <Card className={classes.card} raised={raised} onMouseEnter={() => setRaised(true)} onMouseLeave={() => setRaised(false)}>
      { !isBlocked && !isFiltered ? 
        <CardContent className={classes.content}>
          <Box display="flex" flexWrap={{xs: "wrap", "sm" : "nowrap"}}>
            <Box>
              {profilePhotosMemo}
            </Box>
            <Box flexGrow={1} >
              {profileNameMemo}
              { isWidthUp('sm', width) ? <ProfileInfo profile={profile} /> : profileContactMemo }
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center" pt={{xs: 1, sm: 0}}>
              {isWidthDown('xs', width) ? <ProfileInfo profile={profile} /> : profileContactMemo}
            </Box>
          </Box>
          <div className={classes.profileActions}>
            <ProfileActions profileId={profile._id}  />
          </div>
        </CardContent>
        :
        <Box display="flex" justifyContent="center" alignItems="center" p={2} textAlign="center" height={{xs: 150, md: 200}}>
          <Typography>
            { isBlocked ? `This person is blocked now and ${gender} won't be able to see your profile or send you a request ` :
            `This person will not appear in your search results now but ${gender} can see your profile or send you a request `
            }

            {
              isBlocked ? 
              <Link onClick={() => undoBlock(profile._id)}>Undo</Link> :
              <Link onClick={() => undoDontShow(profile._id)}>Undo</Link>
            }
          </Typography>
        </Box>
      }
    </Card>
  );
}

const mapStateToProps = (state, props) => {
  let filtered = state.profile.filtered ? state.profile.filtered : []
  let blocked = state.profile.blocked ? state.profile.blocked : []
  return {
    isFiltered: filtered.filter(item => item === props.profile._id).length ? true : false,
    isBlocked: blocked.filter(item => item === props.profile._id).length ? true : false
  }
}

export default compose(
  connect(mapStateToProps, {undoBlock, undoDontShow}),
  withWidth()
)(ProfileCard);