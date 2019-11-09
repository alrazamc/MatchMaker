import { actionTypes } from '../actions/routesActions';

const initRoutes = []
const routesReducer = (state = initRoutes, action = {}) => {
  switch(action.type){
    case actionTypes.ROUTES_UPDATED:
      return action.routes;
    default:
      return state;
  }
}

export default routesReducer;