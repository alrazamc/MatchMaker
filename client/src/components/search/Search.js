import React, { useState, useEffect, useRef } from 'react';
import BasicSearch from './basic/BasicSearch';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import SearchResults from './SearchResults';
import { initialize } from 'redux-form';
import AdvancedSearch from './advanced/AdvancedSearch';

const Search = ({uid, filters, dispatch, ...route}) => {
  const [showResults, setShowResults] = useState(false);
  const routeType = route.history.location.pathname.split('/').pop();
  useEffect(() => {
    document.title = "Search | " + process.env.REACT_APP_NAME;
  }, []);
  const editSearch = (searchData = false) => {
    const formData = searchData.searchType ? searchData: filters;
    const formName = formData.searchType === 'advanced' ? 'advancedSearch' : 'basicSearch';
    if(formData.searchType !== routeType)
      route.history.push(formData.searchType);
    setShowResults(false);
    dispatch(initialize(formName, formData));
  }
  const queryString = useRef();
  useEffect(() => {
    if(route.location.search && queryString.current !== route.location.search)
    {
      setShowResults(false);
      queryString.current = route.location.search;
    }else if(!route.location.search)
      queryString.current = undefined;
  }, [route.location.search]);
  if(!uid)
    return <Redirect to="/signin" />
  return (
    <>
    { !showResults && routeType === 'advanced' && <AdvancedSearch editSearch={editSearch} showResults={setShowResults} /> }
    { !showResults && routeType === 'basic' && <BasicSearch editSearch={editSearch} showResults={setShowResults} /> }
    { showResults && <SearchResults editSearch={editSearch} showResults={setShowResults} /> }
    </>
  );
}

const mapStateToProps = state => {
  return{
    uid: state.auth.uid ? state.auth.uid : null,
    filters: state.people.filters ? state.people.filters : undefined
  }
}
export default connect(mapStateToProps)(Search);