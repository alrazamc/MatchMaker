const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export const logOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    getFirebase().auth().signOut().then(() => {
      dispatch({type: LOGOUT_SUCCESS});
    })
  }
}
