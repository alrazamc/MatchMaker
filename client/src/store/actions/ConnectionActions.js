import axios from 'axios';
import { profileSelector } from '../selectors/profileSelectors';

export const actionTypes = {
  CONNECTION_LOAD_PROFILE: 'connectionLoadProfile', //load connection profile from server
  CONNECTION_FIND_PROFILE: 'connectionFindProfile',
  CONNECTION_ADD_PROFILE: 'connectionAddProfile',
  CONNECTION_REMOVE_PROFILE: 'connectionRemoveProfile',
  CONNECTION_LOAD_ALL: 'connectionLoadAll'
}

export const loadConnectionProfile = (profileId) => {
  return (dispatch, getState) => {
    const state = getState();
    const profile = profileSelector(state, profileId);
    if(profile)
    {
      dispatch({type: actionTypes.CONNECTION_FIND_PROFILE, profile});
      return;
    }
    axios.get('/api/people/profile', {params: {profileId: state.profile._id, memberProfileId: profileId}}).then(({data}) => {
      if(data._id)
       dispatch({type: actionTypes.CONNECTION_LOAD_PROFILE, profile: data});
    }).catch(err => {})
  }
}

export const loadAllConnections = () => {
  return (dispatch, getState) => {
    const state = getState();
    const myProfileId = state.profile._id;
    let filters = {
      from: myProfileId,
      to: myProfileId,
      type: 1,
      status: 2,
      showAll: true
    }
    axios.post('/api/request/list', { ...filters }).then(({data}) => {
      if(data.profiles)
       dispatch({type: actionTypes.CONNECTION_LOAD_ALL, profiles: data.profiles});
    }).catch(err => {})
  }
}
