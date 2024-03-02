import React from 'react';
import PhoneInput from 'react-phone-number-input/input';
import 'react-phone-number-input/style.css';
import { FormControl, InputLabel, InputAdornment, OutlinedInput } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';

const PhoneInputWithCountryCode = ({ value, onChange, onBlur, error }) => {
  return (
    <FormControl fullWidth variant="outlined" error={error}>
      <InputLabel htmlFor="phone-input">Phone Number</InputLabel>
      <OutlinedInput
        id="phone-input"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        // startAdornment={
        //   <InputAdornment position="start">
        //     <PhoneIcon />
        //   </InputAdornment>
        // }
        label="Phone Number"
        inputComponent={PhoneInput}
        inputProps={{
          country: 'US', // Default country code
        }}
      />
    </FormControl>
  );
};

export default PhoneInputWithCountryCode;
