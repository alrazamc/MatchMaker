import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Box, GridList, GridListTile, GridListTileBar, IconButton, makeStyles, Tooltip, CircularProgress } from '@material-ui/core';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import DeleteIcon from '@material-ui/icons/Delete';
import ProfileIcon from '@material-ui/icons/Person'
import { removePhotoFromProfile, changeProfilePicture } from '../../../store/actions/PhotoActions';

const useStyles = makeStyles(theme => ({
  titleBar: {
    background: 'transparent',
  },
  deletePreloader: {
    marginRight: theme.spacing(1)
  },
  tile: {
    position: 'relative'
  },
  tileImg: {
    top: "50%",
    width: "100%",
    position: "relative",
    transform: "translateY(-50%)"
  },
  profileButton: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    color: 'white'
  },
  profilePicPreloader: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    color: 'white'
  },
  profilePicBar: {
    textAlign: "center"
  }
}));

const PhotoGrid = ({ photos, uid, width, removePhotoFromProfile, changeProfilePicture }) => {
  const classes = useStyles();
  //const firebase = useFirebase();
  const [images, setImages] = useState([]);
  useEffect(() => {
    if(photos.images)
      setImages([...photos.images]);
  }, [photos.images])

  const getGridListCols = () => {
    if (isWidthUp('sm', width))
      return 4;
    return 2;
  }

  const changeDeletePreloader = (imgIndex, status) => {
    const newImages = images.map((item, index) => {
      if(imgIndex !== index) return item;
      return { ...item, deletePreloader: status };
    })
    setImages(newImages);
  }

  const changeProfilePicPreloader = (imgIndex, status) => {
    const newImages = images.map((item, index) => {
      if(imgIndex !== index) return item;
      return { ...item, profilePicPreloader: status };
    })
    setImages(newImages);
  }

  const deleteImage = (index) => {
    changeDeletePreloader(index, true);
    removePhotoFromProfile(images[index].fileName, index);
  }

  const setProfilePicture = (index) => {
    changeProfilePicPreloader(index, true);
    changeProfilePicture(index);
  }

  return (
    <Box my={1} width="100%">
      <GridList cellHeight={160} cols={getGridListCols()}>
        {
          images.map((img, index) => (
            <GridListTile key={uid+index} cols={1} className={classes.tile}>
              <img src={img.thumbUrl ? img.thumbUrl : img.imageUrl} alt={uid}  />
              <GridListTileBar
                title=""
                actionIcon={
                    img.deletePreloader ? 
                    <CircularProgress className={classes.deletePreloader} color="primary" size={20} />
                    :
                    <Tooltip title="Delete Photo" placement="left">
                      <IconButton aria-label="Delete Photo" color="primary" onClick={() => deleteImage(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>                  
                }
                titlePosition="top"
                actionPosition="right"
                className={classes.titleBar}
              />
              {
                photos.profilePictureIndex !== index ? 
                ( img.profilePicPreloader ? 
                <CircularProgress className={classes.profilePicPreloader} size={20} />
                :
                <Tooltip title="Set as Profile Pic" placement="left">
                  <IconButton aria-label="Delete Photo" color="primary" onClick={() => setProfilePicture(index)} className={classes.profileButton}>
                    <ProfileIcon />
                  </IconButton>
                </Tooltip> )
                :
                null
              }

              {
                photos.profilePictureIndex === index ? 
                <GridListTileBar title="Profile Picture" className={classes.profilePicBar} /> : null
              }
            </GridListTile>
          ))
        }
      </GridList>
    </Box>
  );
}
 
const mapStateToProps = (state) => {
  return {
    uid: state.auth ? state.auth.uid : null,
    photos: state.profile && state.profile.photos ? state.profile.photos : {} 
  }
}

export default compose(
  connect(mapStateToProps, { removePhotoFromProfile, changeProfilePicture }),
  withWidth()
  )(PhotoGrid);