import React from 'react';
import { Box, Paper, makeStyles, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import PhotoRequestActions from './PhotoRequestActions';
import ConnectRequestActions from './ConnectRequestActions';

const useStyles = makeStyles(theme => ({
  root:{
    padding: 10,
    borderRadius: 0,
    borderLeftStyle: "solid",
    borderLeftColor: theme.palette.primary.main,
    borderLeftWidth: 5
  }
}))

const formatDate = (date) => {
  return dayjs(date).format('DD MMM, YYYY')
}

const RequestDescription = (props) => {
  const classes = useStyles();
  const { connectSent, connectReceived, photoSent, photoReceived, gender } = props;
  if(!connectSent && !connectReceived && !photoSent && !photoReceived) return null;
  const himHer = gender === 1 ? 'him' : 'her';
  const hisHer = gender === 1 ? 'his' : 'her';
  const heShe = gender === 1 ? 'He' : 'She';
  return (
    <Box width="100%">
      <Paper className={classes.root} elevation={4}>
        { !connectSent && !connectReceived ? null :
          <Typography color="primary" gutterBottom>
            { connectSent && connectSent.status === 1 ? `You sent ${himHer} connect request on ${formatDate(connectSent.requestTime)}` : null }
            { connectSent && connectSent.status === 2 ? `${heShe} accepted your connect request on ${formatDate(connectSent.lastUpdated)}` : null }
            { connectSent && connectSent.status === 3 ? `${heShe} declined your connect request on ${formatDate(connectSent.lastUpdated)}` : null }
            
            { connectReceived && connectReceived.status === 1 ? `${heShe} sent you a connect request on ${formatDate(connectReceived.requestTime)}` : null }
            { connectReceived && connectReceived.status === 2 ? `You accepted ${hisHer} connect request on ${formatDate(connectReceived.lastUpdated)}` : null }
            { connectReceived && connectReceived.status === 3 ? `You declined ${hisHer} connect request on ${formatDate(connectReceived.lastUpdated)}` : null }

          </Typography>
        }
        { !connectReceived ? null : <ConnectRequestActions profileId={props.profileId} /> }
        { !photoSent && !photoReceived ? null :
          <Typography color="primary" gutterBottom>            
            { photoSent && photoSent.status === 1 ? `You requested ${hisHer} photo on ${formatDate(photoSent.requestTime)}` : null }
            { photoSent && photoSent.status === 2 ? `${heShe} accepted your photo request on ${formatDate(photoSent.lastUpdated)}` : null }
            { photoSent && photoSent.status === 3 ? `${heShe} declined your photo request on ${formatDate(photoSent.lastUpdated)}` : null }

            { photoReceived && photoReceived.status === 1 ? `${heShe} asked for your photo on ${formatDate(photoReceived.requestTime)}` : null }
            { photoReceived && photoReceived.status === 2 ? `You accepted ${hisHer} photo request on ${formatDate(photoReceived.lastUpdated)}` : null }
            { photoReceived && photoReceived.status === 3 ? `You declined ${hisHer} photo request on ${formatDate(photoReceived.lastUpdated)}` : null }
          </Typography>
        }
        { !photoReceived ? null : <PhotoRequestActions profileId={props.profileId} /> }
      </Paper>
    </Box>
  );
}
 
const mapStateToProps = (state, props) => {
   const requests = state.profile.requests ? state.profile.requests : [];
  return {
    connectSent: requests.find(req => req.from === state.profile._id && req.to === props.profileId && req.type === 1 && req.status > 0),
    connectReceived: requests.find(req => req.to === state.profile._id && req.from === props.profileId && req.type === 1 && req.status > 0),
    photoSent: requests.find(req => req.from === state.profile._id && req.to === props.profileId && req.type === 2 && req.status > 0),
    photoReceived: requests.find(req => req.to === state.profile._id && req.from === props.profileId && req.type === 2 && req.status > 0)
  }
}
export default connect(mapStateToProps)(RequestDescription);