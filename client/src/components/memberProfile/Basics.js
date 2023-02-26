import React from 'react';
import { makeStyles, Paper, Typography, Box } from '@material-ui/core';
import { systemSelector } from '../../store/selectors/systemSelector';
import { connect } from 'react-redux';

const useStyles = makeStyles(theme => ({
  root:{
    marginTop: theme.spacing(1),
    color: theme.palette.grey[600],
  },
  about: {
    color: theme.palette.grey[800]
  }
}));

const Basics = ({basicInfo, system}) => {
  const classes = useStyles();
  if(!basicInfo) return null;
  const bodyType = system.data.bodyType[basicInfo.bodyType] ? system.data.bodyType[basicInfo.bodyType].title : '';
  const skinTone = system.data.skinTone[basicInfo.skinTone] ? system.data.skinTone[basicInfo.skinTone].title : '';
  const disability = system.data.disability[basicInfo.disability] ? system.data.disability[basicInfo.disability].title : '';
  let healthInfo = system.data.healthInfo[basicInfo.healthInfo] ? system.data.healthInfo[basicInfo.healthInfo].title : '';
  if(basicInfo.healthInfo === 7 && basicInfo.healthInfoText)
    healthInfo = basicInfo.healthInfoText;
  if(!bodyType && !basicInfo.bodyWeight && !healthInfo && !skinTone && !disability) return null;
  return (
    <Paper className={classes.root}>
      <Box py={1} px={2}>
        <Typography variant="h6" className={classes.about} gutterBottom>Physical Details</Typography>
        { bodyType ? <Typography><b>Body Type:</b> {bodyType}</Typography> : null }
        { basicInfo.bodyWeight ? <Typography><b>Weight:</b> {basicInfo.bodyWeight} Kgs</Typography> : null }
        { healthInfo ? <Typography><b>Health Info:</b> {healthInfo}</Typography> : null }
        { skinTone ? <Typography><b>Skin Tone:</b> {skinTone}</Typography> : null }
        { disability ? <Typography><b>Any Disability:</b> {disability}</Typography> : null }        
      </Box>
    </Paper>
  );
}

 
const mapStateToProps = state => {
  return {
    system: systemSelector(state, [], ['bodyType', 'healthInfo', 'skinTone', 'disability']),
  }
}
export default connect(mapStateToProps)(Basics);
 
