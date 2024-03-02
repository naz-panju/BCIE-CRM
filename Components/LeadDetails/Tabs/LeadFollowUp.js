import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CreateIcon from '@mui/icons-material/Create';

export default function BasicSelect() {
  const [select, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
   
    <div className='lead-tabpanel-content-block timeline'>
        <div className='lead-tabpanel-content-block-title'>
            <h2>Follow Up & Notes</h2>
            <div className='timeline-top-right-block'>
                <div className='add-note'>
                    <CreateIcon />
                    Add Note
                </div>
                <div className='add-note'>
                    <CreateIcon />
                    Add Follow Up
                </div>
                <Box className="" sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Age</InputLabel>
                        <Select className='tabpanel-select' labelId="demo-simple-select-label" id="demo-simple-select" value={select} label="Select" onChange={handleChange} >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </div>
        </div>

        <div className='timeline-content-block-item'>
            <div className='no-follw-up-block'>
                <h4>You have no follow-ups<br />
and Remarks for Basma</h4>
            </div>
        </div>
    </div>
   
   
  );
}