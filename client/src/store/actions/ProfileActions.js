import axios from 'axios';
import { updateFilterField } from './PeopleActions';

export const actionTypes = {
  PROFILE_LOADED: 'profileLoaded',
  PROFILE_BASIC_INFO_UPDATED: 'profileBasicInfoUpdated',
  PROFILE_LIFESTYLE_UPDATED: 'profileLifestyleUpdated',
  PROFILE_RELIGION_CASTE_UPDATED: 'profileReligionCasteUpdated',
  PROFILE_FAMILY_INFO_UPDATED: 'profileFamilyInfoUpdated',
  PROFILE_DESCRIPTION_UPDATED: 'profileDescriptionUpdated',
  PROFILE_EDUCATION_CAREER_UPDATED: 'profileEducationCareerUpdated',
  PROFILE_LOCATION_UPDATED: 'profileLocationUpdated',
  PROFILE_PARTNER_PREFERENCE_UPDATED: 'profilePartnerPreferenceUpdated',
  PROFILE_LAST_ACTIVE_UPDATED: 'profileLastActiveUpdated',

  PROFILE_ADD_NEW_SEARCH: 'profileAddNewSearch',
  PROFILE_UPDATE_SEARCH: 'profileUpdateSearch',
  PROFILE_DELETE_SEARCH: 'profileDeleteSearch'
}


export const updateLastActive = () => {
  return (dispatch, getState) => {
    axios.post('/api/profile/active', { profileId: getState().profile._id }).then(({ data }) => {
      if(data.success)
        dispatch({type: actionTypes.PROFILE_LAST_ACTIVE_UPDATED, time: data.time });
    });
  }
}

export const addSearch = (formData) => {
  return (dispatch, getState) => {
    axios.post('/api/profile/addSearch', { profileId: getState().profile._id, values: formData }).then(({ data }) => {
      if(data.id)
      {
        dispatch({type: actionTypes.PROFILE_ADD_NEW_SEARCH, search: { _id:data.id, ...formData} });
        dispatch(updateFilterField('_id', data.id));
      }
    });
  }
}

export const updateSearch = (formData) => {
  return (dispatch, getState) => {
    axios.post('/api/profile/updateSearch', { profileId: getState().profile._id, values: formData }).then(({ data }) => {
        dispatch({type: actionTypes.PROFILE_UPDATE_SEARCH, search: formData });
    });
  }
}

export const deleteSearch = (searchId) => {
  return (dispatch, getState) => {
    axios.post('/api/profile/deleteSearch', { profileId: getState().profile._id, searchId }).then(({ data }) => {
        dispatch({type: actionTypes.PROFILE_DELETE_SEARCH, searchId });
    });
  }
}

