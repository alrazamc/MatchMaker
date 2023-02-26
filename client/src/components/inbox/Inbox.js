import React, { useEffect, useMemo, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useLocation, Redirect } from 'react-router-dom';
import { Box, Container, Typography, Grid, Hidden, Paper } from '@material-ui/core';
import Navigation from './Navigation';
import TypeFilter from './TypeFilter';
import { changeFilters } from '../../store/actions/InboxActions';
import RequestList from './RequestList';
import { useWidth } from '../../config/MuiTheme';
import { isSmallScreen } from '../../utils/index';
import FbAnalytics from '../../config/FbAnalytics';


const tabs = [{
    id: 1,
    title: "Pending"
  },{
    id: 2,
    title: "Accepted"
  }, {
    id: 3,
    title: "Declined"
  }]

const Inbox = ({ uid, height, profileId, changeFilters, storeFilters, loading, hasProfiles}) => {
  const location = useLocation();
  const screenWidth = useWidth();
  const [firstTimeDone, setFirstTimeDone] = useState(false);
  const inboxRef = useRef();
  let path = location.pathname.split('/');
  const inboxSection = path[2] ? path[2] : 'sent';
  const subSection = path[3] ? path[3] : 'pending';

  useEffect(() => {
    document.title = "Inbox | " + process.env.REACT_APP_NAME;
  }, []);
  useEffect(() => {
    let path = location.pathname.split('/');
    const inboxSection = path[2] ? path[2] : '';
    const subSection = path[3] ? path[3] : '';
    FbAnalytics.logEvent('page_view', {page_title: `${inboxSection} ${subSection} Requests`, page_path: location.pathname})
  }, [location.pathname])

  useEffect(() => {
    if(loading){
       setFirstTimeDone(true); //loading first server request
      return
    };
    if(firstTimeDone && inboxRef.current === inboxSection) return;
    inboxRef.current = inboxSection;
    const filters = {};
    if (inboxSection === 'sent' || inboxSection === 'connections')
      filters.from = profileId
    if (inboxSection === 'received' || inboxSection === 'connections')
      filters.to = profileId;
    if (inboxSection === 'connections')
    {
      filters.status = 2;
      filters.type = 1;
    }else
    {
      const status = tabs.find(item => item.title.toLowerCase() === subSection);
      filters.status = status ? status.id : 1;
    }
    if(storeFilters && ( !filters.from  || filters.from === storeFilters.from) &&
       ( !filters.to  || filters.to === storeFilters.to) && 
       ( !filters.status  || filters.status === storeFilters.status) && 
       ( !filters.type  || filters.type === storeFilters.type) && hasProfiles )
      return;
    changeFilters(filters);
  }, [inboxSection, profileId, changeFilters, firstTimeDone, loading, subSection, storeFilters, hasProfiles]);

  const NoResults = useMemo(() => {
    return (
      <Paper>
        <Box display="flex" justifyContent="center" alignItems="center" p={2} textAlign="center" height={{ xs: 150, md: 200 }}>
          <Typography variant="h6">
            {`No ${inboxSection === 'sent' ? 'sent' : ''} 
                ${inboxSection === 'received' ? 'received' : ''}
             ${inboxSection === 'connections' ? 'connections' : 'requests'} found`}
            </Typography>
        </Box>
      </Paper>
    )
  }, [inboxSection])

  if(!uid)
    return <Redirect to="/signin" />
  if(!height)
    return <Redirect to="/my/profile" />
  return (
    <Box>
      <Container>
        <Grid container spacing={2}>
          <Hidden smDown>
            <Grid item xs={12} md={1} >
            </Grid>
          </Hidden>
          <Grid item xs={12} md={10}>
            {
              !isSmallScreen(screenWidth) ? null :
              <Typography variant="h6">
                {inboxSection === 'sent' ? "Requests you sent" : null}
                {inboxSection === 'received' ? "Requests you received" : null}
                {inboxSection === 'connections' ? "Members you can chat with" : null}
              </Typography>
            }
            {
              inboxSection === 'connections' ? null :
              <>
                <Navigation tabs={tabs} />
                { storeFilters && storeFilters.from && storeFilters.to ? null :  <TypeFilter /> }
              </>
            }
            <RequestList NoResults={NoResults}/>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

const mapStateToProps = state => {
  return{
    uid: state.auth.uid,
    height: state.profile.basicInfo ? state.profile.basicInfo.height : null,
    profileId: state.profile._id ? state.profile._id : null,
    storeFilters: state.inbox.filters,
    loading: state.inbox.loading,
    hasProfiles: state.inbox.profiles.length,
  }
}


export default  connect(mapStateToProps, { changeFilters })(Inbox);