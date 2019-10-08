import React, { useEffect } from 'react';
import { Container, Grid, Hidden, Box } from '@material-ui/core';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import ProfilePanel from './ProfilePanel';
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
import Navigation from './Navigation';

const Profile = (props) => {
  useEffect(() => {
    document.title = "Profile | " + process.env.REACT_APP_NAME;
  }, []);
  if(!props.auth.uid)
    return <Redirect to="/signin" />
  return (
    <Box>
      <Navigation match={props.match} history={props.history}/>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2} >
            <Hidden smDown>
              {null}
            </Hidden>
          </Grid>
          <Grid item xs={12} md={7}>
            <ProfilePanel id="basic-info" heading="Basic Info" DisplayComponent={BasicInfo} FormComponent={BasicInfoForm} /> 
            <ProfilePanel id="religion-caste" heading="Religion & Caste" DisplayComponent={Religion} FormComponent={ReligionForm} />
            <ProfilePanel id="family-info" heading="Family" DisplayComponent={Family} FormComponent={FamilyForm} /> 
            <ProfilePanel id="education-career" heading="Education & Career" DisplayComponent={EducationCareer} FormComponent={EducationCareerForm} />
            <ProfilePanel id="life-style" heading="Lifestyle" DisplayComponent={Lifestyle} FormComponent={LifestyleForm} />
            <ProfilePanel id="location" heading="Location" DisplayComponent={Location} FormComponent={LocationForm} />
            <ProfilePanel id="profile-description" heading="More About Yourself, Partner and Family" DisplayComponent={Description} FormComponent={DescriptionForm} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

const mapStateToProps = (state) => {
  return{
    auth: state.firebase.auth
  }
}

export default compose(
connect(mapStateToProps),
firestoreConnect((props) => ([
  {
    collection: 'system'
  }
]))
)(Profile);