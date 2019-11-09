import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, change } from 'redux-form';
import { Box, Container, Grid, Hidden, Button, CircularProgress, makeStyles, Icon, Typography, Collapse } from '@material-ui/core';
import Panel from '../../library/Panel';
import FormMessage from '../../library/FormMessage';
import BasicPreference from '../../profile/preference/BasicPreference';
import LocationPreference from '../../profile/preference/LocationPreference';
import withSystem from '../../library/withSystem';
import MiscPreference from '../basic/MiscPreference';
import SaveSearch from '../basic/SaveSearch';
import { addSearch, updateSearch } from '../../../store/actions/ProfileActions';
import { changeFilters } from '../../../store/actions/PeopleActions';
import SavedSearchesList from '../SavedSearchesList';
import PlusIcon from '@material-ui/icons/Add';
import MinusIcon from '@material-ui/icons/Remove';
import EducationCareerPreference from '../../profile/preference/EducationCareerPreference';
import LifestyleAppearance from './LifestyleAppearance';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  sliderValueLabel: {
    textAlign: "center"
  }
}))

const useStyles2 = makeStyles(theme => ({
  header: {
    backgroundColor: theme.palette.grey[200],
    width: '100%',
    padding: theme.spacing(1, 1),
    cursor: "pointer"
  },
  label: {
    fontWeight: theme.typography.fontWeightBold
  }
}))

const FormSection = ({ opened=false, label, children }) => {
  const classes = useStyles2();
  const [open, setOpen] = useState(opened);
  return(
    <Box width="100%" mb={1}>
      <Box className={classes.header} onClick={() => setOpen(!open)} display="flex" alignItems="center">
        { open ? <MinusIcon /> : <PlusIcon /> }
        <Typography className={classes.label}> {label}</Typography>
      </Box>
      <Collapse in={open}>
        <Box py={1}>
          {children}
        </Box>
      </Collapse>
    </Box>
  )
}

const AdvancedSearch = (props) => {
  const classes = useStyles();
  const { handleSubmit, dispatch, submitSucceeded, pristine, submitting, error, invalid, initialValues } = props;
  useEffect(() => {
    dispatch(change("advancedSearch","searchType","advanced")); 
  }, [dispatch])

  return (
    <Box>
      <Container>
        <Grid container spacing={2}>
          <Hidden mdUp>
            <Grid item xs={12} md={3} >
              <SavedSearchesList editSearch={props.editSearch} showResults={props.showResults} />
            </Grid>
          </Hidden>
          <Grid item xs={12} md={9}>
            <Panel id="basic-search" heading="Advanced Search" expanded>
              <Box width="100%" my={2} mx="auto">
                <form onSubmit={handleSubmit}>
                  <BasicPreference formName="advancedSearch" />
                  <FormSection label="Location Details" opened>
                    <LocationPreference formName="advancedSearch" initialValues={initialValues}/>
                  </FormSection>
                  <FormSection label="Education and Profession Details">
                    <EducationCareerPreference educatedIn formName="advancedSearch" />
                  </FormSection>
                  <FormSection label="Lifestyle and Appearance">
                    <LifestyleAppearance formName="advancedSearch" />
                  </FormSection>
                  <MiscPreference online profileBy />
                  <SaveSearch />
                  <Box textAlign="center">
                    <Button type="submit" variant="contained" color="primary" disabled={pristine || submitting || invalid} className={classes.button}>
                    Search { submitting && <CircularProgress size={20} /> }
                    </Button>
                    { !submitting && submitSucceeded && 
                      <FormMessage success={true}>
                        <Box display="flex" justifyContent="center">
                          <Icon>done</Icon> Updated Successfully
                        </Box>
                      </FormMessage>  
                    }
                  </Box>
                  { error && 
                      <FormMessage error={true} >
                      { error }
                      </FormMessage>  
                    }
                </form>
              </Box>
            </Panel>
          </Grid>
          <Hidden smDown>
            <Grid item xs={12} md={3} >
              <SavedSearchesList editSearch={props.editSearch} showResults={props.showResults} />
            </Grid>
          </Hidden>
        </Grid>
      </Container>
    </Box>
  );
}

const mapStateToProps = (state) => {
  return {
  }
}

const onSubmit = (values, dispatch, props) => {
  if(values._id)
    props.updateSearch(values);
  else if(values.searchName)
    props.addSearch(values);
  props.changeFilters(values);
  props.showResults(true);
  
}

const validate = (values) => {
  const errors = {};
  return errors;
}
 
export default compose(
  connect(mapStateToProps, { addSearch, updateSearch, changeFilters }),
  reduxForm({
    form: 'advancedSearch',
    onSubmit,
    validate
  }),
  withSystem(['height', 'maritalStatus', 'religions', 'communities', 'languages', 'countries', 'educationLevel',  'educationField',
              'workingWith', 'occupations', 'annualIncome', 'diet', 'smoke', 'drink', 'bodyType', 'skinTone', 'profileCreatedBy'])
)(AdvancedSearch);