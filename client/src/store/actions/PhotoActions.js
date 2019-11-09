import axios from "axios"

export const actionTypes = {
  PHOTOS_VISIBILITY_UPDATED: 'photosVisiBilityUpdated',
  PHOTO_NEW_ADDED: 'newPhotoAdded',
  PHOTO_REMOVED: 'photoRemoved',
  PHOTO_PROFILE_PIC_CHANGED:  'photoProfilePictureChanged'
}

export const addPhotoToProfile = (fileName) => {
  return (dispatch, getState) => {
    axios.post('/api/profile/photos/add', { fileName }).then(({ data }) => {
      if(data.success)
        dispatch({type: actionTypes.PHOTO_NEW_ADDED, image: data.image });
    });
  }
}

export const removePhotoFromProfile = (fileName, imgIndex) => {
  return (dispatch, getState) => {
    axios.post('/api/profile/photos/remove', { fileName }).then(({ data }) => {
      if(data.success)
      {
        dispatch({type: actionTypes.PHOTO_REMOVED, fileName });
        const profilePictureIndex = getState().profile.photos.profilePictureIndex;
        if(typeof profilePictureIndex !== 'undefined')
        {
          if(imgIndex === profilePictureIndex)
          dispatch(changeProfilePicture(0));
          else if(imgIndex < profilePictureIndex)
          dispatch(changeProfilePicture( profilePictureIndex - 1 ));
        } 
      }
        
    });
  }
}

export const changeProfilePicture = (imgIndex) => {
  return (dispatch, getState) => {
    const data = {
      profileId: getState().profile._id,
      payload: {
        "photos.profilePictureIndex": imgIndex
      }
    }
    axios.post('/api/profile', data).then(({ data }) => {
      if(data.success)
        dispatch({type: actionTypes.PHOTO_PROFILE_PIC_CHANGED, imgIndex });
    });
  }
}