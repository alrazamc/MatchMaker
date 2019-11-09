import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import { Box, Button } from '@material-ui/core';
import Stepper from '../Stepper';

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative"
  },
  imgContainer: {
    backgroundColor: theme.palette.common.black
  },
  img:{
    maxWidth: "100%", 
    maxHeight: "100%"
  }
}));

const LightBox = ({photos, activeThumb=0, onClose}) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(activeThumb);
  const images = photos.images;
  const maxSteps = images.length;

  const handleNext = () => setActiveStep(prevActiveStep => prevActiveStep + 1);
  const handleBack = () => setActiveStep(prevActiveStep => prevActiveStep - 1);
  const handleStepChange = step => setActiveStep(step);

  return (
    <Box className={classes.root} width="100%" height={window.innerHeight}>
      <SwipeableViews
        axis="x"
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {
          images.map((step, index) => {
            return (
              <Box height={window.innerHeight - 96 - 72} key={index} className={classes.imgContainer} display="flex" justifyContent="center" alignItems="center">
                {
                  Math.abs(activeStep - index) <= 2 ? (
                    <img className={classes.img} src={step.imageUrl} alt={process.env.REACT_APP_NAME}/> 
                  ) : null
                }
              </Box> 
            )
          })
        }
      </SwipeableViews>
      <Box position="relative">
        <Stepper maxSteps={maxSteps} activeStep={activeStep} handleBack={handleBack} handleNext={handleNext} />
      </Box>
      <Box textAlign="center" my={2}>
        <Button variant="outlined" onClick={onClose}> Close </Button>
      </Box>
    </Box>
  );
}

export default LightBox;
