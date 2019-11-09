import axios from 'axios';

export const actionTypes = {
  PEOPLE_LOADING: 'peopleLoading',
  PEOPLE_LOADING_SUCCESS: 'peopleLoadingSuccess',
  PEOPLE_LOADING_ERROR: 'peopleLoadingError',
  PEOPLE_FILTERS_CHANGED: 'peopleFiltersChanged',
  PEOPLE_FILTERS_UPDATED: 'peopleFiltersUpdated',
  PEOPLE_FILTERS_FIELD_UPDATED: 'peopleFilterFieldUpdated',
  PEOPLE_SORT_BY_CHANGED: 'peopleSortByChanged',
  PEOPLE_PAGE_NUMBER_CHANGED: 'peoplePageNumberChanged',

  PEOPLE_ACTION_ERROR: 'peopleActionError',
  PEOPLE_ACTION_SHORTLIST: 'peopleActionShortlist',
  PEOPLE_ACTION_UNDO_SHORTLIST: 'peopleActionUndoShortlist',

  PEOPLE_ACTION_DONT_SHOW: 'peopleActionDontShow',
  PEOPLE_ACTION_UNDO_DONT_SHOW: 'peopleActionUndoDontShow',

  PEOPLE_ACTION_BLOCK: 'peopleActionBlock',
  PEOPLE_ACTION_UNDO_BLOCK: 'peopleActionUndoBlock',

  PEOPLE_SEND_REQUEST: 'peopleSendRequest',
  PEOPLE_CANCEL_REQUEST: 'peopleCancelRequest',
  PEOPLE_ACCEPT_REQUEST: 'peopleAcceptRequest',
  PEOPLE_DECLINE_REQUEST: 'peopleDeclineRequest',
  PEOPLE_REVERSE_REQUEST_STATUS: 'peopleReverseRequestStatus',
}


export const  searchProfiles = async (dispatch, getState) => {
  dispatch({type: actionTypes.PEOPLE_LOADING});
  try{
    const {data} = await axios.post('/api/search', getState().people.filters);
    dispatch({
      type: actionTypes.PEOPLE_LOADING_SUCCESS,
      payload: data
    })
  }catch(err)
  {
    dispatch({
      type: actionTypes.PEOPLE_LOADING_ERROR,
      error: err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message
    })
  }
}

//replace filter
export const changeFilters = (filters) => {
  return async (dispatch, getState) => {
    const state = getState();
    if(state.profile.basicInfo && state.profile.basicInfo.gender)
      filters.gender = state.profile.basicInfo.gender === 1  ? 2 : 1;
    filters.profileId = state.profile._id;
    dispatch({
      type: actionTypes.PEOPLE_FILTERS_CHANGED,
      filters
    });
    await searchProfiles(dispatch, getState);
  }
}

//change any specific thing in filter
export const updateFilters = (name, value) => {
  return async (dispatch, getState) => {
    //await - let the effects runs first in sidebar filters to update community, state, city
    await dispatch({
      type: actionTypes.PEOPLE_FILTERS_UPDATED,
      name,
      value
    });
    await searchProfiles(dispatch, getState);
  }
}

//change filter field but do not reload results or modif
export const updateFilterField = (name, value) => {
  return {
    type: actionTypes.PEOPLE_FILTERS_FIELD_UPDATED,
    name,
    value
  };
}

export const updateSortBy = (sortBy) => {
  return async (dispatch, getState) => {
    dispatch({
      type: actionTypes.PEOPLE_SORT_BY_CHANGED,
      sortBy
    });
    await searchProfiles(dispatch, getState);
  }
}

export const updatePageNumber = (pageNumber) => {
  return async (dispatch, getState) => {
    dispatch({
      type: actionTypes.PEOPLE_PAGE_NUMBER_CHANGED,
      pageNumber
    });
    await searchProfiles(dispatch, getState);
  }
}

//shortlist a profile
export const shortlist = (personID) => {
  return (dispatch, getState) => {
    const profile = getState().profile;
    let shortlisted = profile.shortlisted ? [...profile.shortlisted] : [];
    shortlisted.unshift(personID)
    dispatch({type: actionTypes.PEOPLE_ACTION_SHORTLIST, shortlisted})
    axios.post('/api/people/doAction', { listName: 'shortlisted', personID, profileId: profile._id  }).then(({data}) => {

    }).catch(err => {
      dispatch({
        type: actionTypes.PEOPLE_ACTION_ERROR,
        error: err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message
      })
      dispatch({type: actionTypes.PEOPLE_ACTION_UNDO_SHORTLIST, shortlisted: shortlisted.filter(item => item !== personID)})
    })
    
  }
}

//Remove from short
export const undoShortlist = (personID) => {
  return (dispatch, getState) => {
    const profile = getState().profile;
    let shortlisted = profile.shortlisted ? [...profile.shortlisted] : [];
    dispatch({type: actionTypes.PEOPLE_ACTION_UNDO_SHORTLIST, shortlisted: shortlisted.filter(item => item !== personID)})
    axios.post('/api/people/undoAction', { listName: 'shortlisted', personID, profileId: profile._id  }).then(({data}) => {

    }).catch(err => {
      dispatch({
        type: actionTypes.PEOPLE_ACTION_ERROR,
        error: err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message
      })
      dispatch({type: actionTypes.PEOPLE_ACTION_SHORTLIST, shortlisted})
    })
    
  }
}

//filter a profile to not show in search result
export const dontShow = (personID) => {
  return (dispatch, getState) => {
    const profile = getState().profile;
    let filtered = profile.filtered ? [...profile.filtered] : [];
    filtered.unshift(personID)
    dispatch({type: actionTypes.PEOPLE_ACTION_DONT_SHOW, filtered})
    axios.post('/api/people/doAction', { listName: 'filtered', personID, profileId: profile._id  }).then(({data}) => {

    }).catch(err => {
      dispatch({
        type: actionTypes.PEOPLE_ACTION_ERROR,
        error: err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message
      })
      dispatch({type: actionTypes.PEOPLE_ACTION_UNDO_DONT_SHOW, filtered: filtered.filter(item => item !== personID)})
    })
    
  }
}

//Remove a profile from filtered/don't show persons list
export const undoDontShow = (personID) => {
  return (dispatch, getState) => {
    const profile = getState().profile;
    let filtered = profile.filtered ? [...profile.filtered] : [];
    dispatch({type: actionTypes.PEOPLE_ACTION_UNDO_DONT_SHOW, filtered: filtered.filter(item => item !== personID)})
    axios.post('/api/people/undoAction', { listName: 'filtered', personID, profileId: profile._id  }).then(({data}) => {

    }).catch(err => {
      dispatch({
        type: actionTypes.PEOPLE_ACTION_ERROR,
        error: err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message
      })
      dispatch({type: actionTypes.PEOPLE_ACTION_DONT_SHOW, filtered})
    })
    
  }
}

//Block a profile
export const block = (personID) => {
  return (dispatch, getState) => {
    const profile = getState().profile;
    let blocked = profile.blocked ? [...profile.blocked] : [];
    blocked.unshift(personID)
    dispatch({type: actionTypes.PEOPLE_ACTION_BLOCK, blocked})
    axios.post('/api/people/doAction', { listName: 'blocked', personID, profileId: profile._id  }).then(({data}) => {

    }).catch(err => {
      dispatch({
        type: actionTypes.PEOPLE_ACTION_ERROR,
        error: err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message
      })
      dispatch({type: actionTypes.PEOPLE_ACTION_UNDO_BLOCK, blocked: blocked.filter(item => item !== personID)})
    })
    
  }
}

//unblock profile
export const undoBlock = (personID) => {
  return (dispatch, getState) => {
    const profile = getState().profile;
    let blocked = profile.blocked ? [...profile.blocked] : [];
    dispatch({type: actionTypes.PEOPLE_ACTION_UNDO_BLOCK, blocked: blocked.filter(item => item !== personID)})
    axios.post('/api/people/undoAction', { listName: 'blocked', personID, profileId: profile._id  }).then(({data}) => {

    }).catch(err => {
      dispatch({
        type: actionTypes.PEOPLE_ACTION_ERROR,
        error: err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message
      })
      dispatch({type: actionTypes.PEOPLE_ACTION_BLOCK, blocked})
    })
  }
}

export const sendRequest = (toProfileId, requestType) => {
  return (dispatch, getState) => {
    const profile = getState().profile;
    const request = {
      from: profile._id,
      to: toProfileId,
      type: requestType === 'photo' ? 2 : 1,
      status: 1,
      requestTime: new Date(),
      lastUpdated: new Date()
    }
    dispatch({type: actionTypes.PEOPLE_SEND_REQUEST, request})
    axios.post('/api/request/send', { profileId: profile._id, to: toProfileId, type: requestType === 'photo' ? 2 : 1  }).then(({data}) => {

    }).catch(err => {
      dispatch({
        type: actionTypes.PEOPLE_ACTION_ERROR,
        error: err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message
      })
      dispatch({type: actionTypes.PEOPLE_CANCEL_REQUEST, request})
    })
  }
}

export const cancelRequest = (toProfileId, requestType) => {
  return (dispatch, getState) => {
    const profile = getState().profile;
    const request = {
      from: profile._id,
      to: toProfileId,
      type: requestType === 'photo' ? 2 : 1,
      status: 1,
      requestTime: new Date(),
      lastUpdated: new Date()
    }
    dispatch({type: actionTypes.PEOPLE_CANCEL_REQUEST, request})
    axios.post('/api/request/cancel', { profileId: profile._id, to: toProfileId, type: requestType === 'photo' ? 2 : 1  }).then(({data}) => {
    }).catch(err => {
      dispatch({
        type: actionTypes.PEOPLE_ACTION_ERROR,
        error: err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message
      })
      dispatch({type: actionTypes.PEOPLE_SEND_REQUEST, request})
    })
  }
}

export const acceptRequest = (fromProfileId, requestType) => {
  return (dispatch, getState) => {
    const profile = getState().profile;
    const request = {
      from: fromProfileId,
      to: profile._id,
      type: requestType === 'photo' ? 2 : 1
    }
    dispatch({type: actionTypes.PEOPLE_ACCEPT_REQUEST, request})
    axios.post('/api/request/accept', { profileId: profile._id, from: fromProfileId, type: requestType === 'photo' ? 2 : 1  }).then(({data}) => {
    }).catch(err => {
      dispatch({
        type: actionTypes.PEOPLE_ACTION_ERROR,
        error: err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message
      })
      dispatch({type: actionTypes.PEOPLE_REVERSE_REQUEST_STATUS, request})
    })
  }
}

export const declineRequest = (fromProfileId, requestType) => {
  return (dispatch, getState) => {
    const profile = getState().profile;
    const request = {
      from: fromProfileId,
      to: profile._id,
      type: requestType === 'photo' ? 2 : 1
    }
    dispatch({type: actionTypes.PEOPLE_DECLINE_REQUEST, request})
    axios.post('/api/request/decline', { profileId: profile._id, from: fromProfileId, type: requestType === 'photo' ? 2 : 1  }).then(({data}) => {
    }).catch(err => {
      dispatch({
        type: actionTypes.PEOPLE_ACTION_ERROR,
        error: err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message
      })
      dispatch({type: actionTypes.PEOPLE_REVERSE_REQUEST_STATUS, request})
    })
  }
}