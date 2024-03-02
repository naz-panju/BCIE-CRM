import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import CachedIcon from '@mui/icons-material/Cached';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import TimelineOppositeContent, {
    timelineOppositeContentClasses,
  } from '@mui/lab/TimelineOppositeContent';
  
export default function BasicSelect() {
  const [select, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
   
    <div className='lead-tabpanel-content-block timeline'>
        <div className='lead-tabpanel-content-block-title'>
            <h2>Timeline</h2>
            <div className='timeline-top-right-block'>
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
            <Timeline sx={{[`& .${timelineOppositeContentClasses.root}`]: {flex: 0.2,},}}>
            <TimelineItem className='TimelineItemClass'>
                <TimelineOppositeContent className='TimelineOppositeContent' color="text.secondary">
                    13 Feb 2024 07:15 PM
                </TimelineOppositeContent>
                <TimelineSeparator>
                <ThumbUpOffAltIcon className='timelineIcon'/>
                <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <div className='timeline-content-content'>
                        <p>NPF HE Demo [College Admin] changed lead stage from Stage: Untouched to Stage: Hot  .</p>
                        <span>+10</span>
                    </div>
                </TimelineContent>
            </TimelineItem>

            <TimelineItem className='TimelineItemClass'>
                <TimelineOppositeContent className='TimelineOppositeContent' color="text.secondary">
                01 Feb 2024 11:45 AM
                </TimelineOppositeContent>
                <TimelineSeparator>
                <HelpOutlineIcon className='timelineIcon' />
                <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <div className='timeline-content-content'>
                        <p>NPF HE Demo closed Query Ticket: #19836</p>
                        <span>0</span>
                    </div>
                </TimelineContent>
            </TimelineItem>
            
            <TimelineItem className='TimelineItemClass'>
                <TimelineOppositeContent className='TimelineOppositeContent' color="text.secondary">
                    01 Feb 2024 11:44 AM
                </TimelineOppositeContent>
                <TimelineSeparator>
                <ThumbUpOffAltIcon className='timelineIcon' />
                <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <div className='timeline-content-content'>
                        <p>NPF HE Demo replied to Query Ticket: #19836 .</p>
                        <span>0</span>
                    </div>
                </TimelineContent>
            </TimelineItem>

            <TimelineItem className='TimelineItemClass'>
                <TimelineOppositeContent className='TimelineOppositeContent' color="text.secondary">
                    01 Feb 2024 11:42 AM
                </TimelineOppositeContent>
                <TimelineSeparator>
                <ThumbUpOffAltIcon className='timelineIcon'/>
                <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <div className='timeline-content-content'>
                        <p>Basma raised Query Ticket: #19836 assigned to NA.</p>
                        <span>+3</span>
                    </div>
                </TimelineContent>
            </TimelineItem>

            <TimelineItem className='TimelineItemClass'>
                <TimelineOppositeContent className='TimelineOppositeContent' color="text.secondary">
                01 Feb 2024 11:45 AM
                </TimelineOppositeContent>
                <TimelineSeparator>
                <HelpOutlineIcon className='timelineIcon'/>
                <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <div className='timeline-content-content'>
                        <p>NPF HE Demo closed Query Ticket: #19836</p>
                        <span>0</span>
                    </div>
                </TimelineContent>
            </TimelineItem>
            
            <TimelineItem className='TimelineItemClass'>
                <TimelineOppositeContent className='TimelineOppositeContent' color="text.secondary">
                    01 Feb 2024 11:44 AM
                </TimelineOppositeContent>
                <TimelineSeparator>
                <ThumbUpOffAltIcon className='timelineIcon'/>
                <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <div className='timeline-content-content'>
                        <p>NPF HE Demo replied to Query Ticket: #19836 .</p>
                        <span>0</span>
                    </div>
                </TimelineContent>
            </TimelineItem>

            <TimelineItem className='TimelineItemClass'>
                <TimelineOppositeContent className='TimelineOppositeContent' color="text.secondary">
                    01 Feb 2024 11:42 AM
                </TimelineOppositeContent>
                <TimelineSeparator>
                <ThumbUpOffAltIcon className='timelineIcon'/>
                <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <div className='timeline-content-content'>
                        <p>Basma raised Query Ticket: #19836 assigned to NA.</p>
                        <span>+3</span>
                    </div>
                </TimelineContent>
            </TimelineItem>

            </Timeline>

            <div className='loadmore-btn-block'>
                <button className='loadmore-btn' > <CachedIcon />Load More </button>
            </div>

        </div>
    </div>
   
   
  );
}