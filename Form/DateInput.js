import React from 'react';
import { IconButton, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { alpha } from "@mui/material/styles";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import moment from "moment";


const DateInput = (props) => {
    let textFiledStyles = {
        '& .MuiFilledInput-root': {
            backgroundColor: 'background.paper',
            borderWidth: 1,
            width: '100%',
            borderStyle: 'solid',
            borderColor: 'neutral.300',
            borderRadius: 1,
            boxShadow: '0px 1px 2px 0px rgba(9, 30, 66, 0.08)',
            overflow: 'hidden',
            p: 0,
            transition: (theme) => theme.transitions.create([
                'border-color',
                'box-shadow'
            ]),
            '&:before': {
                borderBottom: 0
            },
            '&:hover': {
                backgroundColor: 'background.paper'
            },
            '&.Mui-focused': {
                backgroundColor: 'background.paper',
                boxShadow: (theme) => `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`
            },
            '&.Mui-disabled': {
                backgroundColor: 'action.disabledBackground',
                boxShadow: 'none',
                borderColor: alpha('#D6DBE1', 0.5)
            },
            '.MuiInputAdornment-root.MuiInputAdornment-positionStart.MuiInputAdornment-root:not(.MuiInputAdornment-hiddenLabel)': {
                mt: 0,
                ml: 1.5
            }
        },

    }
    let InputLabelProps = {
        shrink: true,
        sx: {
            color: 'text.primary',
            fontSize: 14,
            fontWeight: 500,
            mb: 0.5,
            position: 'relative',
            transform: 'none'
        }
    }
    let inputProps = {
        sx: {
            alignItems: 'center',
            display: 'flex',
            fontSize: 14,
            width: '85%',
            height: 'unset',
            lineHeight: 1.6,
            px: 1.5,
            py: 0.75,
            '&.MuiInputBase-inputAdornedStart': {
                pl: 0
            }
        }
    }

    return (
        <>
            <Controller
                name={props.name}
                control={props.control}
                defaultValue={props.value}
                render={({
                    field: { onChange, value },
                    fieldState: { error },
                    formState,
                }) => (
                    <DesktopDatePicker
                        label={props.label}
                        value={value}
                        readOnly={props.disabled}
                        onChange={onChange}
                        disableFuture={props.disableFuture}
                        renderInput={(params) => {
                            return (
                                <TextField {...params}
                                    style={{ width: '100%' }}  //fullwidth
                                    sx={textFiledStyles}
                                    InputLabelProps={InputLabelProps}
                                    variant="filled"
                                    value={value ? moment(value).format('DD-MM-YYYY') : ''}
                                    // helperText={error ? error.message : null}
                                    error={!!error}
                                    inputProps={inputProps}
                                    placeholder={props?.placeholder || ''}
                                // InputProps={{
                                //     endAdornment: value ? (
                                //         <IconButton
                                //             aria-label="clear date"
                                //             onClick={() => onChange(null)} // Clear the field on click
                                //             edge="end"
                                //         >
                                //             <ClearIcon />
                                //         </IconButton>
                                //     ) : null,
                                // }}
                                />
                            );
                        }}
                    />
                )}
            />
        </>
    );
}

export default DateInput;
