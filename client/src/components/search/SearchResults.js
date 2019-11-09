import React, { useEffect, useState } from 'react';
import { Container, Grid, Box, Typography, Button, Hidden } from '@material-ui/core';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withSystem from '../library/withSystem';
import ProfileList from '../library/profile/ProfileList';
import { changeFilters } from '../../store/actions/PeopleActions';
import SideBarFilters from '../library/filters/SideBarFilters';
import { useWidth } from '../../config/MuiTheme';
import { isSmallScreen } from '../../utils';
import SavedSearchesList from './SavedSearchesList';

const NoResults = ({editSearch}) => (
  <Box px={0} py={4} textAlign="center">
    <Typography gutterBottom>
      No profiles found. We recommend you to relax your search criteria. <Button color="primary" onClick={editSearch}>Edit Search</Button>
    </Typography>
  </Box>
)

const ProfileListHeader = ({editSearch}) => (
  <>
    Search Results <Button color="primary" onClick={editSearch}>Edit</Button>
  </>
)

const SearchResults = ({editSearch, showResults}) => {
  const [renderFilters, setRenderFilters] = useState(false);
  const screenWidth = useWidth();
  useEffect(() => {
    setTimeout(() => setRenderFilters(true), isSmallScreen(screenWidth) ? 800 : 50);
  }, [screenWidth])
  return (
    <Box>
      <Container>
        <Grid container spacing={2}>
          <Hidden mdUp>
            <Grid item xs={12} md={3}>
              <SavedSearchesList editSearch={editSearch} showResults={showResults} />
            </Grid>
          </Hidden>
          <Grid item xs={12} md={2} >
            <Box minHeight="44px">
              {renderFilters ?  <SideBarFilters /> : null}
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <ProfileList NoResults={<NoResults editSearch={editSearch} />} Heading={<ProfileListHeader editSearch={editSearch} />}    />
          </Grid>
          <Hidden smDown>
            <Grid item xs={12} md={3}>
              <SavedSearchesList editSearch={editSearch} showResults={showResults} />
            </Grid>
          </Hidden>
        </Grid>
      </Container>
    </Box>
  );
}

const mapStateToProps = (state) => {
  return{
  }
}
const systemNames = ['profileCreatedBy', 'gender', 'maritalStatus', 'height', 'bodyType', 'healthInfo', 'skinTone', 'disability', 'bloodGroup', 
                    'religions', 'communities', 'languages', 'namaaz', 'yesNo', 'fatherStatus', 'motherStatus', 'familyType', 'familyValues', 
                    'familyAffluence', 'educationLevel', 'educationField', 'workingWith', 'occupations', 'annualIncome', 'diet', 'drink', 
                    'smoke', 'countries'];
                    
export default compose(
connect(mapStateToProps, {changeFilters}),
withSystem(systemNames)
)(SearchResults);