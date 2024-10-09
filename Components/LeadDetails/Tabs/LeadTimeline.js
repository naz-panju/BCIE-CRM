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

export default function BasicSelect({ lead_id, from, app_id, refresh,data }) {
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
                    <div className='mb-2'>
                        <div className='lead-tabpanel-content-item' >

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                <div>
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Name </label>
                                        {data?.name}
                                    </div>

                                </div>
                            </div>



                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" >

                                {
                                    data?.stage &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Lead Stage </label> {data?.stage?.name}
                                    </div>
                                }

                                <div>
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Email Address </label>
                                        {data?.email || 'NA'}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Mobile Number  </label>
                                        {data?.phone_number ? '+' : ''}{data?.phone_number || 'NA'}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Alternate Mobile Number </label>

                                        {
                                            data?.alternate_phone_number ?
                                                ` + ${data?.alternate_phone_number}`
                                                : ' NA'
                                        }
                                    </div>
                                </div>


                                <div>
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>WhatsApp Number </label>

                                        {
                                            data?.whatsapp_number ?
                                                ` +${data?.whatsapp_number}`
                                                : ' NA'
                                        }
                                    </div>
                                </div>


                                {
                                    data?.country_of_birth &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Country of Birth </label> {data?.country_of_birth?.name}
                                    </div>
                                }
                                {
                                    data?.country_of_residence &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Country of Residence </label> {data?.country_of_residence?.name}
                                    </div>
                                }
                                {
                                    data?.city &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>City </label> {data?.city}
                                    </div>
                                }
                                {
                                    data?.address &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Address </label> {data?.address}
                                    </div>
                                }
                                {
                                    data?.date_of_birth &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Date of Birth </label> {moment(data?.date_of_birth).format('DD-MM-YYYY')}
                                    </div>
                                }

                                <div>
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Preferred Courses </label> {data?.preferred_course || 'NA'}
                                    </div>
                                </div>
                                {
                                    data?.preferred_countries &&
                                    <div>
                                        <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                            <label style={{ fontWeight: 'bold' }}>Preferred Countries </label> {data?.preferred_countries}
                                        </div>
                                    </div>
                                }
                                {
                                    data?.passport &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Passport Number </label> {data?.passport}
                                    </div>
                                }
                                {
                                    data?.passport_exp_date &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Passport Expiry Date </label>{moment(data?.passport_exp_date).format('DD-MM-YYYY')}
                                    </div>
                                }
                                {
                                    data?.lead_source &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Lead Source </label> {data?.lead_source?.name}
                                    </div>
                                }
                                {/* referrance_from */}
                                {
                                    data?.lead_source?.id == 5 &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Referred Student </label> {data?.referredStudent?.name || 'NA'}
                                    </div>
                                }

                                {
                                    data?.lead_source?.id == 6 &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Referred Agency </label> {data?.agency?.name || 'NA'}
                                    </div>
                                }
                                {
                                    data?.lead_source?.id == 7 &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Referred University </label> {data?.referred_university?.name || 'NA'}
                                    </div>
                                }
                                {
                                    data?.lead_source?.id == 11 &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Event </label> {data?.event?.name || 'NA'}
                                    </div>
                                }
                                {
                                    data?.sponser_details &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Sponser Detail </label> {data?.sponser_details || 'NA'}
                                    </div>
                                }
                                {
                                    data?.referrance_from &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Here about us from </label> {data?.referrance_from}
                                    </div>
                                }

                                {
                                    data?.campaign &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Campaign </label> {data?.campaign?.name}
                                    </div>
                                }
                                {
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Sign up for external parties </label>
                                        {data?.sign_up_for_external_parties ? 'yes' : 'no'}
                                    </div>
                                }
                                {
                                    data?.note &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Note </label> {data?.note}
                                    </div>
                                }
                                {
                                    data?.substage &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Lead Sub Stage </label>: {data?.substage?.name}
                                    </div>
                                }

                                {
                                    data?.closed == 1 && data?.archive_reason &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Archive Reason </label> {data?.archive_reason}
                                    </div>
                                }

                                {
                                    data?.closed == 1 && data?.archive_note &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Archive Note </label> {data?.archive_note}
                                    </div>
                                }

                                {
                                    data?.withdrawn == 1 && data?.withdraw_reason &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Withdrawn Reason</label> {data?.withdraw_reason}
                                    </div>
                                }
                            </div>

                        </div>
                    </div>

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
                                                {/* <Image className='TimelineDotIcon' src={TimelineDotIcon} alt='TimelineDotIcon' width={18} height={18} /> */}
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