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
import { LocalPhoneOutlined, NotesOutlined } from '@mui/icons-material';
import { useSession } from 'next-auth/react';

export default function FollowUp({ lead_id, data, from, app_id, refresh, setRefresh }) {
    const session = useSession()


    const [select, setAge] = React.useState('');
    const [list, setList] = useState([])
    const [limit, setLimit] = useState(10)
    const [laoding, setLaoding] = useState(false)
    const [confirmId, setconfirmId] = useState()
    const [confirmLoading, setconfirmLoading] = useState(false)
    const [total, setTotal] = useState(5)

    const [editId, setEditId] = useState()
    // const [refresh, setRefresh] = useState(false)

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
        let params = {
            id: lead_id,
        }
        if (from == 'app') {
            params['application_id'] = app_id
        }
        const response = await FollowupApi.list(params)
        setList(response?.data)
    }

    const handleComplete = () => {
        setconfirmLoading(true)
        let dataToSubmit = {
            id: confirmId
        }
        FollowupApi.complete(dataToSubmit).then((response) => {
            // console.log(response);
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

    const getFirstLettersOfTwoWords = (name) => {
        if (name) {
            const words = name.split(" "); // Split the name into an array of words
            if (words.length >= 2) {
                // Extract the first letter of the first two words and concatenate them
                return words[0].charAt(0) + words[1].charAt(0);
            } else if (words.length === 1) {
                // If there's only one word, return its first letter
                return words[0].charAt(0);
            }
        }
        return ""; // Return an empty string if name is not provided
    };

    const getData = async () => {
        setLaoding(true)
        let params = {
            id: lead_id,
            limit
        }
        if (from == 'app') {
            params['application_id'] = app_id
        }
        const response = await FollowupApi.notesAndFollowUp(params)
        setList(response?.data)
        setTotal(response?.data?.meta?.total)
        setLaoding(false)
    }

    useEffect(() => {
        getData()
    }, [limit, refresh])


    return (
        <>

            <FollowUpModal from={from} lead_id={lead_id} app_id={app_id} editId={editId} setEditId={setEditId} refresh={refresh} setRefresh={setRefresh} data={data} />
            <LeadNoteModal from={from} lead_id={lead_id} app_id={app_id} editId={noteId} setEditId={setNoteId} refresh={refresh} setRefresh={setRefresh} />


            <ConfirmPopup loading={confirmLoading} ID={confirmId} setID={setconfirmId} clickFunc={handleComplete} title={'Do you want to mark this follow-up as complete?'} />

            <div className='lead-tabpanel-content-block timeline'>
                <div className='lead-tabpanel-content-block-title'>
                    <div className='lead-tabpanel-content-block-title'>
                        <div className='lead-detail-title notes'>
                            Find Latest Notes

                            <div className='timeline-top-right-block'>
                                {
                                    session?.data?.user?.role?.id != 6 &&  data?.closed != 1 && data?.withdrawn != 1 &&  
                                    <a className='edit-btn' size='small' onClick={handleNoteCreate} variant='outlined' ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V12M9 15V12.5L17.75 3.75C18.4404 3.05964 19.5596 3.05964 20.25 3.75V3.75C20.9404 4.44036 20.9404 5.55964 20.25 6.25L15.5 11L11.5 15H9Z" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>  Add Note </a>
                                }
                            </div>

                        </div>
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

                                                obj?.type == 'Note' ?
                                                    <TimelineItem key={index} className='TimelineItemClass'>
                                                        <TimelineOppositeContent className='TimelineOppositeContent' color="text.secondary">
                                                            {moment(obj?.created_at).format('DD MMM YYYY hh:mm A')}
                                                        </TimelineOppositeContent>
                                                        <TimelineSeparator>
                                                            <NotesOutlined className='timelineIcon' />
                                                            <TimelineConnector />
                                                        </TimelineSeparator>
                                                        <TimelineContent>
                                                            <div className='timeline-content-content notes-block'>
                                                                <Grid display={'flex'} className='notes-block-content'>
                                                                    <span className='note-span'>Note</span>
                                                                    <p>{obj?.note}</p>
                                                                </Grid>

                                                                <Grid display={'flex'} className='note-createdby'>
                                                                    <span className='profile-db'>
                                                                        {getFirstLettersOfTwoWords(obj?.created_by?.name)}
                                                                    </span>
                                                                    <div>
                                                                        <p>Created By</p>
                                                                        <h4> {obj?.created_by?.name}</h4>
                                                                    </div>


                                                                </Grid>

                                                            </div>


                                                        </TimelineContent>
                                                    </TimelineItem>
                                                    :
                                                    <TimelineItem key={index} className='TimelineItemClass'>
                                                        <TimelineOppositeContent className='TimelineOppositeContent' color="text.secondary">
                                                            {moment(obj?.created_at).format('DD MMM YYYY hh:mm A')}
                                                        </TimelineOppositeContent>
                                                        <TimelineSeparator>
                                                            <LocalPhoneOutlined className='timelineIcon' />
                                                            <TimelineConnector />
                                                        </TimelineSeparator>
                                                        <TimelineContent>
                                                            <div className='timeline-content-content notes'>
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
                                        <h4>No Notes Found</h4>
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