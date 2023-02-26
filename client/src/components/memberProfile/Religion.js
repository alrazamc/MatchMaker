import React from 'react';
import { makeStyles, Paper, Typography, Box } from '@material-ui/core';
import { systemSelector } from '../../store/selectors/systemSelector';
import { connect } from 'react-redux';

const useStyles = makeStyles(theme => ({
  root:{
    marginTop: theme.spacing(1),
    color: theme.palette.grey[600],
  },
  about: {
    color: theme.palette.grey[800]
  }
}));

const Religion = ({religionCaste, system}) => {
  const classes = useStyles();
  if(!religionCaste) return null;
  const religion = system.data.religions[religionCaste.religion] ? system.data.religions[religionCaste.religion].title : '';
  const community = system.data.communities[religionCaste.community] ? system.data.communities[religionCaste.community].title : '';
  const namaaz = system.data.namaaz[religionCaste.namaaz] ? system.data.namaaz[religionCaste.namaaz].title : '';
  const zakaat = system.data.yesNo[religionCaste.zakaat] ? system.data.yesNo[religionCaste.zakaat].title : '';
  const fasting = system.data.yesNo[religionCaste.fasting] ? system.data.yesNo[religionCaste.fasting].title : '';
  return (
    <Paper className={classes.root}>
      <Box py={1} px={2}>
        <Typography variant="h6" className={classes.about} gutterBottom>Religion</Typography>
        <Typography>
          {religion}
          {religion && community ? ', ' : null} {community}
        </Typography>
        { namaaz ? <Typography><b>Prayer:</b> {namaaz}</Typography> : null }
        { zakaat ? <Typography><b>Zakaat:</b> {zakaat}</Typography> : null }
        { fasting ? <Typography><b>Fasting In Ramzan:</b> {fasting}</Typography> : null }        
      </Box>
    </Paper>
  );
}

 
const mapStateToProps = state => {
  return {
    system: systemSelector(state, [], ['religions', 'communities', 'namaaz', 'yesNo']),
  }
}
export default connect(mapStateToProps)(Religion);
 
