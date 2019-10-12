import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Box, Button, makeStyles, Typography, LinearProgress, Icon } from '@material-ui/core';
import { useFirebase } from 'react-redux-firebase'
import { PHOTO_SIZE_LIMIT, PHOTO_LIMIT } from '../../../config/appConfig';
import FormMessage from '../../library/FormMessage';
import { connect } from 'react-redux';
import { addPhotoToProfile } from '../../../store/actions/PhotoActions';

const useStyles = makeStyles(theme => ({
  note:{
    textAlign: "center"
  },
  fileInput: {
    visibility: "hidden"
  }
}));

const validateFiles = (FileList, totalUploaded) => {
  const validExtensions = ['jpg', 'gif', 'png', 'bmp', 'tiff'];
  const files = [];
  const remainingPhotos = PHOTO_LIMIT - totalUploaded;
  for(let i = 0; i < FileList.length; i++)
  {
    if(FileList[i].size > PHOTO_SIZE_LIMIT * 1024 * 1024) //mb to bytes
      continue;
    const ext = FileList[i].name.split('.')[1];
    if(!validExtensions.includes( ext.toLowerCase() ))
      continue;
    files.push(FileList[i]);
    if(files.length >= remainingPhotos)
      break;
  }
  return files;
}

const Upload = ({ uid, addPhotoToProfile, totalProfileImages }) => {
  const classes = useStyles();
  const fileInput = useRef();
  const firebase = useFirebase();
  const [files, setFiles] = useState([]);
  const [uploaded, setUploaded] = useState(false);
  const [uploadStats, setUploadStats] = useState({
    currentlyUploading: 0,
    uploadProgress: 0
  });
  useEffect(() => {
    console.log('updating');
    function uploadFile(fileIndex)
    {
      if(!files[fileIndex]){
        setFiles([]);
        setUploaded(true);
        return;
      };
      const file = files[fileIndex];
      const file_name_parts = file.name.split('.');
      file_name_parts[0] = Math.random().toString(36).substring(7);
      const file_name = file_name_parts.join('.');
      const storageRef = firebase.storage().ref();
      const imgRef = storageRef.child(`images/${uid}/${file_name}`);
      const uploadTask = imgRef.put(file);
    
      uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`file: ${fileIndex+1}, progress: ${Math.round(progress)}`);
        setUploadStats({
          currentlyUploading: fileIndex + 1,
          uploadProgress: Math.round(progress)
        });
      }, function(error) {
        uploadFile(fileIndex + 1);
      }, function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          addPhotoToProfile(file_name, downloadURL, uid);
        });
        uploadFile(fileIndex + 1);
      });
    }
    if(files.length === 0) return;
      uploadFile(0);
  }, [files, addPhotoToProfile, firebase, uid])

  const handleFiles = useCallback(() => {
    const selectedFiles = validateFiles(fileInput.current.files, totalProfileImages);
    if(selectedFiles.length)
    {
      setFiles(selectedFiles);
      setUploaded(false);
    }
  }, [totalProfileImages]);


  return (
    <Box my={1} textAlign="center" height={150} display="flex" alignItems="center">
      {
        files.length === 0 && 
        <Box flexGrow={1}>
          {
            uploaded && 
            <FormMessage success={true}>
              <Box display="flex" justifyContent="center" mb={1}>
                <Icon>done</Icon> Photos uploaded successfully
              </Box>
            </FormMessage>
          }
          {
            PHOTO_LIMIT - totalProfileImages <= 0 ? 
            <Typography variant="body1" className={classes.note}  >
              You can add maximum { PHOTO_LIMIT} photos. Please delete some photos to add more
            </Typography>
            :
            <Box>
              <Button variant="outlined" color="primary" onClick={() => fileInput.current.click()}>
                Select Photos
              </Button>
              <Typography variant="body1" className={classes.note} color="textSecondary" >
                Note: You can upload { PHOTO_LIMIT - totalProfileImages } {totalProfileImages > 0 ? 'more' : null} photos to your profile. <br />Each photos must be less than 15 MB and in jpg, gif, png, bmp or tiff format.
              </Typography>
              <input type="file" onChange={handleFiles} multiple  className={classes.fileInput} ref={fileInput} />
            </Box>
          }
        </Box>
      }
      {
        files.length > 0 && 
        <Box flexGrow={1} textAlign="center">
          <Box width="75%" mx="auto" mb={1}>
            <LinearProgress variant="determinate" value={uploadStats.uploadProgress} />
          </Box>
          <Typography color="textSecondary">
            Uploading {uploadStats.currentlyUploading} of {files.length} photos
          </Typography>
        </Box>
      }
      
    </Box>
  );
}

const mapStateToProps = state => {
  return {
    uid: state.firebase.auth.uid,
    totalProfileImages: state.firebase.profile && 
                    state.firebase.profile.photos && 
                    state.firebase.profile.photos.images ? state.firebase.profile.photos.images.length : 0,
  }
}

 
export default connect(mapStateToProps, { addPhotoToProfile })(Upload);