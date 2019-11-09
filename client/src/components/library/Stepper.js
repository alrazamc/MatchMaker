import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { IconButton, Box } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  stepperContainer: {
    position: "absolute",
    bottom: "8px",
    width: "100%",
  },
  stepperBackground: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.palette.common.black,
    filter: "alpha(opacity=60)",
    opacity: 0.60,
    top: 0,
    position: "absolute"
  },
  stepper: {
    color: theme.palette.common.white,
    width: "100%",
    margin: "auto",
    position: "relative"
  },
  stepperText: {
    userSelect: "none"
  }
}));

const Stepper = ({ maxSteps=0, activeStep=0, handleBack, handleNext  }) => {
  const classes = useStyles();
  if(maxSteps <= 1) return null;
  return (
    <div className={classes.stepperContainer}>
      <div className={classes.stepperBackground}></div>
      <Box display="flex" justifyContent="space-between" className={classes.stepper} alignItems="center">
        <IconButton size="small" color="inherit" onClick={handleBack} disabled={activeStep === 0}>
          <KeyboardArrowLeft />
        </IconButton>
        <Typography color="inherit" variant="subtitle1" className={classes.stepperText}>
          {activeStep + 1 }/{maxSteps}
        </Typography>
        <IconButton size="small" color="inherit" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
          <KeyboardArrowRight />
        </IconButton>
      </Box>
    </div>
  );
}
 
export default Stepper;