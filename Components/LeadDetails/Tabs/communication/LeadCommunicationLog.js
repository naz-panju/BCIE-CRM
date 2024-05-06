import * as React from 'react';
import { Button, Skeleton, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import { CommunicationLogApi } from '@/data/Endpoints/CommunicationLog';
import { AttachmentOutlined } from '@mui/icons-material';
import moment from 'moment';
import Checkbox from '@mui/material/Checkbox';
import CreateTabs from './commTabs';
import PhoneCallModal from './Modals/SummaryModal';
import { PhoneCallApi } from '@/data/Endpoints/PhoneCall';


export default function BasicSelect({ lead_id, from, app_id, refresh }) {
    const [select, setAge] = React.useState('');
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const [callLoading, setcallLoading] = useState(false)
    const [details, setdetails] = useState()
    const [callDetails, setcallDetails] = useState()
    const [selected, setSelected] = useState([])

    const [tabValue, setTabValue] = useState(0)
    const [activeTab, setActiveTab] = useState(0);

    const [emailLimit, setEmailLimit] = useState(15)
    const [whatsappLimit, setwhatsappLimit] = useState(15)
    const [callLimit, setCallLimit] = useState(15)

    const [whatsappList, setwhatsappList] = useState([])
    const [callList, setcallList] = useState([])

    const [phonecallId, setphonecallId] = useState()
    const [phoneCallRefresh, setphoneCallRefresh] = useState(false)

    const handlePhoneCallOpen = () => {
        setphonecallId(0)
    }

    const handlePhoneRefresh = () => {
        setphoneCallRefresh(!phoneCallRefresh)
    }

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected?.slice(1));
        } else if (selectedIndex === selected?.length - 1) {
            newSelected = newSelected.concat(selected?.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected?.slice(0, selectedIndex),
                selected?.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;


    const fetchList = async () => {
        setLoading(true)
        let params = {
            lead_id: lead_id,
            limit: emailLimit,
            type: ['Send', 'Receive']
            // page: page + 1
        }
        if (from == 'app') {
            params['application_id'] = app_id
        }
        const response = await CommunicationLogApi.list(params)
        // console.log(response);
        setList(response?.data)
        setLoading(false)
    }

    // console.log(list);

    const fetchWhatsappList = async () => {
        setLoading(true)
        let params = {
            lead_id: lead_id,
            limit: whatsappLimit,
            type: ['Whatsapp Send', 'Whatsapp Receive']
            // page: page + 1
        }
        if (from == 'app') {
            params['application_id'] = app_id
        }
        const response = await CommunicationLogApi.list(params)
        // console.log(response);
        setwhatsappList(response?.data)
        setLoading(false)
    }

    const fetchCallList = async () => {
        setcallLoading(true)
        let params = {
            lead_id: lead_id,
            limit: callLimit,
            type: ['Inbound', 'Outbound']
            // page: page + 1
        }
        if (from == 'app') {
            params['application_id'] = app_id
        }
        const response = await PhoneCallApi.list(params)
        setcallList(response?.data)
        setcallLoading(false)
    }

    const handleEmailLimit = () => {
        setEmailLimit(emailLimit + 5)
    }

    const handleWhatsappLimit = () => {
        setwhatsappLimit(whatsappLimit + 5)
    }

    const getSummary = async () => {
        let params = {
            lead_id: lead_id,
        }
        if (from == 'app') {
            params['application_id'] = app_id
        }
        const response = await CommunicationLogApi.summary(params)
        // console.log(response);
        setdetails(response?.data?.data)
    }

    const getCallSummary = async () => {
        let params = {
            lead_id: lead_id,
        }
        if (from == 'app') {
            params['application_id'] = app_id
        }
        const response = await PhoneCallApi.summmary(params)
        // console.log(response);
        setcallDetails(response?.data?.data)
    }

    useEffect(() => {
        getSummary()
        // getCallSummary()
    }, [emailLimit, whatsappLimit])
    useEffect(() => {
        getCallSummary()
    }, [phoneCallRefresh])


    useEffect(() => {
        fetchList()
    }, [emailLimit, refresh])
    useEffect(() => {
        fetchWhatsappList()
    }, [whatsappLimit, refresh])
    useEffect(() => {
        fetchCallList()
    }, [callLimit, phoneCallRefresh])

    return (

        <>
            <PhoneCallModal lead_id={lead_id} editId={phonecallId} setEditId={setphonecallId} handleRefresh={handlePhoneRefresh} />

            <div className='lead-tabpanel-content-block timeline'>
                <div className='lead-tabpanel-content-block-title'>
                    <h2>Communication Log</h2>
                    <div className='timeline-top-right-block'>
                        <Button onClick={handlePhoneCallOpen} variant='outlined'>Add Phone Call Summary</Button>
                    </div>
                </div>

                <div className='timeline-content-block-item flex'>
                    <div className='md:w-6/12 lg:w-6/12 '>
                        <h4>Email Summary</h4>
                        <div className='flex mar-10 communication-log-block'>
                            <div className='w-full md:w-6/12 lg:w-4/12 pad-10 communication-log-item'>
                                <div className='lead-score-block'>
                                    {
                                        loading ?
                                            <>
                                                <h3 className='text-center'>
                                                    <Skeleton width={'100%'} height={20} variant='rounded' />
                                                </h3>
                                                <h4 className='text-center'>
                                                    <Skeleton width={'100%'} height={20} variant='rounded' />
                                                </h4>
                                            </>
                                            :
                                            <>
                                                <h3>{details?.email_send_summary}</h3>
                                                <h4>Email Sent</h4>
                                            </>
                                    }
                                </div>
                            </div>

                            <div className='w-full md:w-6/12 lg:w-4/12 pad-10 communication-log-item'>
                                <div className='lead-score-block'>
                                    {
                                        loading ?
                                            <>
                                                <h3 className='text-center'>
                                                    <Skeleton width={'100%'} height={20} variant='rounded' />
                                                </h3>
                                                <h4 className='text-center'>
                                                    <Skeleton width={'100%'} height={20} variant='rounded' />
                                                </h4>
                                            </>
                                            :
                                            <>
                                                <h3>{details?.email_receive_summary}</h3>
                                                <h4>Email received</h4>
                                            </>
                                    }
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className=' md:w-6/12 lg:w-6/12'>
                        <h4>Whatsapp Summary</h4>
                        <div className='flex mar-10 communication-log-block'>
                            <div className='w-full md:w-6/12 lg:w-4/12 pad-10 communication-log-item'>
                                <div className='lead-score-block'>
                                    {
                                        loading ?
                                            <>
                                                <h3 className='text-center'>
                                                    <Skeleton width={'100%'} height={20} variant='rounded' />
                                                </h3>
                                                <h4 className='text-center'>
                                                    <Skeleton width={'100%'} height={20} variant='rounded' />
                                                </h4>
                                            </>
                                            :
                                            <>
                                                <h3>{details?.whatsapp_send_summary}</h3>
                                                <h4>Whatsapp Sent</h4>
                                            </>
                                    }
                                </div>
                            </div>
                            <div className='w-full md:w-6/12 lg:w-4/12 pad-10 communication-log-item'>
                                <div className='lead-score-block'>
                                    {
                                        loading ?
                                            <>
                                                <h3 className='text-center'>
                                                    <Skeleton width={'100%'} height={20} variant='rounded' />
                                                </h3>
                                                <h4 className='text-center'>
                                                    <Skeleton width={'100%'} height={20} variant='rounded' />
                                                </h4>
                                            </>
                                            :
                                            <>
                                                <h3>{details?.whatsapp_receive_summary}</h3>
                                                <h4>Whatsapp received</h4>
                                            </>
                                    }
                                </div>
                            </div>

                        </div>
                    </div>

                </div>


                <div className='timeline-content-block-item flex'>
                    <div className='md:w-6/12 lg:w-6/12 '>
                        <h4>Phone Call Summary</h4>
                        <div className='flex mar-10 communication-log-block'>
                            <div className='w-full md:w-6/12 lg:w-4/12 pad-10 communication-log-item'>
                                <div className='lead-score-block'>
                                    {
                                        callLoading ?
                                            <>
                                                <h3 className='text-center'>
                                                    <Skeleton width={'100%'} height={20} variant='rounded' />
                                                </h3>
                                                <h4 className='text-center'>
                                                    <Skeleton width={'100%'} height={20} variant='rounded' />
                                                </h4>
                                            </>
                                            :
                                            <>
                                                <h3>{callDetails?.calls_inbound}</h3>
                                                <h4>Calls Inbound</h4>
                                            </>
                                    }
                                </div>
                            </div>

                            <div className='w-full md:w-6/12 lg:w-4/12 pad-10 communication-log-item'>
                                <div className='lead-score-block'>
                                    {
                                        callLoading ?
                                            <>
                                                <h3 className='text-center'>
                                                    <Skeleton width={'100%'} height={20} variant='rounded' />
                                                </h3>
                                                <h4 className='text-center'>
                                                    <Skeleton width={'100%'} height={20} variant='rounded' />
                                                </h4>
                                            </>
                                            :
                                            <>
                                                <h3>{callDetails?.calls_outbound}</h3>
                                                <h4>Calls Outbound</h4>
                                            </>
                                    }
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                <div className=' md:w-6/12 lg:w-6/12 mt-3'>
                    <div className='flex mar-10 communication-log-block'>
                        <div onClick={() => setActiveTab(0)} className='w-full md:w-6/12 lg:w-4/12 pad-10 communication-log-item '>
                            <div className={`lead-score-block-tab flex  bg-sky-200 ${activeTab == 0 ? 'bg-sky-300' : 'bg-sky-200'}`}>
                                <h4>Email</h4>
                                <h4>({list?.meta?.total})</h4>
                            </div>
                        </div>
                        <div onClick={() => setActiveTab(1)} className='w-full md:w-6/12 lg:w-4/12 pad-10 communication-log-item'>
                            <div className={`lead-score-block-tab tab flex ${activeTab == 1 ? 'bg-sky-300' : 'bg-sky-200'}`} >
                                <h4>Whatsapp</h4>
                                <h4>({whatsappList?.meta?.total})</h4>
                            </div>
                        </div>
                        <div onClick={() => setActiveTab(2)} className='w-full md:w-6/12 lg:w-4/12 pad-10 communication-log-item'>
                            <div className={`lead-score-block-tab tab flex ${activeTab == 2 ? 'bg-sky-300' : 'bg-sky-200'}`} >
                                <h4>Call Summary</h4>
                                <h4>({callList?.meta?.total})</h4>
                            </div>
                        </div>
                    </div>
                </div>

                <CreateTabs list={list} whatsappList={whatsappList} callList={callList} value={tabValue} setValue={setTabValue} activeTab={activeTab} setActiveTab={setActiveTab} setEmailLimit={handleEmailLimit} setwhatsappLimit={setwhatsappLimit} setCallLimit={setCallLimit} loading={loading} handleCallEdit={setphonecallId} handlePhoneRefresh={handlePhoneRefresh} />

            </div>
        </>


    );
}