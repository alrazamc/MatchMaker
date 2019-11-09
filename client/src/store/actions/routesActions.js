export const actionTypes = {
  ROUTES_UPDATED: 'routesUpdated'
}

export const changeRoutes = routes => {
  return{
    type: actionTypes.ROUTES_UPDATED,
    routes
  }
}