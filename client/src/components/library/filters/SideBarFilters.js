import React, { useState, useRef, useEffect } from 'react';
import { Box, makeStyles, Typography, Button, Collapse } from '@material-ui/core';
import RadioFilter from './RadioFilter';
import CheckboxFilter from './CheckboxFilter';
import { connect } from 'react-redux';
import { updateFilterField } from '../../../store/actions/PeopleActions';
import TuneIcon from '@material-ui/icons/TuneOutlined';
import { useWidth } from '../../../config/MuiTheme';
import { isSmallScreen } from '../../../utils';
import axios from 'axios';
import SortBy from '../profile/SortBy';

const useStyles = makeStyles(theme => ({
  root:{
    borderRadius: 3
  },
  header:{
    backgroundColor: theme.palette.grey[400],
    padding: theme.spacing(0.5, 0),
    color: theme.palette.grey[900]
  }
}))

const matchesOptions = [{
  value: 1,
  title: "2-way Matches"
}];

const joinedActiveOptions = [{
  value: 1,
  title: "Within a day"
},{
  value: 7,
  title: "Within a week"
},
{
  value: 30,
  title: "Within a month"
}];

const photoOptions = [{
    id: 1,
    title: "Public"
  },{
    id: 2,
    title: "Protected"
}]

const liveOptions = [{
  value: parseInt(process.env.REACT_APP_ACTIVE_INTERVAL),
  title: "Online Now"
}];

const SideBarFilters = ({filters, communities, updateFilterField}) => {
  const classes = useStyles();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const screenWidth = useWidth();
  useEffect(() => {
    setShowFilters((!isSmallScreen(screenWidth)))
  }, [screenWidth])
  const [showFilters, setShowFilters] = useState( () => (!isSmallScreen(screenWidth)) );

  const [communityOptions, setCommunityOptions] = useState([]);
  const countryRef = useRef();
  const stateRef = useRef();
  const religionRef = useRef();

  //load new states options and value
  useEffect(() => {
    if(filters.country === countryRef.current) // run hook only on country change
      return;
    else
      countryRef.current = filters.country;
    if(!filters.country)
    {
      updateFilterField('state', null);
      setStates([]);
      return;
    }
    if(states.length)
    {
      let newStates = states.filter(state => filters.country.includes(state.country_id));
      processStates(newStates);
    }
    axios.get('/api/system/states', { params: {ids: filters.country}}).then(response => {
      processStates(response.data);
    });

    function processStates(states){
      setStates(states);
      let stateIds = [];
      states.forEach(state => {
        if(filters.state && filters.state.includes(state.id))
          stateIds.push(state.id)
      })
      if(stateIds.length === 0)
        updateFilterField('state', null);
      else if(JSON.stringify(stateIds) !== JSON.stringify(filters.state))
        updateFilterField('state', stateIds)
    }
  }, [filters.country, filters.state, updateFilterField]); //state added due to linter warning

  //load new city options and value
  useEffect(() => {
    if(filters.state === stateRef.current) // run hook only on state change
      return;
    else
      stateRef.current = filters.state;
    if(!filters.state)
    {
      updateFilterField('city', null);
      setCities([]);
      return;
    }
    if(cities.length)
    {
      let newCities = cities.filter(city => filters.state.includes(city.state_id));
      processCities(newCities);
    }
    axios.get('/api/system/cities', { params: {ids: filters.state }}).then(response => {
      processCities(response.data);
    });
    function processCities(cities){
      setCities(cities);
      let cityIds = [];
      cities.forEach(city => {
        if(filters.city && filters.city.includes(city.id))
          cityIds.push(city.id)
      })
      if(cityIds.length === 0)
        updateFilterField('city', null);
      else if(JSON.stringify(cityIds) !== JSON.stringify(filters.city))
        updateFilterField('city', cityIds);
    }
  }, [filters.state, filters.city, updateFilterField]); //country added due to linter warning
  
  //calculate new community options and value
  useEffect(() => {
    if(communities.length === 0 || filters.religion === religionRef.current) // run hook only on state change
      return;
    else
      religionRef.current = filters.religion;
    if(!filters.religion){
      updateFilterField('community', null);
      setCommunityOptions([]);
      return;
    }
    let options = communities.filter(item => filters.religion.includes(item.religion) && item.title !== "Other" );
    setCommunityOptions(options);
    let communityIds = [];
    options.forEach(community => {
      if(filters.community && filters.community.includes(community.id))
        communityIds.push(community.id)
    })
    if(communityIds.length === 0)
      updateFilterField('community', null);
    else if(JSON.stringify(communityIds) !== JSON.stringify(filters.community))
      updateFilterField('community', communityIds);
  }, [filters.religion, filters.community, communities, updateFilterField])
  return (
    <>
      <Box display={{xs: 'flex', md: "none"}} justifyContent="space-between" alignItems="center">
          <SortBy />
          <Button variant="outlined" color="primary" onClick={() => setShowFilters(!showFilters)}> <TuneIcon /> Filters</Button>
      </Box>
      <Collapse in={showFilters}>
        <Box width="100%" className={classes.root} mt={{xs: 0, md: "44px"}} border={1} borderColor="grey.400">
          <Box textAlign="center" width="100%" className={classes.header} >
            <Typography variant="body1" color="inherit"> Filters</Typography>
          </Box>
          <RadioFilter label="Matches" name="twoWayMatch" options={matchesOptions} />
          <CheckboxFilter label="Photo Settings" name="visibility" options={photoOptions} />
          <RadioFilter label="Online Members" options={liveOptions} name="availableForChat"/>
          <RadioFilter label="Active Members" options={joinedActiveOptions} name="activeWithin"/>
          <RadioFilter label="Recently Joined" options={joinedActiveOptions} name="joinedWithin"/>
          <CheckboxFilter label="Annual Income" name="annualIncome" optionsKey="annualIncome" />
          <CheckboxFilter label="Marital Status" name="maritalStatus" optionsKey="maritalStatus" />
          <CheckboxFilter label="Religion" name="religion" optionsKey="religions" />
          { communityOptions.length ? <CheckboxFilter label="Community" name="community" options={communityOptions} /> : null}
          <CheckboxFilter label="Mother Tongue" name="motherTongue" optionsKey="languages" />
          <CheckboxFilter label="Country Living in" name="country" optionsKey="countries" />
          { states.length ? <CheckboxFilter label="State Living in" name="state" options={states} /> : null}
          { cities.length ? <CheckboxFilter label="City Living in" name="city" options={cities} /> : null}
          <CheckboxFilter label="Education" name="educationLevel" optionsKey="educationLevel" />
          <CheckboxFilter label="Working With" name="workingWith" optionsKey="workingWith" />
          <CheckboxFilter label="Profession Area" name="workingAs" optionsKey="occupations" />
          <CheckboxFilter label="Profile Created by" name="profileCreatedBy" optionsKey="profileCreatedBy" />
          <CheckboxFilter label="Diet" name="diet" optionsKey="diet" />
        </Box>
      </Collapse>
    </>
  );
}

const mapStateToProps = state => {
  return {
    communities: state.system && state.system.communities ? state.system.communities.choices : [],
    filters:{
      religion: state.people.filters ? state.people.filters.religion : null,
      community: state.people.filters ? state.people.filters.community : null,
      country: state.people.filters ? state.people.filters.country : null,
      state: state.people.filters ? state.people.filters.state : null,
      city: state.people.filters ? state.people.filters.city : null,
    }
  }
}

export default connect(mapStateToProps, {updateFilterField})(SideBarFilters);