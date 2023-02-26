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

const FamilyInfo = ({profile, system}) => {
  const classes = useStyles();
  const { family, basicInfo } = profile;
  const gender = basicInfo && basicInfo.gender ? basicInfo.gender : 1;
  const profileCreatedBy = basicInfo && basicInfo.profileCreatedBy ? basicInfo.profileCreatedBy : null;
  const hisHer = profileCreatedBy !== 1 ? (gender === 1 ? 'His' : 'Her') : 'My';
  const heShe = profileCreatedBy !== 1 ? (gender === 1 ? 'He has' : 'She has') : "I have";
  if(!family) return null;
  const fatherStatus = system.data.fatherStatus[family.fatherStatus] ? system.data.fatherStatus[family.fatherStatus].title : '';
  const motherStatus = system.data.motherStatus[family.motherStatus] ? system.data.motherStatus[family.motherStatus].title : '';
  const familyType = system.data.familyType[family.familyType] ? system.data.familyType[family.familyType].title : '';
  const familyValues = system.data.familyValues[family.familyValues] ? system.data.familyValues[family.familyValues].title : '';
  const familyAffluence = system.data.familyAffluence[family.familyAffluence] ? system.data.familyAffluence[family.familyAffluence].title : '';
  const brothers = family.notMarriedBrothers + family.marriedBrothers;
  const sisters = family.notMarriedSisters + family.marriedSisters;
  let text1 = "";
  if(familyType || familyValues)
    text1 = `We are a ${familyAffluence.toLowerCase()} ${familyType === 'Joint' ? familyType.toLowerCase() : ''} family`;
  if(family.familyValues)
    text1 += (text1 !== "" ? ", with " : "We have ") + `${familyValues.toLowerCase()} values`;
  let  familyLocation = family.familyLocation ? 'living in ' + family.familyLocation : '';
  let  familyNativePlace = family.familyNativePlace ? 'originally from ' + family.familyNativePlace : '';
  if(familyLocation)
    text1 += (text1 !== "" ? ", " : "We are ") + familyLocation;
  if(familyNativePlace)
    text1 += (text1 !== "" ? ", " : "We are ") + familyNativePlace;

  let text2 = "";
  if(fatherStatus || motherStatus)
    text2 = (text1 !== "" ? ". " : "") + `${hisHer} `;
  if(fatherStatus)
    text2 += `father is ${fatherStatus === 'Business' ? "doing business" : fatherStatus.toLowerCase() }`;
  if(fatherStatus && motherStatus)
    text2 += ` and ${hisHer.toLowerCase()} `;
  if(motherStatus)
    text2 += `mother is ${motherStatus === 'Business' ? "doing business" : motherStatus.toLowerCase() }`;

  let text3 = "";
  if(brothers || sisters)
    text3 = (text2 !== "" || text1 !== "" ? ". " : "") + `${heShe} `;
  if(brothers)
    text3 += `${brothers} brother${brothers > 1 ? 's':''}`;
  if(family.marriedBrothers)
    text3 += `(${family.marriedBrothers === brothers ? '' : family.marriedBrothers + ' '}married)`;
  if(brothers && sisters)
    text3 += ' and ';
  if(sisters)
    text3 += `${sisters} sister${sisters > 1 ? 's':''}`;
  if(family.marriedSisters)
    text3 += `(${family.marriedSisters === sisters ? '' : family.marriedSisters + ' '}married)`;
  return (
    <Paper className={classes.root}>
      <Box py={1} px={2}>
        <Typography variant="h6" className={classes.about} gutterBottom>Family Details</Typography>
        <Typography color="inherit" >
          {text1}{text2}{text3}
        </Typography>
      </Box>
    </Paper>
  );
}

 
const mapStateToProps = state => {
  return {
    system: systemSelector(state, [], ['fatherStatus', 'motherStatus', 'familyType', 'familyValues', 'familyAffluence']),
  }
}
export default connect(mapStateToProps)(FamilyInfo);
 
