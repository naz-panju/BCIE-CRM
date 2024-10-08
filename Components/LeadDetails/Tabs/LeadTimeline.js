import React, { useEffect, useRef, useState } from 'react'
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineDotIcon from '@/img/TimelineDot.svg'
import CachedIcon from '@mui/icons-material/Cached';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import TimelineOppositeContent, {
    timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import { LeadApi } from '@/data/Endpoints/Lead';
import moment from 'moment';
import { Skeleton } from '@mui/material';
import { ApplicationApi } from '@/data/Endpoints/Application';
import Image from 'next/image';
import { LoadingButton } from '@mui/lab';
import { useReactToPrint } from 'react-to-print';
import { PrintOutlined } from '@mui/icons-material';

export default function BasicSelect({ lead_id, from, app_id, refresh }) {
    const [select, setAge] = React.useState('');
    const [list, setList] = useState([])
    const [limit, setLimit] = useState(10)
    const [laoding, setLaoding] = useState(false)
    const [total, setTotal] = useState(5)

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const getData = async () => {

        let action

        if (from == 'lead') {
            action = LeadApi.timeline({ id: lead_id, limit })
        }
        if (from == 'app') {
            action = ApplicationApi.timeline({ id: app_id, limit })
        }

        setLaoding(true)
        const response = await action
        // console.log(response);
        setList(response?.data)
        setTotal(response?.data?.meta?.total)
        setLaoding(false)
    }
    // console.log(list);

    useEffect(() => {
        getData()
    }, [limit, refresh])

    const contentRef = useRef()
    const [printLoad, setPrintLoad] = useState(false)
    const [printList, setPrintList] = useState()

    const handlePrintFetch = useReactToPrint({ contentRef })

    // const handlePrintFetch = useReactToPrint({
    //     content: () => contentRef.current,
    // });

    const handlePrint = async () => {
        try {
            setPrintLoad(true);
            const response = await LeadApi.timeline({
                limit: 1000,
                id: lead_id
            });
            setPrintList(response?.data);
            setTimeout(() => {
                handlePrintFetch();
                setPrintLoad(false);
            }, 1000);

            // Trigger print after data is ready
        } catch (error) {
            console.error('Error fetching data for print', error);
            setPrintLoad(false);
        }
    };

    // useEffect(() => {
    //     if (printList?.data?.length > 0) {            
    //         setTimeout(() => {

    //         }, 1000);
    //     }
    // }, [printList])


    return (

        <div className='lead-tabpanel-content-block timeline'>
            <LoadingButton loading={printLoad} variant='contained' onClick={handlePrint} className='edit-btn' sx={{ color: 'white', '&:hover': { backgroundColor: '#0c8ac2' } }}>
                <PrintOutlined fontSize='small' />
                Print
            </LoadingButton>

            {
                laoding ?
                    loadingTimeline(total)
                    :
                    <div className='timeline-content-block-item'>
                        {
                            list?.data?.length > 0 ?
                                <Timeline className='timeline-content-block-item-block' sx={{ [`& .${timelineOppositeContentClasses.root}`]: { flex: 0.2, }, }}>
                                    {
                                        list?.data?.map((obj, index) => (
                                            <TimelineItem key={index} className='TimelineItemClass'>
                                                <TimelineOppositeContent className='TimelineOppositeContent' color="text.secondary">
                                                    <div className='TimelineOppositeContent-block'>
                                                        {moment(obj?.created_at).format('DD MMM YYYY hh:mm A')}
                                                    </div>

                                                </TimelineOppositeContent>
                                                <TimelineSeparator>
                                                    <Image className='TimelineDotIcon' src={TimelineDotIcon} alt='TimelineDotIcon' width={18} height={18} />
                                                    <TimelineConnector />
                                                </TimelineSeparator>
                                                <TimelineContent className='timeline-content-content-block'>
                                                    <div className='timeline-content-content '>
                                                        <div className='flex justify-between w-full items-center'>
                                                            <p className='leading-5 mr-2'>{obj?.description}</p>
                                                            {
                                                                obj?.type && (
                                                                    <>
                                                                        {obj.type === 'email_send' || obj.type === 'email_received' ? (
                                                                            <span style={{ background: 'green' }} className='timeline-content-content-span'></span>
                                                                        ) : obj.type === 'phone_call_created' ? (
                                                                            <span style={{ background: 'orange' }} className='timeline-content-content-span'></span>
                                                                        ) : obj.type.startsWith('lead_') ? (
                                                                            <span style={{ background: 'blue' }} className='timeline-content-content-span'></span>
                                                                        ) : obj.type.startsWith('application_') ? (
                                                                            <span style={{ background: 'yellow' }} className='timeline-content-content-span'></span>
                                                                        ) : obj.type.startsWith('stage_') ? (
                                                                            <span style={{ background: 'grey' }} className='timeline-content-content-span'></span>
                                                                        ) : obj.type.startsWith('task_') ? (
                                                                            <span style={{ background: 'aqua' }} className='timeline-content-content-span'></span>
                                                                        ) : <span style={{ background: 'black' }} className='timeline-content-content-span'></span>}
                                                                    </>
                                                                )
                                                            }
                                                        </div>
                                                        {/* <span>+10</span> */}

                                                        <svg className='timeline-content-content-svg' xmlns="http://www.w3.org/2000/svg" width="9" height="12" viewBox="0 0 9 12" fill="none"><path d="M-2.62268e-07 6L9 0.803848L9 11.1962L-2.62268e-07 6Z" fill="white" /></svg>


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

            {/* print table */}
            <div style={{ display: "none" }}>
                <div ref={contentRef} className='timeline-content-block-item'>
                    {
                        printList?.data?.length > 0 ?
                            <Timeline className='timeline-content-block-item-block' sx={{ [`& .${timelineOppositeContentClasses.root}`]: { flex: 0.2, }, }}>
                                {
                                    list?.data?.map((obj, index) => (
                                        <TimelineItem key={index} className='TimelineItemClass'>
                                            <TimelineOppositeContent className='TimelineOppositeContent' color="text.secondary">
                                                <div className='TimelineOppositeContent-block'>
                                                    {moment(obj?.created_at).format('DD MMM YYYY hh:mm A')}
                                                </div>

                                            </TimelineOppositeContent>
                                            <TimelineSeparator>
                                                <Image className='TimelineDotIcon' src={TimelineDotIcon} alt='TimelineDotIcon' width={18} height={18} />
                                                <TimelineConnector />
                                            </TimelineSeparator>
                                            <TimelineContent className='timeline-content-content-block'>
                                                <div className='timeline-content-content '>
                                                    <div className='flex justify-between w-full items-center'>
                                                        <p className='leading-5 mr-2'>{obj?.description}</p>
                                                        {
                                                            obj?.type && (
                                                                <>
                                                                    {obj.type === 'email_send' || obj.type === 'email_received' ? (
                                                                        <span style={{ background: 'green' }} className='timeline-content-content-span'></span>
                                                                    ) : obj.type === 'phone_call_created' ? (
                                                                        <span style={{ background: 'orange' }} className='timeline-content-content-span'></span>
                                                                    ) : obj.type.startsWith('lead_') ? (
                                                                        <span style={{ background: 'blue' }} className='timeline-content-content-span'></span>
                                                                    ) : obj.type.startsWith('application_') ? (
                                                                        <span style={{ background: 'yellow' }} className='timeline-content-content-span'></span>
                                                                    ) : obj.type.startsWith('stage_') ? (
                                                                        <span style={{ background: 'grey' }} className='timeline-content-content-span'></span>
                                                                    ) : obj.type.startsWith('task_') ? (
                                                                        <span style={{ background: 'aqua' }} className='timeline-content-content-span'></span>
                                                                    ) : <span style={{ background: 'black' }} className='timeline-content-content-span'></span>}
                                                                </>
                                                            )
                                                        }
                                                    </div>
                                                    {/* <span>+10</span> */}

                                                    <svg className='timeline-content-content-svg' xmlns="http://www.w3.org/2000/svg" width="9" height="12" viewBox="0 0 9 12" fill="none"><path d="M-2.62268e-07 6L9 0.803848L9 11.1962L-2.62268e-07 6Z" fill="white" /></svg>


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

                </div>
            </div>
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