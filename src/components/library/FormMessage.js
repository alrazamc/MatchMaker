import React from 'react';

import { FormHelperText, Typography } from "@material-ui/core";

const FormMessage = ({ children, error, success, textLeft }) => {
  const style = {
    textAlign: textLeft ? "left" : "center",
  }
  if(error)
    style.color = 'red';
  else if(success)
    style.color = 'green';
  return (
    <FormHelperText style={style} component="div">
      <Typography component="div"> { children } </Typography>
    </FormHelperText>
  );
}
 
export default FormMessage;