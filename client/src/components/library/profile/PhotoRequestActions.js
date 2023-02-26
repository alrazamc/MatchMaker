import React, { useRef, useState } from 'react';
import { Box, makeStyles, Button, Typography, LinearProgress } from '@material-ui/core';
import { connect } from 'react-redux';
import { declineRequest, acceptRequest } from '../../../store/actions/PeopleActions';
import axios from 'axios';
import Alert from '../Alert';
import { readFile, createImage, rotate } from '../../../utils/photo';
import FbAnalytics from '../../../config/FbAnalytics';

const useStyles = makeStyles(theme => ({
  btn:{
    marginLeft: 4
  },
  fileInput: {
    visibility:"hidden",
    width: 0
  }
}))

const PhotoRequestActions = (props) => {
  const classes = useStyles();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInput = useRef();
  const { photoReceived, declineRequest, acceptRequest } = props;
  if(!photoReceived) return null;
  const status = photoReceived.status;
  const handleFile = async () => {
    if(fileInput.current.files.length === 0) return;
    const file = fileInput.current.files[0];
    const validExtensions = ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'tiff'];
    const ext = file.name.split('.').pop();
    if(!validExtensions.includes( ext.toLowerCase() ))
      return;
    let fileName = photoReceived.from + '.' + ext;
    setUploading(true);
    try{
      const { data: { 0:img } }  = await axios.post('/api/profile/photos/upload', {profileId: props.myProfileId, files:[{fileName, type: file.type}]})
      const fileData = await readFile(file);
      const imageFile = await createImage(fileData);
      const blob = await rotate(file.type, imageFile);
      blob.name = fileName;
      await axios.put(img.putUrl, blob, {
          headers: {
            'content-type': file.type
          },
          onUploadProgress: progressEvent => {
            const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
            var progress = (progressEvent.loaded / totalLength) * 100;
            setUploadProgress(Math.round(progress));
          }
        });
      setUploading(false);
      FbAnalytics.logEvent('photo_request_accepted');
      acceptRequest(photoReceived.from, 'photo', fileName);
    }catch(err)
    {
      setError(err.response && err.response.data ? err.response.data.message : err.message);
    }
  }
  return (
    <Box width="100%">
      { uploading ? null :
        <>
        { error ?  <Alert variant="error" message={error} vertical="top" horizontal="center" /> : null }
        { status === 1 ? null : <Typography color="textSecondary" component="span">Changed your mind ? </Typography> }
        { status === 1 || status === 3 ? //pending or declined
          <>
          <Button variant="outlined" className={classes.btn} color="primary" onClick={() => fileInput.current.click()}>Send Photo</Button>
          <input type="file" onChange={handleFile} accept="image/*" className={classes.fileInput} ref={fileInput}  />
          </>
          : null
        }
        {
          status === 1 || status === 2 ? //pending or approved
            <Button variant="outlined" className={classes.btn} color="secondary" onClick={() => { FbAnalytics.logEvent('photo_request_declined'); declineRequest(photoReceived.from, 'photo') }}>Decline Request { status === 2 ? '& Delete Photo' : null}</Button>
          : null
        }
        </>
      }
      {
        !uploading ? null :
        <>
          <Typography color="textSecondary" gutterBottom>Sending Photo</Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </>
      }
    </Box>
  );
}
 
const mapStateToProps = (state, props) => {
   const requests = state.profile.requests ? state.profile.requests : [];
  return {
    myProfileId: state.profile._id ? state.profile._id : null,
    photoReceived: requests.find(req => req.to === state.profile._id && req.from === props.profileId && req.type === 2 && req.status > 0)
  }
}
export default connect(mapStateToProps, {declineRequest, acceptRequest})(PhotoRequestActions);