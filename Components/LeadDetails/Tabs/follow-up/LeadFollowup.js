import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import CachedIcon from '@mui/icons-material/Cached';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import TimelineOppositeContent, {
    timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import { LeadApi } from '@/data/Endpoints/Lead';
import { useEffect } from 'react';
import { useState } from 'react';
import moment from 'moment';
import { Button, Grid, Skeleton } from '@mui/material';
import FollowUpModal from './create';
import { FollowupApi } from '@/data/Endpoints/Followup';
import ConfirmPopup from '@/Components/Common/Popup/confirm';
import toast from 'react-hot-toast';
import LeadNoteModal from './noteCreate';

export default function FollowUp({ lead_id, data }) {
    const [select, setAge] = React.useState('');
    const [list, setList] = useState([])
    const [limit, setLimit] = useState(10)
    const [laoding, setLaoding] = useState(false)
    const [confirmId, setconfirmId] = useState()
    const [confirmLoading, setconfirmLoading] = useState(false)
    const [total, setTotal] = useState(5)

    const [editId, setEditId] = useState()
    const [refresh, setRefresh] = useState(false)

    const [noteId, setNoteId] = useState()

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const handleConfirmOpen = (id) => {
        setconfirmId(id)
    }


    const handleCreate = () => {
        setEditId(0)
    }

    const handleNoteCreate = () => {
        setNoteId(0)
    }

    const noLoadingFetch = async () => {
        const response = await FollowupApi.list({ id: lead_id })
        setList(response?.data)
    }

    const handleComplete = () => {
        setconfirmLoading(true)
        let dataToSubmit = {
            id: confirmId
        }
        FollowupApi.complete(dataToSubmit).then((response) => {
            console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                toast.success(response?.data?.message)
                setconfirmId()
                noLoadingFetch()
                setconfirmLoading(false)
            } else {
                toast.error(response?.response?.data?.message)
                setconfirmLoading(false)
            }
        }).catch((error) => {
            console.log(error);
            setconfirmLoading(false)
        })
    }


    const getData = async () => {
        setLaoding(true)
        const response = await FollowupApi.list({ id: lead_id, limit })
        setList(response?.data)
        setTotal(response?.data?.meta?.total)
        setLaoding(false)
    }

    // console.log(list);

    useEffect(() => {
        getData()
    }, [limit, refresh])


    return (
        <>

            <FollowUpModal lead_id={lead_id} editId={editId} setEditId={setEditId} refresh={refresh} setRefresh={setRefresh} />
            <LeadNoteModal lead_id={lead_id} editId={noteId} setEditId={setNoteId} refresh={refresh} setRefresh={setRefresh} />


            <ConfirmPopup loading={confirmLoading} ID={confirmId} setID={setconfirmId} clickFunc={handleComplete} title={'Do you want to mark this follow-up as complete?'} />

            <div className='lead-tabpanel-content-block timeline'>
                <div className='lead-tabpanel-content-block-title'>
                    <h2>Follow Up & Notes</h2>
                    <div className='timeline-top-right-block'>

                        <Button size='small' onClick={handleNoteCreate} variant='outlined' >Add Note</Button>
                        <Button size='small' onClick={handleCreate} variant='contained' className='bg-sky-500'>Add Follow Up</Button>
                        {/* <div className='add-note'>
                            Add Follow Up
                        </div> */}
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
                                                            <Grid display={'flex'}>
                                                                <p><b>Follow Up</b> -</p> <p> with {data?.name?.toUpperCase()}</p>
                                                            </Grid>
                                                            <Grid display={'flex'}>
                                                                <p><b>Assigned To</b>: </p>
                                                                <p> {obj?.assigned_to_user?.name}</p>
                                                                <p> | <b>Due</b> </p>
                                                                <p>: </p>
                                                                <p> {moment(obj?.follow_up_date).format('DD MMM hh:mm A')}</p>
                                                            </Grid>
                                                            <Grid display={'flex'}>
                                                                <p><b>Created By</b>: </p>
                                                                <p> {obj?.created_by?.name}</p>
                                                                <p> | <b>Status</b> </p>
                                                                <p>:  </p>
                                                                <p> {obj?.status}
                                                                    {obj?.status !== 'Completed' && <React.Fragment> | <Button onClick={() => handleConfirmOpen(obj?.id)} sx={{ textTransform: 'none' }} variant='contained' className='h-4 text-black hover:bg-lime-600 hover:text-white' size='small'>Mark as Completed</Button></React.Fragment>}
                                                                </p>
                                                            </Grid>
                                                            {
                                                                obj?.note &&
                                                                <Grid display={'flex'}>
                                                                    <p><b>Note</b>: </p>
                                                                    <p> {obj?.note}</p>
                                                                </Grid>
                                                            }
                                                        </div>


                                                    </TimelineContent>
                                                </TimelineItem>
                                            ))
                                        }

                                    </Timeline>
                                    :
                                    <div className='no-follw-up-block'>
                                        <h4>No Follow-up Found</h4>
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

        </>

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