import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import Select from 'react-select';
import { emphasize, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';


const useStyles = makeStyles(theme => ({
  input: {
    display: 'flex',
    padding: 0,
    height: 'auto',
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2),
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    bottom: 6,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing(2),
  },
}));

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, TextFieldProps },
  } = props;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          autoComplete:"false",
          children,
          ...innerProps,
        },
      }}
      {...TextFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  const { selectProps, innerProps = {}, children } = props;
  return (
    <Typography color="textSecondary" className={selectProps.classes.placeholder} {...innerProps}>
      {children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      variant="outlined"
      label={props.children}
      className={clsx(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

const AutoComplete = ({
  label, input, options, id, fullWidth,
  input:{onChange, value },
  isMulti,
  initValue,
  ...custom
}) => {
  const handleChange = useCallback((item, action) => {
    if(isMulti)
    {
      const values = [];
      if(action.action === 'select-option' && action.option.value === null){ 
        values.push(null); //if doesn't matter selected remove all other selected options
        onChange(values);
      }
      else{
        if(item && item.length) // normal item selected, remove doesn't matter if already selected
          item.filter(record => record.value !== null).forEach(record => values.push(record.value));
        else
          values.push(null); // no item selected, doesn't matter should be default value
        onChange(values);
      }
    }else
    {
      onChange(item ? item.value : item);
    }
  }, [onChange, isMulti]);

  const suggestions =  useMemo(() => {
    return options.map(option => ({
      value: option.id,
      label: option.title
    }));
  }, [options]);
  const selectedOption = useMemo(() => {
      return suggestions.filter(option => isMulti ? value.includes(option.value) : option.value === value);
  }, [value, suggestions, isMulti])
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <NoSsr>
        <Select
          classes={classes}
          onChange={handleChange}
          inputId={id}
          TextFieldProps={{
            label: label,
            InputLabelProps: {
              htmlFor: id,
              shrink: true,
            },
          }}
          isMulti={isMulti}
          {...custom}
          value={selectedOption}
          options={suggestions}
          components={components}
          isClearable={true}
        />
      </NoSsr>
    </div>
  );
}

export default AutoComplete;