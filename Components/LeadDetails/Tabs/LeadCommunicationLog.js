import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CreateIcon from '@mui/icons-material/Create';

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
            <h2>Communication Log</h2>
            <div className='timeline-top-right-block'>

            </div>
        </div>

        <div className='timeline-content-block-item'>
            <div className=''>
                <h4>Email Summary</h4>
                <div className='flex mar-10 communication-log-block'>
                    <div className='w-full md:w-3/12 lg:w-2/12 pad-10 communication-log-item'>
                        <div className='lead-score-block'>
                            <h3>5</h3>
                            <h4>Email Sent</h4>
                        </div>
                    </div>
                    <div className='w-full md:w-3/12 lg:w-2/12 pad-10 communication-log-item'>
                        <div className='lead-score-block'>
                            <h3>0%</h3>
                            <h4>Open Rate</h4>
                        </div>
                    </div>

                    <div className='w-full md:w-3/12 lg:w-2/12 pad-10 communication-log-item'>
                        <div className='lead-score-block'>
                            <h3>0%</h3>
                            <h4>Click Rate</h4>
                        </div>
                    </div>

                    <div className='w-full md:w-3/12 lg:w-2/12 pad-10 communication-log-item'>
                        <div className='lead-score-block'>
                            <h3>0</h3>
                            <h4>Email Bounced</h4>
                        </div>
                    </div>
                    
                </div>
            </div>

            <div className=''>
                <h4>SMS Summary</h4>
                <div className='flex mar-10 communication-log-block'>
                    <div className='w-full md:w-3/12 lg:w-2/12 pad-10 communication-log-item'>
                        <div className='lead-score-block'>
                            <h3>1</h3>
                            <h4>SMS Sent</h4>
                        </div>
                    </div>
                    <div className='w-full md:w-3/12 lg:w-2/12 pad-10 communication-log-item'>
                        <div className='lead-score-block'>
                            <h3>0</h3>
                            <h4>SMS Delivered</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className=''>
                <h4>Whatsapp Summary</h4>
                <div className='flex mar-10 communication-log-block'>
                    <div className='w-full md:w-3/12 lg:w-2/12 pad-10 communication-log-item'>
                        <div className='lead-score-block'>
                            <h3>0</h3>
                            <h4>Whatsapp Sent</h4>
                        </div>
                    </div>
                    <div className='w-full md:w-3/12 lg:w-2/12 pad-10 communication-log-item'>
                        <div className='lead-score-block'>
                            <h3>0</h3>
                            <h4>Whatsapp Delivered</h4>
                        </div>
                    </div>

                    <div className='w-full md:w-3/12 lg:w-2/12 pad-10 communication-log-item'>
                        <div className='lead-score-block'>
                            <h3>0</h3>
                            <h4>Click Rate</h4>
                        </div>
                    </div>

                    <div className='w-full md:w-3/12 lg:w-2/12 pad-10 communication-log-item'>
                        <div className='lead-score-block'>
                            <h3>0</h3>
                            <h4>Unsubscribe Rate</h4>
                        </div>
                    </div>

                    <div className='w-full md:w-3/12 lg:w-2/12 pad-10 communication-log-item'>
                        <div className='lead-score-block'>
                            <h3>0</h3>
                            <h4>Auto Reply</h4>
                        </div>
                    </div>
                </div>
            </div>



            <div className=''>
                <h4>Communication Log</h4>
               
               
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


            </div>



        </div>
    </div>
   
   
  );
}