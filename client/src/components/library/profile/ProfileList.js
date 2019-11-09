import React from 'react';
import { connect } from 'react-redux';
import ProfileCard from './ProfileCard';
import ProfileSkelton from './ProfileSkelton';
import ProfileListHeader from './ProfileListHeader';
import ProfileListPagination from './ProfileListPagination';
import Alert from '../Alert';
import { Box } from '@material-ui/core';


const PreLoader = ({limit=10}) => {
  const keys = []
  for(let i=0; i<limit; i++)
    keys.push(i);
  return (
    <Box mt={{xs: "24px", md: "44px"}}>
    { keys.map(index => ( <ProfileSkelton key={index} /> )) }
    </Box>
  )
}

const ProfileList = ({NoResults, Heading, people}) => {
  const { profiles, loading, error } = people;
  
  //console.log(profiles);
  return (
    <div>
      { error ? <Alert variant="error" message={error} vertical="top" horizontal="center" /> : null }
      { !loading && profiles.length ? <ProfileListHeader Heading={Heading} /> : null }
      { !loading && !error && profiles.length === 0 ? NoResults : null }
      {
        !loading && profiles.length ? profiles.map(profile => (
          <ProfileCard key={profile._id} profile={profile} />
        )) : null
      }
      {
        loading ? <PreLoader limit={5} /> : null
      }
      {
        !loading && profiles.length > 0 ? <ProfileListPagination /> : null
      }
    </div>
  );
}

const mapStateToProps = (state) => {
  return{
    people: state.people
  }
}

export default connect(mapStateToProps)(ProfileList);