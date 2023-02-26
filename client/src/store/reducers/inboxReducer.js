import { actionTypes } from '../actions/InboxActions';

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

const inboxReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.INBOX_FILTERS_CHANGED:
      return {
        ...initState,
        loading: true,
        filters: action.filters
      }
    case actionTypes.INBOX_FILTERS_UPDATED:
      return {
        ...initState,
        filters: { ...state.filters, [action.name]: action.value }
      }
    case actionTypes.INBOX_PAGE_NUMBER_CHANGED:
      return {
        ...initState,
        filters: { ...state.filters, pageNumber: action.pageNumber }
      }
    case actionTypes.INBOX_LOADING:
      return {
        ...state,
        loading: true
      }
    case actionTypes.INBOX_LOADING_SUCCESS:
      return {
        ...state,
        loading: false, error: null, success: null,
        profiles: action.payload.profiles,
        pageNumber: action.payload.pageNumber,
        totalRecords: action.payload.totalRecords,
        perPage: action.payload.perPage,
      }
    case actionTypes.INBOX_LOADING_ERROR:
      return {
        ...initState,
        filters: state.filters,
        error: action.error
      }
    default:
      return state;
  }
}

export default inboxReducer;