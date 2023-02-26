import axios from 'axios';
import { actionTypes as profileActions  } from './ProfileActions';

export const actionTypes = {
  INBOX_LOADING: 'inboxLoading',
  INBOX_LOADING_SUCCESS: 'inboxLoadingSuccess',
  INBOX_LOADING_ERROR: 'inboxLoadingError',
  INBOX_FILTERS_CHANGED: 'inboxFiltersChanged',
  INBOX_FILTERS_UPDATED: 'inboxFiltersUpdated',
  INBOX_PAGE_NUMBER_CHANGED: 'inboxPageNumberChanged'
}


export const loadRequests = async (dispatch, getState) => {
  dispatch({ type: actionTypes.INBOX_LOADING });
  try {
    const { data } = await axios.post('/api/request/list', {  ...getState().inbox.filters });
    if(data.requests.length)
      dispatch({
        type: profileActions.PROFILE_UPDATE_REQUESTS,
        requests: data.requests
      })
    dispatch({
      type: actionTypes.INBOX_LOADING_SUCCESS,
      payload: data
    })
  } catch (err) {
    dispatch({
      type: actionTypes.INBOX_LOADING_ERROR,
      error: err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message
    })
  }
}

//replace filter
export const changeFilters = (filters) => {
  return async (dispatch, getState) => {
    dispatch({
      type: actionTypes.INBOX_FILTERS_CHANGED,
      filters
    });
    await loadRequests(dispatch, getState);
  }
}

//change any specific thing in filter
export const updateFilters = (name, value) => {
  return async (dispatch, getState) => {
    //await - let the effects runs first in sidebar filters to update community, state, city
    await dispatch({
      type: actionTypes.INBOX_FILTERS_UPDATED,
      name,
      value
    });
    await loadRequests(dispatch, getState);
  }
}


export const updatePageNumber = (pageNumber) => {
  return async (dispatch, getState) => {
    dispatch({
      type: actionTypes.INBOX_PAGE_NUMBER_CHANGED,
      pageNumber
    });
    await loadRequests(dispatch, getState);
  }
}