import React from 'react';
import { Box, Typography, Button } from '@material-ui/core';
import { connect } from 'react-redux';


const Description = (props) => {
  const { editInfo, description } = props;
  return (
    <Box my={2}>
      <Typography variant="body2" gutterBottom>
        {description}
      </Typography>
      <Button variant="contained" color="primary" onClick={editInfo} >
        Edit
      </Button>
    </Box>
  );
}

const mapStateToProps = state => {
  return {
    description: state.profile && state.profile.profileDescription ? state.profile.profileDescription : ""
  }
}

export default connect(mapStateToProps)(Description);