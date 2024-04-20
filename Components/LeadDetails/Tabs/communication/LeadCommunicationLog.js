import * as React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import { CommunicationLogApi } from '@/data/Endpoints/CommunicationLog';
import { AttachmentOutlined } from '@mui/icons-material';
import moment from 'moment';
import Checkbox from '@mui/material/Checkbox';
import CreateTabs from './commTabs';


export default function BasicSelect({ lead_id, from, app_id, refresh }) {
    const [select, setAge] = React.useState('');
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)

    const [selected, setSelected] = useState([])

    const [tabValue, setTabValue] = useState(0)
    const [activeTab, setActiveTab] = useState(0);

    const [emailLimit, setEmailLimit] = useState(15)
    const [whatsappLimit, setwhatsappLimit] = useState(15)

    const [whatsappList, setwhatsappList] = useState([])

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
            type:'Email Send'
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

    const fetchWhatsappList = async () => {
        setLoading(true)
        let params = {
            lead_id: lead_id,
            limit: whatsappLimit,
            type:'Whatsapp Send'
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

    console.log(whatsappList);


    const handleEmailLimit = () => {
        setEmailLimit(emailLimit + 5)
    }

    const handleWhatsappLimit = () => {
        setwhatsappLimit(whatsappLimit + 5)
    }


    useEffect(() => {
        fetchList()
    }, [emailLimit, refresh])
    useEffect(() => {
        fetchWhatsappList()
    }, [whatsappLimit, refresh])

    return (

        <div className='lead-tabpanel-content-block timeline'>
            <div className='lead-tabpanel-content-block-title'>
                <h2>Communication Log</h2>
                <div className='timeline-top-right-block'>

                </div>
            </div>

            <div className='timeline-content-block-item flex'>
                <div className='md:w-6/12 lg:w-6/12 '>
                    <h4>Email Summary</h4>
                    <div className='flex mar-10 communication-log-block'>
                        <div className='w-full md:w-6/12 lg:w-4/12 pad-10 communication-log-item'>
                            <div className='lead-score-block'>
                                <h3>5</h3>
                                <h4>Email Sent</h4>
                            </div>
                        </div>

                        <div className='w-full md:w-6/12 lg:w-4/12 pad-10 communication-log-item'>
                            <div className='lead-score-block'>
                                <h3>0</h3>
                                <h4>Email received</h4>
                            </div>
                        </div>

                    </div>
                </div>

                <div className=' md:w-6/12 lg:w-6/12'>
                    <h4>Whatsapp Summary</h4>
                    <div className='flex mar-10 communication-log-block'>
                        <div className='w-full md:w-6/12 lg:w-4/12 pad-10 communication-log-item'>
                            <div className='lead-score-block'>
                                <h3>0</h3>
                                <h4>Whatsapp Sent</h4>
                            </div>
                        </div>
                        <div className='w-full md:w-6/12 lg:w-4/12 pad-10 communication-log-item'>
                            <div className='lead-score-block'>
                                <h3>0</h3>
                                <h4>Whatsapp received</h4>
                            </div>
                        </div>

                    </div>
                </div>



            </div>

            <div className=' md:w-6/12 lg:w-6/12 mt-3'>
                <div className='flex mar-10 communication-log-block'>
                    <div onClick={() => setActiveTab(0)} className='w-full md:w-6/12 lg:w-4/12 pad-10 communication-log-item'>
                        <div className='lead-score-block-tab flex '>
                            <h4>Email</h4>
                            <h4>({list?.meta?.total})</h4>
                        </div>
                    </div>
                    <div onClick={() => setActiveTab(1)} className='w-full md:w-6/12 lg:w-4/12 pad-10 communication-log-item'>
                        <div className='lead-score-block-tab tab flex'>
                            <h4>Whatsapp</h4>
                            <h4>(0)</h4>
                        </div>
                    </div>
                </div>
            </div>

            <CreateTabs list={list} whatsappList={whatsappList} value={tabValue} setValue={setTabValue} activeTab={activeTab} setActiveTab={setActiveTab} setEmailLimit={handleEmailLimit} setwhatsappLimit={setwhatsappLimit} loading={loading} />

        </div>


    );
}