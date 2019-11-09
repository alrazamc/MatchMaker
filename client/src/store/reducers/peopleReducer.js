import { actionTypes } from '../actions/PeopleActions';

const initState = {
  loading: false,
  error: null,
  success: null,
  profiles: [],
  pageNumber: 1,
  totalRecords: 0,
  perPage: 20,
  filters: null
}

const peopleReducer = (state = initState, action) => {
  switch(action.type)
  {
    case actionTypes.PEOPLE_FILTERS_CHANGED:
      return {
        ...initState,
        filters: action.filters
      }
    case actionTypes.PEOPLE_FILTERS_UPDATED:
      return {
        ...initState,
        filters: {...state.filters, [action.name]: action.value}
      }
    case actionTypes.PEOPLE_FILTERS_FIELD_UPDATED:
      return {
        ...state,
        filters: {...state.filters, [action.name]: action.value}
      }
    case actionTypes.PEOPLE_SORT_BY_CHANGED:
      return {
        ...initState,
        filters: {...state.filters, sortBy: action.sortBy}
      }
    case actionTypes.PEOPLE_PAGE_NUMBER_CHANGED:
      return {
        ...initState,
        filters: {...state.filters, pageNumber: action.pageNumber}
      }
    case actionTypes.PEOPLE_LOADING:
      return {
        ...state,
        loading: true
      }
    case actionTypes.PEOPLE_LOADING_SUCCESS:
      return {
        ...state,
        loading: false, error: null, success: null,
        profiles: action.payload.profiles,
        pageNumber: action.payload.pageNumber,
        totalRecords: action.payload.totalRecords,
        perPage: action.payload.perPage,
      }
    case actionTypes.PEOPLE_LOADING_ERROR:
        return {
          ...initState,
          filters: state.filters,
          error: action.error
        }
    case actionTypes.PEOPLE_ACTION_ERROR:
      return {
        ...state,
        error: action.error
      }
    default:
      return state;
  }
}

export default peopleReducer;