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

const EducationCareer = ({educationCareer, system}) => {
  const classes = useStyles();
  if(!educationCareer) return null;
  const educationLevel = system.data.educationLevel[educationCareer.educationLevel] ? system.data.educationLevel[educationCareer.educationLevel].title : '';
  const educationField = system.data.educationField[educationCareer.educationField] ? system.data.educationField[educationCareer.educationField].title : '';
  const workingAs = system.data.occupations[educationCareer.workingAs] ? system.data.occupations[educationCareer.workingAs].title : '';
  const workingWith = system.data.workingWith[educationCareer.workingWith] ? system.data.workingWith[educationCareer.workingWith].title : '';
  let workingAsText = "";
  let workingWithText = "";
  let annualIncome = "";
  if(workingWith && educationCareer.workingWith < 4)
  {
    workingAsText = `Working as ${workingAs.toLowerCase()}`;
    workingWithText = workingWith ? ' with ' + workingWith : '';
  }
  else if(workingWith && educationCareer.workingWith === 4)
  {
    workingAsText = `Doing ${workingWith.toLowerCase()}`
    workingWithText = workingAs ? ' as ' + workingAs : '';
  }else if(workingWith && educationCareer.workingWith === 5)
    workingAsText = workingWith;
  if(workingWith && educationCareer.workingWith !== 5 && educationCareer.annualIncome && educationCareer.annualIncome < 13 && !educationCareer.hideIncome)
  {
    annualIncome = system.data.annualIncome[educationCareer.annualIncome] ? system.data.annualIncome[educationCareer.annualIncome].title : '';
    annualIncome = 'Earns ' + annualIncome + " annually";
  }
  return (
    <Paper className={classes.root}>
      <Box py={1} px={2}>
        <Typography variant="h6" className={classes.about} gutterBottom>Education & Career</Typography>
        <Typography>
          {educationLevel}{educationLevel ? ' degree ' : null}
          {educationLevel && educationField ? ' in ' : null} {educationField}
        </Typography>
        <Typography>{workingAsText}{workingWithText}</Typography>
        <Typography>{annualIncome}</Typography>
      </Box>
    </Paper>
  );
}

 
const mapStateToProps = state => {
  return {
    system: systemSelector(state, [], ['educationLevel', 'educationField', 'occupations', 'workingWith', 'annualIncome']),
  }
}
export default connect(mapStateToProps)(EducationCareer);
 
