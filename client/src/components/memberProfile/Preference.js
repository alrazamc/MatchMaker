import React, { useState, useEffect, useMemo } from 'react';
import { makeStyles, Paper, Typography, Box, Divider } from '@material-ui/core';
import { systemSelector } from '../../store/selectors/systemSelector';
import { connect } from 'react-redux';
import ProfileAvatar from '../library/ProfileAvatar';
import MemberAvatar from './MemberAvatar';
import PreferenceItem from './PreferenceItem';
import dayjs from 'dayjs';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  root:{
    marginTop: theme.spacing(1),
    color: theme.palette.grey[600],
  },
  about: {
    color: theme.palette.grey[800]
  },
  matchesCount: {
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(1, 3),
    borderRadius: 6,
    display: "inline-block",
    position: "relative",
    zIndex: 3
  },
  divider:{
    position: "relative",
    top: 20,
  }
}));

const getLabels = (values,  options) => {
  let texts = values.map(value => options[value] ? options[value].title : '');
  return texts.join(', ');
}

const Preference = ({profile, myProfile, system}) => {
  const classes = useStyles();
  const [states, setStates] = useState({});
  const [cities, setCities] = useState({});
  const memPref = profile.partnerPreference;
  const myAge = myProfile.basicInfo && myProfile.basicInfo.dateOfBirth ? dayjs().diff(myProfile.basicInfo.dateOfBirth, 'year') : -20;
  const myHeight = myProfile.basicInfo && myProfile.basicInfo.height ? myProfile.basicInfo.height - 1 : -20;
  const loadStateCities = async (stateIds, cityIds) => {
    if(stateIds)
    {
      let { data } = await axios.get('/api/system/states', { params: {stateIds}});
      if(data.length)
      {
        let choices = {}
        data.forEach(item => choices[item.id] = {title : item.title});
        setStates(choices);
      }
    }
    if(cityIds)
    {
      const response = await axios.get('/api/system/cities', { params: {cityIds}});
      if(response.data.length)
      {
        let choices = {}
        response.data.forEach(item => choices[item.id] = {title : item.title});
        setCities(choices);
      }
    }
  };
  useEffect(() => {
    loadStateCities(memPref.state, memPref.city);
  }, [memPref])

  const [total, matchCount, matches] = useMemo(() => {
    const matches = {};
    if(memPref.age) matches.age = myAge >= memPref.age[0] && myAge<= memPref.age[1];
    if(memPref.height) matches.height = myHeight >= memPref.height[0] && myHeight<= memPref.height[1];
    if(memPref.maritalStatus) matches.maritalStatus = memPref.maritalStatus.includes(myProfile.basicInfo ? myProfile.basicInfo.maritalStatus : null);
    if(memPref.religion) matches.religion = memPref.religion.includes(myProfile.religionCaste ? myProfile.religionCaste.religion : null);
    if(memPref.religion && memPref.community) 
      matches.community = memPref.community.includes(myProfile.religionCaste ? myProfile.religionCaste.community : null);
    if(memPref.motherTongue) matches.motherTongue = memPref.motherTongue.includes(myProfile.religionCaste ? myProfile.religionCaste.motherTongue : null);
    if(memPref.country) matches.country = memPref.country.includes(myProfile.location ? myProfile.location.country : null);
    if(memPref.country && memPref.state) 
      matches.state = memPref.state.includes(myProfile.location && myProfile.location.state ? myProfile.location.state.id : null);
    if(memPref.country && memPref.state && memPref.city) 
      matches.city = memPref.city.includes(myProfile.location && myProfile.location.city ? myProfile.location.city.id : null);
    if(memPref.educationLevel) matches.educationLevel = memPref.educationLevel.includes(myProfile.educationCareer ? myProfile.educationCareer.educationLevel : null);
    if(memPref.workingWith) matches.workingWith = memPref.workingWith.includes(myProfile.educationCareer ? myProfile.educationCareer.workingWith : null);
    if(memPref.workingAs) matches.workingAs = memPref.workingAs.includes(myProfile.educationCareer ? myProfile.educationCareer.workingAs : null);
    if(memPref.annualIncome) matches.annualIncome = memPref.annualIncome <= (myProfile.educationCareer && myProfile.educationCareer.annualIncome < 13 ? myProfile.educationCareer.annualIncome : -10);
    if(memPref.profileCreatedBy) matches.profileCreatedBy = memPref.profileCreatedBy.includes(myProfile.basicInfo ? myProfile.basicInfo.profileCreatedBy : null)
    if(memPref.diet) matches.diet = memPref.diet.includes(myProfile.lifestyle ? myProfile.lifestyle.diet : null)
    let matchCount = 0;
    for(let key in matches)
      if(matches[key]) matchCount++;
    return [Object.keys(matches).length, matchCount, matches]
  }, [memPref, myProfile, myAge, myHeight]);

  if(!memPref) return null;
  const heightText = [];
  if(memPref.height)
  {
    heightText[0] = system.data.height[ memPref.height[0] + 1 ] ? system.data.height[ memPref.height[0] + 1 ].labelSymbol : '';
    heightText[1] = system.data.height[ memPref.height[1] + 1 ] ? system.data.height[ memPref.height[1] + 1 ].labelSymbol : '';
  }

  const gender = profile.basicInfo ? profile.basicInfo.gender: 1
  return (
    <Paper className={classes.root}>
      <Box py={1} px={2}>
        <Typography variant="h6" className={classes.about} gutterBottom>What {gender === 1 ? 'he' : 'she'} is looking for</Typography>
        <Box width="100%" display="flex" justifyContent="space-between" height={80} alignItems="center">
          <MemberAvatar size={60} photos={profile.photos} gender={gender} />
          <Box flexGrow={1} px={{xs: 1, md: 3}} position="relative" textAlign="center">
            <Divider variant="fullWidth" className={classes.divider} />
            <Typography className={classes.matchesCount}> You match {matchCount}/{total} of {gender === 1 ? 'his' : 'her'} preferences </Typography>
          </Box>
          <ProfileAvatar size={60} />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography>{gender === 1 ? 'His' : 'Her'} preferences</Typography>
          <Typography>Match?</Typography>
        </Box>
        { memPref.age ? <PreferenceItem label="Age" preference={memPref.age[0] + ' to ' + memPref.age[1] } check={matches.age} /> : null }
        { memPref.height ? <PreferenceItem label="Height" preference={heightText[0] + ' to ' + heightText[1] } check={matches.height} /> : null }
        { memPref.maritalStatus ? <PreferenceItem label="Marital Status" preference={getLabels(memPref.maritalStatus, system.data.maritalStatus)} check={matches.maritalStatus} /> : null }
        { memPref.religion ? <PreferenceItem label="Religion" preference={getLabels(memPref.religion, system.data.religions)} check={matches.religion} /> : null }
        { memPref.religion && memPref.community ? <PreferenceItem label="Community" preference={getLabels(memPref.community, system.data.communities)} check={matches.community} /> : null }
        { memPref.motherTongue ? <PreferenceItem label="Mother Tongue" preference={getLabels(memPref.motherTongue, system.data.languages)} check={matches.motherTongue} /> : null }
        { memPref.country ? <PreferenceItem label="Country Living in" preference={getLabels(memPref.country, system.data.countries)} check={matches.country} /> : null } 
        { memPref.country && memPref.state ? <PreferenceItem label="State Living in" preference={getLabels(memPref.state, states)} check={matches.state} /> : null }
        { memPref.country && memPref.state && memPref.city ? <PreferenceItem label="City Living in" preference={getLabels(memPref.city, cities)} check={matches.city} /> : null }
        { memPref.educationLevel ? <PreferenceItem label="Education" preference={getLabels(memPref.educationLevel, system.data.educationLevel)} check={matches.educationLevel} /> : null }
        { memPref.workingWith ? <PreferenceItem label="Working With" preference={getLabels(memPref.workingWith, system.data.workingWith)} check={matches.workingWith} /> : null }
        { memPref.workingAs ? <PreferenceItem label="Profession Area" preference={getLabels(memPref.workingAs, system.data.occupations)} check={matches.workingAs} /> : null }
        { memPref.annualIncome ? <PreferenceItem label="Minimum Annual Income" preference={system.data.annualIncome[memPref.annualIncome] ? system.data.annualIncome[memPref.annualIncome].title : '' } check={matches.annualIncome} /> : null }
        { memPref.profileCreatedBy ? <PreferenceItem label="Profile Created By" preference={getLabels(memPref.profileCreatedBy, system.data.profileCreatedBy)} check={matches.profileCreatedBy} /> : null }
        { memPref.diet ? <PreferenceItem label="Diet" preference={getLabels(memPref.diet, system.data.diet)} check={matches.diet} /> : null }
        
      </Box>
    </Paper>
  );
}

 
const mapStateToProps = state => {
  return {
    system: systemSelector(state, [], ['height', 'maritalStatus', 'religions', 'communities', 'languages', 'countries', 'educationLevel', 'workingWith', 'occupations', 'annualIncome', 'profileCreatedBy', 'diet']),
  }
}
export default connect(mapStateToProps)(Preference);
 
