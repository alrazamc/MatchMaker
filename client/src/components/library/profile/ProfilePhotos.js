import React, { useState } from 'react';
import { makeStyles, Dialog, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import SwipeableViews from 'react-swipeable-views';
import { Box } from '@material-ui/core';
import MaleAvatar from '../../../assets/images/male-avatar.jpg';
import FemaleAvatar from '../../../assets/images/female-avatar.jpg';
import LockIcon from '@material-ui/icons/LockSharp';
import clsx from 'clsx';
import Stepper from '../Stepper';
import LightBox from './LightBox';
import { connect } from 'react-redux';
import { sendRequest, cancelRequest } from '../../../store/actions/PeopleActions';

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative"
  },
  imgContainer: {
    cursor: "pointer",
    borderRadius: 3
  },
  noPointer: { 
    cursor: "initial"
  },
  requestBtn: {
    position: "absolute",
    bottom: theme.spacing(2),
    transform: "translateX(0%)",
    [theme.breakpoints.up('md')]:{
      transform: "translateX(4%)"
    }
  }
}));

const ProfilePhotos = ({profileId, sent, photos, gender, sendRequest, cancelRequest}) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(() => {
    return photos.profilePictureIndex && photos.images[photos.profilePictureIndex] ? 
    photos.profilePictureIndex : 0;
  });
  const [lightBoxOpened, setLightBoxOpened] = useState(false);
  const closeLightBox = () => setLightBoxOpened(false); 
  const visibility = photos.visibility ? photos.visibility : 0;
  const imageCount = photos.images.length;
  const avatarUrl = gender === 1 ? MaleAvatar : FemaleAvatar;
  const images = photos.images.length > 0 ? photos.images : [{ _id: '2022', thumbUrl: avatarUrl}]
  const maxSteps = images.length;

  const handleNext = () => setActiveStep(prevActiveStep => prevActiveStep + 1);
  const handleBack = () => setActiveStep(prevActiveStep => prevActiveStep - 1);
  const handleStepChange = step => setActiveStep(step);

  return (
    <Box className={classes.root} width={{xs: 120, md: 160}}>
      <SwipeableViews
        axis="x"
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {
          images.map((step, index) => {
          const backgroundUrl = imageCount ? `url(${step.thumbUrl}), url(${avatarUrl})` : `url(${step.thumbUrl})`;
          const style = {
            backgroundImage:backgroundUrl,
            backgroundRepeat: 'no-repeat',
            backgroundPosition:'center center',
            backgroundSize: 'cover'
          }
          return (
            <Box height={{xs: 150, md: 200}} key={index} onClick={() => imageCount === 0 || visibility === 2 ? false: setLightBoxOpened(true)} className={clsx(classes.imgContainer,  imageCount === 0 || visibility === 2 ? classes.noPointer : null)} style={style}>
          {
            imageCount && visibility === 2 ?
            <Box display="flex" flexWrap="wrap" flexDirection="column" justifyContent="center" alignItems="center" height="100%" color="white">
              <Box width="100%" textAlign="center"><LockIcon color="inherit" fontSize="large" /></Box>
              <Box width="100%">
                <Typography align="center" color="inherit">
                  Visible on Accept
                </Typography>
              </Box>
            </Box>
            : null
          }
            
          </Box> )
          })
        }
      </SwipeableViews>
      { imageCount > 0 ? null : 
        <>
        { !sent ? <Button onClick={() => sendRequest(profileId, 'photo')} className={classes.requestBtn} variant="outlined">Request Photo</Button> : null }
        {
          sent && sent.status === 1 ? 
          <div className={classes.requestBtn}>
            <Typography align="center" color="textPrimary">Photo request sent</Typography>
            <Button onClick={() => cancelRequest(profileId, 'photo')}  variant="outlined">Cancel Request</Button>
          </div>
           : null
        }
        {
          sent && sent.status === 3 ? 
            <Typography className={classes.requestBtn} align="center" color="textPrimary">Photo request declined</Typography>
           : null
        }
        </>
      }
      <Stepper maxSteps={maxSteps} activeStep={activeStep} handleBack={handleBack} handleNext={handleNext} />
      <Dialog open={lightBoxOpened} onClose={closeLightBox} fullWidth={true} maxWidth="md">
        <LightBox photos={photos} activeThumb={activeStep} onClose={closeLightBox} />
      </Dialog>
    </Box>
  );
}

const mapStateToProps = (state, props) => {
  const requests = state.profile.requests ? state.profile.requests : [];
  return {
    sent: requests.find(req => req.from === state.profile._id && req.to === props.profileId && req.type === 2 && req.status > 0)
  }
}
export default connect(mapStateToProps, {
  sendRequest, cancelRequest
})(ProfilePhotos);

