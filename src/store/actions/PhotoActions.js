export const PHOTO_NEW_ADDED = 'PHOTO_NEW_ADDED';
export const PHOTO_REMOVED = 'PHOTO_REMOVED';
export const PHOTO_PROFILE_PIC_CHANGED = 'PHOTO_PROFILE_PIC_CHANGED';

export const addPhotoToProfile = (file_name, imgUrl, uid) => {
  return (dispatch, getState, { getFirestore }) => {
    const photos = {
      images: getFirestore().FieldValue.arrayUnion({
        file_name,
        imgUrl,
        approved: true
      })
    }
    getFirestore().collection('users').doc(uid).set({photos}, {merge:true}).then(res => {
      dispatch({type: PHOTO_NEW_ADDED});
    });
  }
}

export const removePhotoFromProfile = (imgIndex, ) => {
  return (dispatch, getState, { getFirestore }) => {
    const photos = {
      images: getFirestore().FieldValue.arrayRemove(
        getState().firebase.profile.photos.images[imgIndex]
      )
    }
    getFirestore().collection('users').doc( getState().firebase.auth.uid ).set({photos}, {merge:true}).then(res => {
      dispatch({type: PHOTO_REMOVED});
    });
  }
}

export const changeProfilePicture = (imgIndex, ) => {
  return (dispatch, getState, { getFirestore }) => {
    const photos = {
      profilePictureIndex: imgIndex
    }
    getFirestore().collection('users').doc( getState().firebase.auth.uid ).set({photos}, {merge:true}).then(res => {
      dispatch({type: PHOTO_PROFILE_PIC_CHANGED});
    });
  }
}