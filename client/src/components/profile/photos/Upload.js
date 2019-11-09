import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Box, Button, makeStyles, Typography, LinearProgress, Icon } from '@material-ui/core';
import { PHOTO_SIZE_LIMIT, PHOTO_LIMIT } from '../../../config/appConfig';
import FormMessage from '../../library/FormMessage';
import { connect } from 'react-redux';
import { addPhotoToProfile } from '../../../store/actions/PhotoActions';
import axios from 'axios';
import Alert from '../../library/Alert';
import exif from 'exif-js';

const useStyles = makeStyles(theme => ({
  note:{
    textAlign: "center"
  },
  fileInput: {
    visibility: "hidden"
  }
}));

const readFile = file => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
};

const createImage = data => {
  return new Promise(resolve => {
    const img = document.createElement('img');
    img.onload = () => resolve(img);
    img.src = data;
  })
}

const dataURItoBlob = (dataURI, type) => {
  const binary = atob(dataURI.split(',')[1]);
  const array = [];
  for(let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {type});
}

const rotate = (type, img) => {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    exif.getData(img, function () {
      var orientation = exif.getAllTags(this).Orientation;
      if ([5, 6, 7, 8].indexOf(orientation) > -1) {
        canvas.width = img.height;
        canvas.height = img.width;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }
      const ctx = canvas.getContext("2d");

      switch (orientation) {
        case 2:
          ctx.transform(-1, 0, 0, 1, img.width, 0);
          break;
        case 3:
          ctx.transform(-1, 0, 0, -1, img.width, img.height);
          break;
        case 4:
          ctx.transform(1, 0, 0, -1, 0, img.height);
          break;
        case 5:
          ctx.transform(0, 1, 1, 0, 0, 0);
          break;
        case 6:
          ctx.transform(0, 1, -1, 0, img.height, 0);
          break;
        case 7:
          ctx.transform(0, -1, -1, 0, img.height, img.width);
          break;
        case 8:
          ctx.transform(0, -1, 1, 0, 0, img.width);
          break;
        default:
          ctx.transform(1, 0, 0, 1, 0, 0);
      }

      ctx.drawImage(img, 0, 0, img.width, img.height);
      let dataUrl = canvas.toDataURL(type);
      let blobData = dataURItoBlob(dataUrl, type);
      resolve(blobData);
    });
  })
}

const validateFiles = (FileList, totalUploaded) => {
  const validExtensions = ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'tiff'];
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
  const [files, setFiles] = useState([]);
  const [uploadBatch, setUploadBatch] = useState([]);
  const [uploaded, setUploaded] = useState(false);
  const [uploadStats, setUploadStats] = useState({
    currentlyUploading: 0,
    uploadProgress: 0
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    function uploadFile(fileIndex)
    {
      if(!uploadBatch[fileIndex]){
        setFiles([]);
        setUploadBatch([]);
        setUploaded(true);
        setError(null);
        return;
      };
      const uploadItem = uploadBatch[fileIndex];
      readFile(uploadItem.file)
      .then(createImage)
      .then(rotate.bind(undefined, uploadItem.file.type))
      .then(blob => {
        blob.name = uploadItem.file.name;
        
        axios.put(uploadItem.uploadUrl, blob, {
          headers: {
            'content-type': uploadItem.file.type
          },
          onUploadProgress: progressEvent => {
            const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
            var progress = (progressEvent.loaded / totalLength) * 100;
            setUploadStats({
              currentlyUploading: fileIndex + 1,
              uploadProgress: Math.round(progress)
            });
          }
        }).then(res => {
          addPhotoToProfile(uploadItem.fileName);
          uploadFile(fileIndex + 1);
        }).catch(err => {
          setFiles([]);
          setUploadBatch([]);
          setError(err.message);
        })


      })
    }
    if(uploadBatch.length === 0) return;
      uploadFile(0);
  }, [uploadBatch, addPhotoToProfile])

  useEffect(() => {
    if(files.length === 0) return;
    const fileNames = files.map(file => {
      const fileNameParts = file.name.split('.');
      fileNameParts[0] = Math.random().toString(36).substring(7);
      let fileName = fileNameParts.join('.');
      fileName = fileName.toLowerCase();
      return {
        fileName,
        type: file.type
      }
    });
    axios.post('/api/profile/photos/upload', {files: fileNames}).then(({ data }) => {
      const newUploadBatch = data.map((item, index) => ({
        uploadUrl: item.putUrl,
        file: files[index],
        fileName: item.fileName
      }));
      setUploadBatch(newUploadBatch);
    }).catch(err => {
      setFiles([]);
      setUploadBatch([]);
      setError(err.response && err.response.data ? err.response.data.message : err.message);
    });
  }, [files])

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
        <Box flexGrow={1} mt={2}>
          {
            uploaded &&  
            <FormMessage success={true}>
              <Box display="flex" justifyContent="center" mb={1}>
                <Icon>done</Icon> Photos uploaded successfully
              </Box>
            </FormMessage>
          }
          {
            error ?  <Alert variant="error" message={error} vertical="top" horizontal="center" /> : null
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
                Note: You can upload { PHOTO_LIMIT - totalProfileImages } {totalProfileImages > 0 ? 'more' : null} photos to your profile. <br />Each photos must be less than 15 MB and in jpg, gif, png, or bmp format.
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
    uid: state.auth.uid,
    totalProfileImages: state.profile && 
                    state.profile.photos && 
                    state.profile.photos.images ? state.profile.photos.images.length : 0,
  }
}

 
export default connect(mapStateToProps, { addPhotoToProfile })(Upload);