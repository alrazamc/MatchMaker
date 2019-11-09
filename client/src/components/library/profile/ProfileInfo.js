import React from 'react';
import { Typography, Box, makeStyles, Link } from '@material-ui/core';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import { systemSelector } from '../../../store/selectors/systemSelector';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  info: {
    color: "#727272"
  },
  description: {
    display: "-webkit-box",
    maxWidth: "100%",
    margin: "0 auto",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  profileLink: {
    "&:hover": {
      textDecoration: "none"
    }
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
    <Link  to={`/profile/${profile._id}`} className={classes.profileLink} component={RouterLink}>
      <Box px={2} display="flex" className={classes.info} flexWrap="wrap">
        <Box width={{xs: "50%", sm: "40%"}}>
          <Typography color="inherit" noWrap={true}>{age} {height}</Typography>
          <Typography color="inherit" noWrap={true}>{religion}</Typography>
          <Typography color="inherit" noWrap={true}>{community}</Typography>
          <Typography color="inherit" noWrap={true}>{language}</Typography>
        </Box>
        <Box width={{xs: "50%", sm: "60%"}}>
          <Typography color="inherit" noWrap={true}>{maritalStatus}</Typography>
          <Typography color="inherit" noWrap={true}>{location && location.city && location.city.name ? location.city.name+',' : null} {country}</Typography>
          <Typography color="inherit" noWrap={true}>{educationLevel} {educationField ? ' in ' + educationField : null}</Typography>
          <Typography color="inherit" noWrap={true}>{workingAs}</Typography>
        </Box>
        <Box>
          <Typography color="inherit" className={classes.description}>
            {profile.profileDescription} 
          </Typography>
        </Box>
      </Box>
    </Link>
  );
}
 
const mapStateToProps = state => {
  return {
    system: systemSelector(state, [], ['maritalStatus', 'height', 'religions', 'communities', 'languages', 'countries', 'educationLevel', 'educationField', 'occupations']),
  }
}
export default connect(mapStateToProps)(ProfileInfo);