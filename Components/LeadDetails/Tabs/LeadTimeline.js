import * as React from 'react';


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
import { LeadApi } from '@/data/Endpoints/Lead';
import { useEffect } from 'react';
import { useState } from 'react';
import moment from 'moment';
import { Skeleton } from '@mui/material';

export default function BasicSelect({ id }) {
    const [select, setAge] = React.useState('');
    const [list, setList] = useState([])
    const [limit, setLimit] = useState(10)
    const [laoding, setLaoding] = useState(false)
    const [total, setTotal] = useState(5)

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const getData = async () => {
        setLaoding(true)
        const response = await LeadApi.timeline({ id, limit })
        setList(response?.data)
        setTotal(response?.data?.meta?.total)
        setLaoding(false)
    }
    // console.log(list);

    useEffect(() => {
        getData()
    }, [limit])


    return (

        <div className='lead-tabpanel-content-block timeline'>
            <div className='lead-tabpanel-content-block-title'>
                <h2>Timeline</h2>
                <div className='timeline-top-right-block'>
                    {/* <Box className="" sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Age</InputLabel>
                            <Select className='tabpanel-select' labelId="demo-simple-select-label" id="demo-simple-select" value={select} label="Select" onChange={handleChange} >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                    </Box> */}
                </div>
            </div>

            {
                laoding ?
                    loadingTimeline(total)
                    :
                    <div className='timeline-content-block-item'>
                        {
                            list?.data?.length > 0 ?
                                <Timeline sx={{ [`& .${timelineOppositeContentClasses.root}`]: { flex: 0.2, }, }}>
                                    {
                                        list?.data?.map((obj, index) => (
                                            <TimelineItem key={index} className='TimelineItemClass'>
                                                <TimelineOppositeContent className='TimelineOppositeContent' color="text.secondary">
                                                    {moment(obj?.created_at).format('DD MMM YYYY hh:mm A')}
                                                </TimelineOppositeContent>
                                                <TimelineSeparator>
                                                    <ThumbUpOffAltIcon className='timelineIcon' />
                                                    <TimelineConnector />
                                                </TimelineSeparator>
                                                <TimelineContent>
                                                    <div className='timeline-content-content'>
                                                        <p>{obj?.description}</p>
                                                        {/* <span>+10</span> */}
                                                    </div>
                                                </TimelineContent>
                                            </TimelineItem>
                                        ))
                                    }

                                </Timeline>
                                :
                                <div className='no-follw-up-block'>
                                    <h4>No Timeline for this Lead</h4>
                                </div>
                        }


                        {
                            (list?.meta?.total != list?.meta?.to && list?.meta?.total != 0) &&
                            <div className='loadmore-btn-block'>
                                <button className='loadmore-btn' onClick={() => setLimit(limit + 5)} > <CachedIcon />Load More </button>
                            </div>
                        }


                    </div>
            }
        </div>


    );
}

const loadingTimeline = (total) => (
    <div className='timeline-content-block-item'>
        <Timeline sx={{ [`& .${timelineOppositeContentClasses.root}`]: { flex: 0.2, }, }}>
            {
                [...Array(total || 5)]?.map((_, index) => (
                    <TimelineItem key={index} className='TimelineItemClass'>
                        <TimelineOppositeContent className='TimelineOppositeContent' >
                            <Skeleton variant="rectangular" width={150} height={20} />
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <Skeleton className='timelineIcon' variant="circular" width={33} height={33} />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Skeleton variant="rectangular" width={'100%'} height={30} />
                        </TimelineContent>
                    </TimelineItem>
                ))
            }

        </Timeline>
    </div>
)