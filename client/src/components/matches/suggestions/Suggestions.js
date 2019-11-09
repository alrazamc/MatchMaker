import React, { useEffect, useState } from 'react';
import { Container, Grid, Box, Link, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { Redirect, Link as RouterLink } from 'react-router-dom';
import { compose } from 'redux';
import withSystem from '../../library/withSystem';
import ProfileList from '../../library/profile/ProfileList';
import { changeFilters } from '../../../store/actions/PeopleActions';
import SideBarFilters from '../../library/filters/SideBarFilters';
import { useWidth } from '../../../config/MuiTheme';
import { isSmallScreen } from '../../../utils';

const NoResults = () => (
  <Box px={0} py={4} textAlign="center">
    <Typography gutterBottom>
      No profiles found. We recommend you to relax your search criteria. <Link component={RouterLink} to="/my/partner-preference">Edit Partner Preference</Link>
    </Typography>
    <Typography>
      We will also notify you when someone new joins and meets your criteria 
    </Typography>
  </Box>
)

const ProfileListHeader = () => (
  <>
    Members who match your preferences <Link component={RouterLink} to="/my/partner-preference">Edit</Link>
  </>
)

const Suggestions = ({uid, partnerPreference, changeFilters}) => {
  const [renderFilters, setRenderFilters] = useState(false);
  useEffect(() => {
    document.title = "Suggestions | " + process.env.REACT_APP_NAME;
  }, []);
  const screenWidth = useWidth();
  useEffect(() => {
    let timeOut = setTimeout(() => setRenderFilters(true), isSmallScreen(screenWidth) ? 800 : 50);
    return () => {
      if(timeOut)
        clearTimeout(timeOut);
    }
  }, [screenWidth])
  useEffect(() => {
    if(!partnerPreference) return;
    changeFilters(partnerPreference);
  }, [partnerPreference, changeFilters]);

  if(!uid)
    return <Redirect to="/signin" />
  return (
    <Box>
      <Container>
        <Grid container spacing={2}>
            <Grid item xs={12} md={2} >
              <Box minHeight="44px">
                {renderFilters ?  <SideBarFilters /> : null}
              </Box>
            </Grid>
          <Grid item xs={12} md={8}>
            <ProfileList NoResults={<NoResults />} Heading={<ProfileListHeader />}  />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

const mapStateToProps = (state) => {
  return{
    uid: state.auth.uid,
    partnerPreference: state.profile.partnerPreference ? state.profile.partnerPreference : null
  }
}
const systemNames = ['profileCreatedBy', 'gender', 'maritalStatus', 'height', 'bodyType', 'healthInfo', 'skinTone', 'disability', 'bloodGroup', 
                    'religions', 'communities', 'languages', 'namaaz', 'yesNo', 'fatherStatus', 'motherStatus', 'familyType', 'familyValues', 
                    'familyAffluence', 'educationLevel', 'educationField', 'workingWith', 'occupations', 'annualIncome', 'diet', 'drink', 
                    'smoke', 'countries'];
                    
export default compose(
connect(mapStateToProps, {changeFilters}),
withSystem(systemNames)
)(Suggestions);