import React, { useEffect, useMemo } from 'react';
import { Container, Grid, Hidden, Box } from '@material-ui/core';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { compose } from 'redux';
import ProfilePanel from '../../library/ProfilePanel';
import BasicInfo from './BasicInfo';
import BasicInfoForm from './forms/BasicInfoForm';
import Lifestyle from './Lifestyle';
import LifestyleForm from './forms/LifestyleForm';
import Religion from './Religion';
import ReligionForm from './forms/ReligionForm';
import Family from './Family';
import FamilyForm from './forms/FamilyForm';
import Description from './Description';
import DescriptionForm from './forms/DescriptionForm';
import EducationCareer from './EducationCareer';
import EducationCareerForm from './forms/EducationCareerForm';
import Location from './Location';
import LocationForm from './forms/LocationForm';
import withSystem from '../../library/withSystem';
import { useWidth } from '../../../config/MuiTheme';
import { isSmallScreen } from '../../../utils';

const Profile = (props) => {
  useEffect(() => {
    document.title = "Profile | " + process.env.REACT_APP_NAME;
  }, []);
  const screenWidth = useWidth();
  const expanded = useMemo(() => (!isSmallScreen(screenWidth)), [screenWidth]);
  if(!props.auth.uid)
    return <Redirect to="/signin" />
  return (
    <Box>
      <Container>
        <Grid container spacing={2}>
          <Hidden smDown>
            <Grid item xs={12} md={2} >
              {null}
            </Grid>
          </Hidden>
          <Grid item xs={12} md={7}>
            <ProfilePanel expanded={expanded} id="basic-info" heading="Basic Info" DisplayComponent={BasicInfo} FormComponent={BasicInfoForm} />
            <ProfilePanel expanded={expanded} id="religion-caste" heading="Religion & Caste" DisplayComponent={Religion} FormComponent={ReligionForm} />
            <ProfilePanel expanded={expanded} id="family-info" heading="Family" DisplayComponent={Family} FormComponent={FamilyForm} />
            <ProfilePanel expanded={expanded} id="education-career" heading="Education & Career" DisplayComponent={EducationCareer} FormComponent={EducationCareerForm} />
            <ProfilePanel expanded={expanded} id="life-style" heading="Lifestyle" DisplayComponent={Lifestyle} FormComponent={LifestyleForm} />             
            <ProfilePanel expanded={expanded} id="location" heading="Location" DisplayComponent={Location} FormComponent={LocationForm} />
            <ProfilePanel expanded={expanded} id="profile-description" heading="More About Yourself, Partner and Family" DisplayComponent={Description} FormComponent={DescriptionForm} /> 
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

const mapStateToProps = (state) => {
  return{
    auth: state.auth
  }
}
const systemNames = ['profileCreatedBy', 'gender', 'maritalStatus', 'height', 'bodyType', 'healthInfo', 'skinTone', 'disability', 'bloodGroup', 
                    'religions', 'communities', 'languages', 'namaaz', 'yesNo', 'fatherStatus', 'motherStatus', 'familyType', 'familyValues', 
                    'familyAffluence', 'educationLevel', 'educationField', 'workingWith', 'occupations', 'annualIncome', 'diet', 'drink', 
                    'smoke', 'countries'];
                    
export default compose(
connect(mapStateToProps),
withSystem(systemNames)
)(Profile);