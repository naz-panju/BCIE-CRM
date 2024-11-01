import * as React from 'react';
import { Button, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import { CommunicationLogApi } from '@/data/Endpoints/CommunicationLog';
import { AttachmentOutlined, PrintOutlined } from '@mui/icons-material';
import moment from 'moment';
import Checkbox from '@mui/material/Checkbox';
import CreateTabs from './commTabs';
import PhoneCallModal from './Modals/SummaryModal';
import { PhoneCallApi } from '@/data/Endpoints/PhoneCall';
import SendMail from '../../Modals/SendMail';
import { useSession } from 'next-auth/react';
import SendWhatsApp from '../../Modals/SendWhatsapp';
import Pusher from "pusher-js";
import toast from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import { useReactToPrint } from 'react-to-print';


export default function BasicSelect({ lead_id, from, app_id, refresh, phoneCallRefresh, setphoneCallRefresh, leadData, setDetailRefresh }) {

    const session = useSession()

    const [select, setAge] = React.useState('');
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const [callLoading, setcallLoading] = useState(false)
    const [details, setdetails] = useState()
    const [callDetails, setcallDetails] = useState()
    const [selected, setSelected] = useState([])

    const [tabValue, setTabValue] = useState(0)
    const [activeTab, setActiveTab] = useState(0);

    const [emailLimit, setEmailLimit] = useState(10)
    const [whatsappLimit, setwhatsappLimit] = useState(10)
    const [callLimit, setCallLimit] = useState(10)

    const [whatsappList, setwhatsappList] = useState([])
    const [callList, setcallList] = useState([])

    const [phonecallId, setphonecallId] = useState()
    const [callSummaryLoading, setcallSummaryLoading] = useState(false)
    // const [phoneCallRefresh, setphoneCallRefresh] = useState(false)

    const [emailPage, setEmailPage] = useState(1)
    const [whatsappPage, setwhatsappPage] = useState(1)
    const [callPage, setcallPage] = useState(1)

    const [allPages, setAllPages] = useState({
        email: {
            page: emailPage,

        },
        whatsapp: {
            page: whatsappPage,
            setPage: setwhatsappPage
        },
        call: {
            page: callPage,
            setPage: setcallPage
        },
    })

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
            type: ['Send', 'Gmail'],
            page: emailPage,
            // page: page + 1
        }
        if (from == 'app') {
            params['application_id'] = app_id
        }
        const response = await CommunicationLogApi.list(params)
        console.log(response);
        setList(response?.data)
        setLoading(false)
    }

    const [whatsappLoading, setwhatsappLoading] = useState(false)

    const fetchWhatsappList = async (messageLoading) => {
        if (!messageLoading) {
            setwhatsappLoading(true)
        }
        let params = {
            lead_id: lead_id,
            limit: whatsappLimit,
            type: ['Whatsapp Send', 'Whatsapp'],
            page: whatsappPage,
        }
        if (from == 'app') {
            params['application_id'] = app_id
        }
        const response = await CommunicationLogApi.list(params)
        // console.log(response);
        setwhatsappList(response?.data)
        setwhatsappLoading(false)
    }

    const fetchCallList = async () => {
        setcallLoading(true)
        let params = {
            lead_id: lead_id,
            limit: callLimit,
            type: ['Inbound', 'Outbound'],
            page: callPage,
        }
        if (from == 'app') {
            params['application_id'] = app_id
        }
        const response = await PhoneCallApi.list(params)
        setcallList(response?.data)
        setcallLoading(false)
    }

    const handleEmailLimit = (limit) => {
        setEmailLimit(limit)
    }

    const handleWhatsappLimit = (limit) => {
        setwhatsappLimit(limit)
    }

    const handleCallLimit = (limit) => {
        setCallLimit(limit)
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
        setcallSummaryLoading(true)
        let params = {
            lead_id: lead_id,
        }
        if (from == 'app') {
            params['application_id'] = app_id
        }
        const response = await PhoneCallApi.summmary(params)
        // console.log(response);
        setcallDetails(response?.data?.data)
        setcallSummaryLoading(false)
    }
    const [mailId, setMailId] = useState()
    const handleOpenMailModal = () => {
        if (lead_id) {
            setMailId(lead_id)
        }
    }

    const [whatsappId, setwhatsappId] = useState()
    const handleOpenWhatsappModal = () => {
        if (lead_id) {
            setwhatsappId(lead_id)
        }
    }

    const handleMailRefresh = () => {
        setDetailRefresh(!refresh)
        getSummary()
        setActiveTab(0)
        fetchList()
    }

    const handlePhoneCallOpen = () => {
        setphonecallId(0)
    }

    const handlePhoneRefresh = () => {
        setDetailRefresh(!refresh)
        getCallSummary()
        fetchCallList()
        setActiveTab(2)
    }

    const handleWhatsappRefresh = () => {
        setDetailRefresh(!refresh)
        getCallSummary()
        fetchWhatsappList()
        setActiveTab(1)
    }

    const contentRef = React.useRef()
    const [printLoad, setPrintLoad] = useState(false)
    const [printEmailList, setprintEmailList] = useState()
    const [printWhatsappList, setprintWhatsappList] = useState()
    const [printCallList, setprintCallList] = useState()

    const handlePrintFetch = useReactToPrint({ contentRef })


    const handlePrint = async () => {
        try {
            setPrintLoad(true);
            const emailResponse = await CommunicationLogApi.list({
                lead_id: lead_id,
                limit: 1000,
                type: ['Send', 'Gmail'],
            });
            setprintEmailList(emailResponse?.data);

            const whatsappResponse = await CommunicationLogApi.list({
                lead_id: lead_id,
                limit: 1000,
                type: ['Whatsapp Send', 'Whatsapp'],
            });
            setprintWhatsappList(whatsappResponse?.data);

            const callResponse = await CommunicationLogApi.list({
                lead_id: lead_id,
                limit: 1000,
                type: ['Inbound', 'Outbound'],
            });
            setprintCallList(callResponse?.data);

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

    useEffect(() => {
        const pusher = new Pusher("eec1f38e41cbf8c3acc7", {
            cluster: "ap2",
            //   encrypted: true,
        });
        const channel = pusher.subscribe("bcie-channel");
        channel.bind("bcie-event", (data) => {
            if (data?.lead_id) {
                if (data?.lead_id == leadData?.id) {
                    fetchWhatsappList(true)
                    getSummary()
                }
            }
        });
        return () => {
            pusher.unsubscribe("bcie-channel");
            pusher.disconnect();
        };
    }, []);

    useEffect(() => {
        getSummary()
        // getCallSummary()
    }, [emailLimit, whatsappLimit, refresh])
    useEffect(() => {
        getCallSummary()
    }, [phoneCallRefresh])




    useEffect(() => {
        fetchList()
    }, [emailLimit, refresh, emailPage])
    useEffect(() => {
        fetchWhatsappList()
    }, [whatsappLimit, refresh, whatsappPage])
    useEffect(() => {
        fetchCallList()
    }, [callLimit, phoneCallRefresh, callPage])

    return (

        <>
            <PhoneCallModal lead_id={lead_id} editId={phonecallId} setEditId={setphonecallId} handleRefresh={handlePhoneRefresh} />
            <SendMail from={'lead'} details={leadData} lead_id={lead_id} editId={mailId} setEditId={setMailId} refresh={refresh} setRefresh={handleMailRefresh} />
            <SendWhatsApp details={leadData} lead_id={lead_id} editId={whatsappId} setEditId={setwhatsappId} refresh={refresh} setRefresh={handleWhatsappRefresh} from={'lead'} />

            <div className='lead-tabpanel-content-block timeline'>
                {/* <div className='lead-tabpanel-content-block-title'>
                    <h2>Communication Log</h2>
                    <div className='timeline-top-right-block'>
                        <Button onClick={handlePhoneCallOpen} variant='outlined'>Add Phone Call Summary</Button>
                    </div>
                </div> */}

                <div className='timeline-content-block-item'>
                    <div className='flex mar-25'>
                        <div className='md:w-4/12 lg:w-3/12 pad-25 timeline-content-block-item-content-block'>

                            <h4><svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none"><path d="M2.875 7.66667L10.3906 12.6771C11.0624 13.1249 11.9376 13.1249 12.6094 12.6771L20.125 7.66667M4.875 18.2083H18.125C19.2296 18.2083 20.125 17.3129 20.125 16.2083V6.79167C20.125 5.6871 19.2296 4.79167 18.125 4.79167H4.875C3.77043 4.79167 2.875 5.6871 2.875 6.79167V16.2083C2.875 17.3129 3.77043 18.2083 4.875 18.2083Z" stroke="#0B0D23" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>Email Summary</h4>

                            <div className='timeline-content-block-item-block communication-log'>
                                <div className='flex mar-10 communication-log-block'>
                                    <div className='w-full md:w-6/12 lg:w-6/12 communication-log-item'>
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
                                                        <h4> Sent</h4>
                                                    </>
                                            }
                                        </div>
                                    </div>

                                    <div className='w-full md:w-6/12 lg:w-6/12 communication-log-item'>
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
                                                        <h4> received</h4>
                                                    </>
                                            }
                                        </div>
                                    </div>

                                </div>
                            </div>
                            {
                                session?.data?.user?.role?.id != 6 && leadData?.closed != 1 && leadData?.withdrawn != 1 && 
                                <Button onClick={handleOpenMailModal} variant='outlined' sx={{ mt: 2, mb: -2, textTransform: 'none' }}>Send Mail</Button>
                            }
                        </div>

                        <div className=' md:w-4/12 lg:w-3/12 pad-25 timeline-content-block-item-content-block'>



                            <h4><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none"> <path d="M17.4622 4.50083C16.6218 3.65193 15.6208 2.97886 14.5176 2.52088C13.4143 2.0629 12.2309 1.82917 11.0364 1.83333C6.03141 1.83333 1.95224 5.9125 1.95224 10.9175C1.95224 12.5217 2.37391 14.08 3.16224 15.455L1.87891 20.1667L6.69141 18.9017C8.02057 19.6258 9.51474 20.0108 11.0364 20.0108C16.0414 20.0108 20.1206 15.9317 20.1206 10.9267C20.1206 8.4975 19.1764 6.215 17.4622 4.50083ZM11.0364 18.4708C9.67974 18.4708 8.35057 18.1042 7.18641 17.4167L6.91141 17.2517L4.05141 18.0033L4.81224 15.2167L4.62891 14.9325C3.87517 13.7289 3.47495 12.3376 3.47391 10.9175C3.47391 6.75583 6.86557 3.36417 11.0272 3.36417C13.0439 3.36417 14.9414 4.1525 16.3622 5.5825C17.0658 6.2828 17.6233 7.11577 18.0025 8.03314C18.3817 8.95051 18.5751 9.93402 18.5714 10.9267C18.5897 15.0883 15.1981 18.4708 11.0364 18.4708ZM15.1797 12.8242C14.9506 12.7142 13.8322 12.1642 13.6306 12.0817C13.4197 12.0083 13.2731 11.9717 13.1172 12.1917C12.9614 12.4208 12.5306 12.9342 12.4022 13.0808C12.2739 13.2367 12.1364 13.255 11.9072 13.1358C11.6781 13.0258 10.9447 12.7783 10.0831 12.0083C9.40474 11.4033 8.95557 10.6608 8.81807 10.4317C8.68974 10.2025 8.79974 10.0833 8.91891 9.96417C9.01974 9.86333 9.14807 9.69833 9.25807 9.57C9.36807 9.44167 9.41391 9.34083 9.48724 9.19417C9.56057 9.03833 9.52391 8.91 9.46891 8.8C9.41391 8.69 8.95557 7.57167 8.77224 7.11333C8.58891 6.67333 8.39641 6.72833 8.25891 6.71917H7.81891C7.66307 6.71917 7.42474 6.77417 7.21391 7.00333C7.01224 7.2325 6.42557 7.7825 6.42557 8.90083C6.42557 10.0192 7.24141 11.1008 7.35141 11.2475C7.46141 11.4033 8.95557 13.695 11.2289 14.6758C11.7697 14.9142 12.1914 15.0517 12.5214 15.1525C13.0622 15.3267 13.5572 15.2992 13.9514 15.2442C14.3914 15.18 15.2989 14.6942 15.4822 14.1625C15.6747 13.6308 15.6747 13.1817 15.6106 13.0808C15.5464 12.98 15.4089 12.9342 15.1797 12.8242Z" fill="#0B0D23" /></svg>Whatsapp Summary</h4>
                            <div className='timeline-content-block-item-block communication-log'>
                                <div className='flex mar-10 communication-log-block'>
                                    <div className='w-full md:w-6/12 lg:w-6/12 communication-log-item'>
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
                                                        <h4> Sent</h4>
                                                    </>
                                            }
                                        </div>
                                    </div>
                                    <div className='w-full md:w-6/12 lg:w-6/12 communication-log-item'>
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
                                                        <h4> received</h4>
                                                    </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                session?.data?.user?.role?.id != 6 && leadData?.closed != 1 && leadData?.withdrawn != 1 && 
                                <Button onClick={handleOpenWhatsappModal} variant='outlined' sx={{ mt: 2, mb: -2, textTransform: 'none' }}>Send Whatsapp</Button>
                            }
                        </div>

                        <div className='md:w-4/12 lg:w-3/12 pad-25 timeline-content-block-item-content-block'>

                            <h4><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3.44389 4.96848C4.23722 10.8128 9.18688 15.7625 15.0312 16.5558C15.9759 16.684 16.8009 15.9937 16.9879 15.0589L17.2001 13.9979C17.377 13.1135 16.94 12.2202 16.1334 11.8168L15.3316 11.416C14.6568 11.0786 13.8373 11.272 13.3847 11.8756C13.0898 12.2687 12.6163 12.5083 12.1632 12.3184C10.6057 11.6655 8.33419 9.394 7.68131 7.83651C7.49136 7.38336 7.73101 6.90983 8.12409 6.61502C8.72764 6.16236 8.9211 5.34285 8.58371 4.66807L8.18283 3.86632C7.77949 3.05963 6.88614 2.62271 6.00175 2.79959L4.94078 3.01178C4.00593 3.19875 3.31565 4.02378 3.44389 4.96848Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>Phone Call Summary</h4>
                            <div className='timeline-content-block-item-block communication-log'>

                                <div className='flex mar-10 communication-log-block'>
                                    <div className='w-full md:w-6/12 lg:w-6/12 communication-log-item'>
                                        <div className='lead-score-block'>
                                            {
                                                callSummaryLoading ?
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
                                                        <h4> Inbound</h4>
                                                    </>
                                            }
                                        </div>
                                    </div>

                                    <div className='w-full md:w-6/12 lg:w-6/12 communication-log-item'>
                                        <div className='lead-score-block'>
                                            {
                                                callSummaryLoading ?
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
                                                        <h4> Outbound</h4>
                                                    </>
                                            }
                                        </div>
                                    </div>

                                </div>
                            </div>
                            {
                                session?.data?.user?.role?.id != 6 && leadData?.closed != 1 && leadData?.withdrawn != 1 && 
                                <Button onClick={handlePhoneCallOpen} variant='outlined' sx={{ mt: 2, mb: -2, textTransform: 'none' }}>Add Call</Button>
                            }
                        </div>
                    </div>


                </div>



                <div className='flex justify-end'>
                    <LoadingButton loading={printLoad} disabled={printLoad} variant='contained' onClick={handlePrint} className='edit-btn' sx={{ color: 'white', '&:hover': { backgroundColor: '#0c8ac2' } }}>
                        <PrintOutlined fontSize='small' />
                        Print
                    </LoadingButton>
                </div>

                <div className=' md:w-12/12 lg:w-12/12 mt-3'>
                    <div className='communication-log-block-tab-block tab-block'>
                        <div className='communication-log-attachments'>
                            {/* <h3>Attachments</h3> */}
                        </div>

                        <div className='communication-log-attachments-tab'>
                            <div onClick={() => setActiveTab(0)} className='communication-log-item '>
                                <div className={`lead-score-block-tab flex   ${activeTab == 0 ? 'lead-tab-active' : 'bg-trans'}`}>
                                    <h4>Email</h4>
                                    <h4>({list?.meta?.total})</h4>
                                </div>
                            </div>
                            <div onClick={() => setActiveTab(1)} className='communication-log-item '>
                                <div className={`lead-score-block-tab tab flex ${activeTab == 1 ? 'lead-tab-active' : 'bg-trans'}`} >
                                    <h4>Whatsapp</h4>
                                    <h4>({whatsappList?.meta?.total})</h4>
                                </div>
                            </div>
                            <div onClick={() => setActiveTab(2)} className='communication-log-item '>
                                <div className={`lead-score-block-tab tab flex ${activeTab == 2 ? 'lead-tab-active' : 'bg-trans'}`} >
                                    <h4>Call Summary</h4>
                                    <h4>({callList?.meta?.total})</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <CreateTabs leadData={leadData} whatsappLoading={whatsappLoading} callLoading={callLoading} setEmailPage={setEmailPage} emailPage={emailPage} callPage={callPage} whatsappPage={whatsappPage} setcallPage={setcallPage} setwhatsappPage={setwhatsappPage} list={list} whatsappList={whatsappList} callList={callList} value={tabValue} setValue={setTabValue} activeTab={activeTab} setActiveTab={setActiveTab} setEmailLimit={handleEmailLimit} setwhatsappLimit={setwhatsappLimit} setCallLimit={setCallLimit} loading={loading} handleCallEdit={setphonecallId} handlePhoneRefresh={handlePhoneRefresh} emailLimit={emailLimit} whatsappLimit={whatsappLimit} callLimit={callLimit} />

            </div>

            {/* print table */}
            <div style={{ display: 'none' }} >
                <div className='mb-2'>
                    <div className='lead-tabpanel-content-item'>

                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div>
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Name </label>
                                    {leadData?.name}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {leadData?.stage &&
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Lead Stage </label> {leadData?.stage?.name}
                                </div>}

                            <div>
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Email Address </label>
                                    {leadData?.email || 'NA'}
                                </div>
                            </div>

                            <div>
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Mobile Number  </label>
                                    {leadData?.phone_number ? '+' : ''}{leadData?.phone_number || 'NA'}
                                </div>
                            </div>

                            <div>
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Alternate Mobile Number </label>
                                    {leadData?.alternate_phone_number ? ` + ${leadData?.alternate_phone_number}` : ' NA'}
                                </div>
                            </div>

                            <div>
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>WhatsApp Number </label>
                                    {leadData?.whatsapp_number ? ` +${leadData?.whatsapp_number}` : ' NA'}
                                </div>
                            </div>

                            {leadData?.country_of_birth &&
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Country of Birth </label> {leadData?.country_of_birth?.name}
                                </div>}

                            {leadData?.country_of_residence &&
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Country of Residence </label> {leadData?.country_of_residence?.name}
                                </div>}

                            {leadData?.city &&
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>City </label> {leadData?.city}
                                </div>}

                            {leadData?.address &&
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Address </label> {leadData?.address}
                                </div>}

                            {leadData?.date_of_birth &&
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Date of Birth </label> {moment(leadData?.date_of_birth).format('DD-MM-YYYY')}
                                </div>}

                            <div>
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Preferred Courses </label> {leadData?.preferred_course || 'NA'}
                                </div>
                            </div>

                            {leadData?.preferred_countries &&
                                <div>
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Preferred Countries </label> {leadData?.preferred_countries}
                                    </div>
                                </div>}

                            {leadData?.passport &&
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Passport Number </label> {leadData?.passport}
                                </div>}

                            {leadData?.passport_exp_date &&
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Passport Expiry Date </label>{moment(leadData?.passport_exp_date).format('DD-MM-YYYY')}
                                </div>}

                            {leadData?.lead_source &&
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Lead Source </label> {leadData?.lead_source?.name}
                                </div>}

                            {leadData?.lead_source?.id == 5 &&
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Referred Student </label> {leadData?.referredStudent?.name || 'NA'}
                                </div>}

                            {leadData?.lead_source?.id == 6 &&
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Referred Agency </label> {leadData?.agency?.name || 'NA'}
                                </div>}

                            {leadData?.lead_source?.id == 7 &&
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Referred University </label> {leadData?.referred_university?.name || 'NA'}
                                </div>}

                            {leadData?.lead_source?.id == 11 &&
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Event </label> {leadData?.event?.name || 'NA'}
                                </div>}

                            {leadData?.sponser_details &&
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Sponser Detail </label> {leadData?.sponser_details || 'NA'}
                                </div>}

                            {leadData?.referrance_from &&
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Here about us from </label> {leadData?.referrance_from}
                                </div>}

                            {leadData?.campaign &&
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Campaign </label> {leadData?.campaign?.name}
                                </div>}

                            <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                <label style={{ fontWeight: 'bold' }}>Sign up for external parties </label>
                                {leadData?.sign_up_for_external_parties ? 'yes' : 'no'}
                            </div>

                            {leadData?.note &&
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Note </label> {leadData?.note}
                                </div>}

                            {leadData?.substage &&
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Lead Sub Stage </label>: {leadData?.substage?.name}
                                </div>}

                            {leadData?.closed == 1 && leadData?.archive_reason &&
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Archive Reason </label> {leadData?.archive_reason}
                                </div>}

                            {leadData?.closed == 1 && leadData?.win_reason &&
                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Win Reason </label> {leadData?.win_reason}
                                </div>}
                        </div>
                    </div>
                </div>

                <div ref={contentRef}>
                    <div className='mb-2'>
                        <div className='lead-tabpanel-content-item'>

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                <div>
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Name </label>
                                        {leadData?.name}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {leadData?.stage &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Lead Stage </label> {leadData?.stage?.name}
                                    </div>}

                                <div>
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Email Address </label>
                                        {leadData?.email || 'NA'}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Mobile Number  </label>
                                        {leadData?.phone_number ? '+' : ''}{leadData?.phone_number || 'NA'}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Alternate Mobile Number </label>
                                        {leadData?.alternate_phone_number ? ` + ${leadData?.alternate_phone_number}` : ' NA'}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>WhatsApp Number </label>
                                        {leadData?.whatsapp_number ? ` +${leadData?.whatsapp_number}` : ' NA'}
                                    </div>
                                </div>

                                {leadData?.country_of_birth &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Country of Birth </label> {leadData?.country_of_birth?.name}
                                    </div>}

                                {leadData?.country_of_residence &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Country of Residence </label> {leadData?.country_of_residence?.name}
                                    </div>}

                                {leadData?.city &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>City </label> {leadData?.city}
                                    </div>}

                                {leadData?.address &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Address </label> {leadData?.address}
                                    </div>}

                                {leadData?.date_of_birth &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Date of Birth </label> {moment(leadData?.date_of_birth).format('DD-MM-YYYY')}
                                    </div>}

                                <div>
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Preferred Courses </label> {leadData?.preferred_course || 'NA'}
                                    </div>
                                </div>

                                {leadData?.preferred_countries &&
                                    <div>
                                        <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                            <label style={{ fontWeight: 'bold' }}>Preferred Countries </label> {leadData?.preferred_countries}
                                        </div>
                                    </div>}

                                {leadData?.passport &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Passport Number </label> {leadData?.passport}
                                    </div>}

                                {leadData?.passport_exp_date &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Passport Expiry Date </label>{moment(leadData?.passport_exp_date).format('DD-MM-YYYY')}
                                    </div>}

                                {leadData?.lead_source &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Lead Source </label> {leadData?.lead_source?.name}
                                    </div>}

                                {leadData?.lead_source?.id == 5 &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Referred Student </label> {leadData?.referredStudent?.name || 'NA'}
                                    </div>}

                                {leadData?.lead_source?.id == 6 &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Referred Agency </label> {leadData?.agency?.name || 'NA'}
                                    </div>}

                                {leadData?.lead_source?.id == 7 &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Referred University </label> {leadData?.referred_university?.name || 'NA'}
                                    </div>}

                                {leadData?.lead_source?.id == 11 &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Event </label> {leadData?.event?.name || 'NA'}
                                    </div>}

                                {leadData?.sponser_details &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Sponser Detail </label> {leadData?.sponser_details || 'NA'}
                                    </div>}

                                {leadData?.referrance_from &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Here about us from </label> {leadData?.referrance_from}
                                    </div>}

                                {leadData?.campaign &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Campaign </label> {leadData?.campaign?.name}
                                    </div>}

                                <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                    <label style={{ fontWeight: 'bold' }}>Sign up for external parties </label>
                                    {leadData?.sign_up_for_external_parties ? 'yes' : 'no'}
                                </div>

                                {leadData?.note &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Note </label> {leadData?.note}
                                    </div>}

                                {leadData?.substage &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Lead Sub Stage </label>: {leadData?.substage?.name}
                                    </div>}

                                {leadData?.closed == 1 && leadData?.archive_reason &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Archive Reason </label> {leadData?.archive_reason}
                                    </div>}

                                {leadData?.closed == 1 && leadData?.win_reason &&
                                    <div style={{ margin: '5px', paddingBottom: '10px' }} className="lead-details-list print-detail">
                                        <label style={{ fontWeight: 'bold' }}>Win Reason </label> {leadData?.win_reason}
                                    </div>}
                            </div>
                        </div>
                    </div>

                    <div className='text[16px] font-semibold p-5 flex justify-center'>
                        Email
                    </div>
                    <TableContainer>
                        <Table>
                            <TableHead className='bg-[#232648] text-white'>
                                <TableRow>
                                    <TableCell >
                                        <Typography variant="subtitle1" sx={{ color: 'white' }} fontWeight="bold">
                                            Type
                                        </Typography>

                                    </TableCell>
                                    <TableCell >
                                        <Typography variant="subtitle1" sx={{ color: 'white' }} fontWeight="bold">
                                            Subject
                                        </Typography>

                                    </TableCell>
                          
                                    <TableCell>

                                    </TableCell>
                                    <TableCell>

                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            {
                                printEmailList?.data?.length > 0 ?
                                    <TableBody>

                                        {
                                            printEmailList?.data?.map((obj, index) => (
                                                <React.Fragment key={obj?.id}>
                                                    <TableRow className='application-tr' >
                                                        <TableCell>
                                                            {obj?.type == 'Gmail' ? 'Recieved' : obj?.type}
                                                        </TableCell>
                                                        <TableCell>
                                                            {obj?.subject}
                                                        </TableCell>
                                                       
                                                        <TableCell>
                                                            {
                                                                obj?.attachments?.length > 0 &&
                                                                <AttachmentOutlined fontSize='small' sx={{ color: 'grey' }} />
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                moment(obj?.message_date).format('DD MMM hh:mm A')
                                                            }
                                                        </TableCell>

                                                    </TableRow>

                                                </React.Fragment>
                                            ))
                                        }


                                    </TableBody>
                                    :
                                    (
                                        <TableBody>
                                            <TableRow sx={{ height: 250, color: 'transparent' }}>
                                                <TableCell colSpan={8} style={{ textAlign: 'center' }}>
                                                    No Data Available
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    )}
                        </Table>
                    </TableContainer>

                    <div className='text[16px] font-semibold p-5 flex justify-center'>
                        WhatsApp
                    </div>
                    <TableContainer>
                        <Table>
                            <TableHead className='bg-[#232648] text-white'>
                                <TableRow>
                                    <TableCell >
                                        <Typography variant="subtitle1" sx={{ color: 'white' }} fontWeight="bold">
                                            Type
                                        </Typography>

                                    </TableCell>
                                    <TableCell >
                                        <Typography variant="subtitle1" sx={{ color: 'white' }} fontWeight="bold">
                                            Content
                                        </Typography>

                                    </TableCell>
                                    <TableCell >

                                    </TableCell>

                                </TableRow>
                            </TableHead>
                            {
                                printWhatsappList?.data?.length > 0 ?
                                    <TableBody>

                                        {
                                            printWhatsappList?.data?.map((obj, index) => (
                                                <React.Fragment key={obj?.id}>
                                                    <TableRow className='application-tr' >
                                                        <TableCell>
                                                            {obj?.type == 'Gmail' ? 'Recieved' : obj?.type}
                                                        </TableCell>
                                                        <TableCell>
                                                            {obj?.body}
                                                        </TableCell>
                                                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'right', minWidth: '150px' }}>
                                                            {

                                                                moment(obj?.message_date).format('DD MMM hh:mm A')
                                                            }
                                                        </TableCell>

                                                    </TableRow>

                                                </React.Fragment>
                                            ))
                                        }


                                    </TableBody>
                                    :
                                    (
                                        <TableBody>
                                            <TableRow sx={{ height: 250, color: 'transparent' }}>
                                                <TableCell colSpan={8} style={{ textAlign: 'center' }}>
                                                    No Data Available
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    )}
                        </Table>
                    </TableContainer>

                    <div className='text[16px] font-semibold p-5 flex justify-center'>
                        Call Summary
                    </div>
                    <TableContainer>
                        <Table>
                            <TableHead className='bg-[#232648] text-white'>
                                <TableRow>
                                    <TableCell >
                                        <Typography variant="subtitle1" sx={{ color: 'white' }} fontWeight="bold">
                                            Type
                                        </Typography>

                                    </TableCell>
                                    <TableCell >
                                        <Typography variant="subtitle1" sx={{ color: 'white' }} fontWeight="bold">
                                            Summary
                                        </Typography>

                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1" sx={{ color: 'white' }} fontWeight="bold">
                                            Date and Time
                                        </Typography>

                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1" sx={{ color: 'white' }} fontWeight="bold">
                                            To
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            {
                                printCallList?.data?.length > 0 ?
                                    <TableBody>

                                        {
                                            printCallList?.data?.map((obj, index) => (
                                                <React.Fragment key={obj?.id}>
                                                    <TableRow className='application-tr' >
                                                        <TableCell>
                                                            {obj?.type}
                                                        </TableCell>
                                                        <TableCell>
                                                            {obj?.call_summary}
                                                        </TableCell>
                                                        <TableCell>{moment(obj?.date_time_of_call).format('DD-MM-YYYY hh:mm A')}</TableCell>
                                                    </TableRow>

                                                </React.Fragment>
                                            ))
                                        }


                                    </TableBody>
                                    :
                                    (
                                        <TableBody>
                                            <TableRow sx={{ height: 250, color: 'transparent' }}>
                                                <TableCell colSpan={8} style={{ textAlign: 'center' }}>
                                                    No Data Available
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    )}
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </>


    );
}