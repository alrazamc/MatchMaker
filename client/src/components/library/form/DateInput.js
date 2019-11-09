import React from 'react';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Utils from '@date-io/dayjs';

const DateInput = ({
  label, input, dateFormat,
  meta: { touched, invalid, error },
  ...custom
}) => {
  return (
    <MuiPickersUtilsProvider utils={Utils}>
      <DatePicker
        label={label}
        error={ touched && invalid }
        helperText={ touched && error }
        format={dateFormat}
        {...input}
        {...custom}
      />
    </MuiPickersUtilsProvider>
    
  );
}
 
export default DateInput;