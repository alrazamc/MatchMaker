import React, { useMemo } from 'react';
import FilterSection from './FilterSection';
import { FormControl, FormGroup, FormControlLabel, Checkbox, makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { updateFilters } from '../../../store/actions/PeopleActions';

const useStyles = makeStyles(theme => ({
  root:{
    maxHeight: 180,
    overflowY: "auto",
    overflow: "hidden",
  },
  checkbox:{
    padding: 2
  },
  radioLabelRoot:{
    margin: 0,
    overflow: "hidden"
  },
  radioLabelText: {
    color: theme.palette.grey[600],
    fontSize: "12px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  }
}))

const CheckboxFilter = ({label, name, value, options, updateFilters}) => {
  const classes = useStyles();
  const choices = useMemo(() => {
    if(options.length === 0) return options;
    return [{
      id: null,
      title: "All"
    }, ...options];
  }, [options])
  const isOptionChecked = (item) => {
    if(value)
      return value.includes(item.id) ? true : false;
    else
      return item.id === null ? true : false;
  }
  const handleChange = (item) => {
    let isChecked = !isOptionChecked(item)
    let id = item.id;
    if(isChecked)
    {
      if(id === null)
        updateFilters(name, null);
      else
        updateFilters(name, !value ? [id] : [...value, id]);
    }else
    {
      if(id === null)
        updateFilters(name, null);
      else
      {
        let newVal = value.filter(item => item !== id);
        newVal.length ? updateFilters(name, newVal) : updateFilters(name, null);
      }
    }
  }
  return (
    <FilterSection label={label}>
      <div className={classes.root}>
        <FormControl fullWidth={true} >
          <FormGroup >
            {
              choices.map(item => (
                <FormControlLabel
                  classes={{
                    root: classes.radioLabelRoot,
                    label: classes.radioLabelText
                  }}
                  key={item.id} 
                  checked={isOptionChecked(item)} 
                  onChange={() => handleChange(item)} 
                  label={item.title} 
                  control={<Checkbox className={classes.checkbox} color="primary"  />} 
                  labelPlacement="end"/>
              ))
            }
          </FormGroup>
        </FormControl>
      </div>
    </FilterSection>
  );
}

const mapStateToProps = (state, props) => {
  let options = props.options ? props.options : (state.system && state.system[props.optionsKey] ? state.system[props.optionsKey].choices : []);
  if(props.optionsKey === 'annualIncome') //exception
  {
    options = [...options];
    options.pop();
  }
  let value = state.people.filters && state.people.filters[props.name] ? state.people.filters[props.name] : null;
  return {
    value: value !== null && !Array.isArray(value) ? [value] : value,
    options: options
  }
}

export default connect(mapStateToProps, {updateFilters})(CheckboxFilter);