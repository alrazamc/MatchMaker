import React, { useState, useRef, useEffect } from 'react';
import { makeStyles, Paper, Typography, Box, Collapse, Button } from '@material-ui/core';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { systemSelector } from '../../store/selectors/systemSelector';
import { connect } from 'react-redux';

const useStyles = makeStyles(theme => ({
  root:{
    marginTop: theme.spacing(1),
    color: theme.palette.grey[600],
    whiteSpace: 'pre-line'
  },
  about: {
    color: theme.palette.grey[800]
  }
}));

const ProfileDescription = ({profile, system}) => {
  const classes = useStyles();
  const [showMore, setShowMore] = useState(false);
  const description = useRef();
  useEffect(() => {
    if(!description.current) return;
    if(description.current.offsetHeight <= 148)
      setShowMore(true);
  }, [])
  const { basicInfo, profileDescription } = profile;
  let name = profile._id.substring(0, 6);
  if(basicInfo && basicInfo.firstName)
    name = basicInfo.firstName + ' ' + basicInfo.lastName;
  const profileCreatedBy = basicInfo && system.data.profileCreatedBy[basicInfo.profileCreatedBy] ? system.data.profileCreatedBy[basicInfo.profileCreatedBy].title : '';
  
  if(!profileDescription) return null;
  return (
    <Paper className={classes.root}>
      <Box py={1} px={2}>
        <Typography variant="h6" className={classes.about}>About {name}</Typography>
        { !profileCreatedBy ? null : <Typography color="textSecondary" gutterBottom>Profile created by {profileCreatedBy.toLowerCase()}</Typography> }
        <Collapse in={showMore} collapsedHeight={description.current && description.current.offsetHeight > 148 ? "148px" : (description.current && description.current.offsetHeight <= 148 ? description.current.offsetHeight+'px' : '100px')}>
          <Typography color="inherit" ref={description}>{profileDescription}</Typography>
        </Collapse>
        {
          showMore ? null :
          <Box textAlign="center">
            <Button type="button" onClick={() => setShowMore(true)}>More <ArrowDownIcon /> </Button>
          </Box>
        }
      </Box>
    </Paper>
  );
}

 
const mapStateToProps = state => {
  return {
    system: systemSelector(state, [], ['profileCreatedBy']),
  }
}
export default connect(mapStateToProps)(ProfileDescription);
 
