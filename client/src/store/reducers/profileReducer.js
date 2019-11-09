import { actionTypes } from '../actions/ProfileActions';
import { actionTypes as photoActions } from '../actions/PhotoActions';
import { actionTypes as authActions } from '../actions/AuthActions';
import { actionTypes as peopleActions } from '../actions/PeopleActions';

const profileReducer = (state = {}, action) => {
  let requests = null;
  switch(action.type)
  {
    case actionTypes.PROFILE_LOADED:
      return action.profile
    case actionTypes.PROFILE_BASIC_INFO_UPDATED:
      return { ...state, basicInfo: action.data}
    case actionTypes.PROFILE_RELIGION_CASTE_UPDATED:
      return { ...state, religionCaste: action.data}
    case actionTypes.PROFILE_FAMILY_INFO_UPDATED:
      return { ...state, family: action.data}
    case actionTypes.PROFILE_EDUCATION_CAREER_UPDATED:
      return { ...state, educationCareer: action.data}
    case actionTypes.PROFILE_LIFESTYLE_UPDATED:
      return { ...state, lifestyle: action.data}
    case actionTypes.PROFILE_LOCATION_UPDATED:
      return { ...state, location: action.data}
    case actionTypes.PROFILE_DESCRIPTION_UPDATED:
      return { ...state, profileDescription: action.data}
    case actionTypes.PROFILE_PARTNER_PREFERENCE_UPDATED:
      return { ...state, partnerPreference: action.data}
    case actionTypes.PROFILE_LAST_ACTIVE_UPDATED:
      return { ...state, lastActive: action.time}
    case photoActions.PHOTOS_VISIBILITY_UPDATED:
        return {
          ...state,
          photos: {
            ...state.photos,
            visibility: action.data
          }
        }
    case photoActions.PHOTO_PROFILE_PIC_CHANGED:
        return {
          ...state,
          photos: {
            ...state.photos,
            images: [...state.photos.images],
            profilePictureIndex: action.imgIndex
          }
        }
    case photoActions.PHOTO_NEW_ADDED:
      return {
        ...state,
        photos: {
          ...state.photos,
          images: [...((state.photos && state.photos.images) || [] ), action.image]
        }
      }
    case photoActions.PHOTO_REMOVED:
      return {
        ...state,
        photos: {
          ...state.photos,
          images: state.photos.images.filter(item => item.fileName !== action.fileName)
        }
      }
    case authActions.LOGOUT_SUCCESS:
      return {}
    case peopleActions.PEOPLE_ACTION_SHORTLIST:
    case peopleActions.PEOPLE_ACTION_UNDO_SHORTLIST:
      return{
        ...state,
        shortlisted: action.shortlisted
      }
    case peopleActions.PEOPLE_ACTION_DONT_SHOW:
    case peopleActions.PEOPLE_ACTION_UNDO_DONT_SHOW:
      return{
        ...state,
        filtered: action.filtered
      }
    case peopleActions.PEOPLE_ACTION_BLOCK:
    case peopleActions.PEOPLE_ACTION_UNDO_BLOCK:
      return{
        ...state,
        blocked: action.blocked
      }
    case peopleActions.PEOPLE_SEND_REQUEST:
      requests = state.requests ? [...state.requests] : []
      requests.push(action.request);
      return { ...state, requests}
    case peopleActions.PEOPLE_CANCEL_REQUEST:
      return { ...state, requests: state.requests.filter(item => 
        !(action.request.from === item.from 
        && action.request.to === item.to 
        && action.request.type === item.type
        && action.request.status === item.status)
        )}
    case peopleActions.PEOPLE_ACCEPT_REQUEST:
      requests = state.requests ? [...state.requests] : [];
      let targetRequestIndex = requests.findIndex(item => item.from === action.request.from && item.type === action.request.type);
      console.log(targetRequestIndex);
      requests[targetRequestIndex] = { ...requests[targetRequestIndex] }
      requests[targetRequestIndex].oldStatus = requests[targetRequestIndex].status;//keep in case of error
      requests[targetRequestIndex].status = 2
      return { ...state, requests}
    case peopleActions.PEOPLE_DECLINE_REQUEST:
      requests = state.requests ? [...state.requests] : [];
      let requestIndex = requests.findIndex(item => item.from === action.request.from && item.type === action.request.type);
      requests[requestIndex] = { ...requests[requestIndex] }
      requests[requestIndex].oldStatus = requests[requestIndex].status;//keep in case of error
      requests[requestIndex].status = 3
      return { ...state, requests}
    case peopleActions.PEOPLE_REVERSE_REQUEST_STATUS:
      requests = state.requests ? [...state.requests] : [];
      let index = requests.findIndex(item => item.from === action.request.from && item.type === action.request.type);
      requests[index] = { ...requests[index] }
      requests[index].status = requests[index].oldStatus;
      return { ...state, requests}
    case actionTypes.PROFILE_ADD_NEW_SEARCH:
      let searches = state.searches ? [...state.searches] : [];
      searches.push(action.search)
      return { ...state, searches}
    case actionTypes.PROFILE_UPDATE_SEARCH:
      let  profileSearches = state.searches ? [...state.searches] : [];
      profileSearches = profileSearches.map(item => item._id === action.search._id ? action.search : item)
      return { ...state, searches:profileSearches}
    case actionTypes.PROFILE_DELETE_SEARCH:
      return { ...state, searches:state.searches.filter(item => item._id !== action.searchId)}
    default:
      return state;
  }
}

export default profileReducer;