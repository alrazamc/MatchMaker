import React from 'react'
import { FormControlLabel, Checkbox } from '@material-ui/core';
const CheckboxInput = ({ input, label }) => (
  <div>
    <FormControlLabel
      control={
        <Checkbox
          checked={input.value ? true : false}
          onChange={input.onChange}
          color="primary"
          name={input.name}
        />
      }
      label={label}
    />
  </div>
)

export default CheckboxInput;