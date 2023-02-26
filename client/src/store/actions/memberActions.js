import axios from 'axios';

export const actionTypes = {
  MEMBER_LOADING: 'memberLoading',
  MEMBER_LOADING_SUCCESS: 'memberLoadingSuccess',
  MEMBER_LOADING_ERROR: 'memberLoadingError'
}


export const loadMemberProfile = (profileId) => {
  return async (dispatch, getState) => {
    const state = getState();
    let profile = null;
    if(state.people.profiles.length) //coming from matches, shortlisted, basic/advanced search
      profile = state.people.profiles.find(item => item._id === profileId);
    if(!profile && state.inbox.profiles.length)//coming from inbox
      profile = state.inbox.profiles.find(item => item._id === profileId);
    dispatch({ type: actionTypes.MEMBER_LOADING, profile });
    try {
      const { data } = await axios.get('/api/people/profile', { params : {profileId: state.profile._id, memberProfileId: profileId} });
      if(data._id)
        dispatch({
          type: actionTypes.MEMBER_LOADING_SUCCESS,
          profile: data
        })
    } catch (err) {
      dispatch({
        type: actionTypes.MEMBER_LOADING_ERROR,
        error: err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message
      })
    }
  }
}