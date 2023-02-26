import React from 'react';
import { Typography, Box, makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import { systemSelector } from '../../../store/selectors/systemSelector';

const useStyles = makeStyles(theme => ({
  info: {
    color: theme.palette.grey[600]
  }
}));

const ProfileInfo = ({profile, system}) => {
  const classes = useStyles();
  const { basicInfo, religionCaste, location, educationCareer } = profile;
  const age = basicInfo && basicInfo.dateOfBirth ? dayjs().diff(basicInfo.dateOfBirth, 'year') + ' yrs,' : '';
  const height = basicInfo && system.data.height[basicInfo.height] ? system.data.height[basicInfo.height].labelSymbol : '';
  const maritalStatus = basicInfo && system.data.maritalStatus[basicInfo.maritalStatus] ? system.data.maritalStatus[basicInfo.maritalStatus].title : '';
  const religion = religionCaste && system.data.religions[religionCaste.religion] ? system.data.religions[religionCaste.religion].title : '';
  const community = religionCaste && system.data.communities[religionCaste.community] ? system.data.communities[religionCaste.community].title : '';
  const language = religionCaste && system.data.languages[religionCaste.motherTongue] ? system.data.languages[religionCaste.motherTongue].title : '';
  const country = location && system.data.countries[location.country] ? system.data.countries[location.country].title : '';
  const educationLevel = educationCareer && system.data.educationLevel[educationCareer.educationLevel] ? system.data.educationLevel[educationCareer.educationLevel].title : '';
  const educationField = educationCareer && system.data.educationField[educationCareer.educationField] ? system.data.educationField[educationCareer.educationField].title : '';
  const workingAs = educationCareer && system.data.occupations[educationCareer.workingAs] ? system.data.occupations[educationCareer.workingAs].title : '';
  return (
    <Box display="flex" flexDirection="column">
      <Box px={2} display="flex" className={classes.info} flexWrap="wrap">
        <Box width={{xs: "100%", md: "40%"}}>
          <Typography color="inherit" noWrap={true}>{age} {height}</Typography>
          <Typography color="inherit" noWrap={true}>{religion}</Typography>
          <Typography color="inherit" noWrap={true}>{community}</Typography>
          <Typography color="inherit" noWrap={true}>{language}{religionCaste && religionCaste.caste ? ', ' + religionCaste.caste : null }</Typography>
        </Box>
        <Box width={{xs: "100%", md: "60%"}}>
          <Typography color="inherit" noWrap={true}>{maritalStatus}</Typography>
          <Typography color="inherit" noWrap={true}>{country ? "Lives in ": null} 
            {location && location.city && location.city.name ? location.city.name+', ' : null} 
            {location && location.state && location.state.name ? location.state.name+', ' : null} 
            {country}
          </Typography>
          <Typography color="inherit" noWrap={true}>{educationLevel ? educationLevel + ' degree' : null}  {educationField ? ' in ' + educationField : null}</Typography>
          <Typography color="inherit" noWrap={true}>{workingAs ? "Working As " + workingAs : null}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
 
const mapStateToProps = state => {
  return {
    system: systemSelector(state, [], ['maritalStatus', 'height', 'religions', 'communities', 'languages', 'countries', 'educationLevel', 'educationField', 'occupations']),
  }
}
export default connect(mapStateToProps)(ProfileInfo);