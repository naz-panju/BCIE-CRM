import React from 'react';
import { Chip } from "@mui/material";
import { Check } from '@mui/icons-material';

const DynamicChip = (props) => {
    const handleClick = () => {
        props.onChipCLick(props.id)
    }
    return <Chip onClick={handleClick} clickable={true} label={props.name} sx={{ m: 0.3 }} icon={props.active === props.id ? <Check fontSize='small' /> : null} />
};

export default DynamicChip;
