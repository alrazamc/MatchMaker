import React from 'react';
import { TextField } from '@material-ui/core';

const TextInput = ({
  label, input, 
  meta: { touched, invalid, error },
  ...custom
}) => {
  return (
    <TextField 
      label={label}
      error={ touched && invalid }
      helperText={ touched && error }
      {...input}
      {...custom}
    />
  );
}
 
export default TextInput;