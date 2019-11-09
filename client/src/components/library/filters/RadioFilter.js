import React, { useMemo, useCallback } from 'react';
import FilterSection from './FilterSection';
import { FormControl, RadioGroup, FormControlLabel, Radio, makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { updateFilters } from '../../../store/actions/PeopleActions';

const useStyles = makeStyles(theme => ({
  radio:{
    padding: 2
  },
  radioLabelRoot:{
    margin: 0
  },
  radioLabelText: {
    color: theme.palette.grey[600],
    fontSize: "12px"
  }
}))

const RadioFilter = ({label, name, value, options, updateFilters}) => {
  const classes = useStyles();
  const choices = useMemo(() => {
    if(options.length === 0) return options;
    return [{
      value: 0,
      title: "All"
    },...options];
  }, [options])
  
  const handleChange = useCallback((event, value) => {
    updateFilters(name, parseInt(value))
  }, [updateFilters, name]);
  return (
    <FilterSection label={label}>
      <FormControl fullWidth={true} >
        <RadioGroup onChange={handleChange} value={parseInt(value)}>
          {
            choices.map(item => (
              <FormControlLabel
                classes={{
                  root: classes.radioLabelRoot,
                  label: classes.radioLabelText
                }}
                key={item.value}
                value={item.value}
                label={item.title} 
                labelPlacement="end"
                control={<Radio className={classes.radio}  color="primary"  />} />
            ))
          }
        </RadioGroup>
      </FormControl>
    </FilterSection>
  );
}

const mapStateToProps = (state, props) => {
  return {
    value: state.people.filters && state.people.filters[props.name] ? state.people.filters[props.name] : 0
  }
}

export default connect(mapStateToProps, {updateFilters})(RadioFilter);