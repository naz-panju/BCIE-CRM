import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useState } from 'react';
import TabPanel from '@/utils/TabPanel';
import Details from './Tabs/Details';
import { Button, Grid, IconButton } from '@mui/material';
import { Archive, Close } from '@mui/icons-material';
import { TaskApi } from '@/data/Endpoints/Task';
import { useEffect } from 'react';
import TaskNotes from './Tabs/Notes';
import CheckListTab from './Tabs/CheckList';
import ConfirmPopup from '../Common/Popup/confirm';
import toast from 'react-hot-toast';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function TaskDetailTabs({ id, close, archiveRefresh }) {
    const [value, setValue] = React.useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const [details, setDetails] = useState()
    const [loading, setLoading] = useState(false)

    const [taskId, setTaskId] = useState()

    const [archiveId, setArchiveId] = useState()
    const [archiveLoading, setArchiveLoading] = useState(false)

    const handleChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleConfirmArchive = () => {
        setArchiveId(taskId)
    }

    const archiveTask = () => {
        setArchiveLoading(true)
        let dataToSubmit = {
            id: archiveId
        }

        TaskApi.archive(dataToSubmit).then((response) => {
            if (response?.status === 200 || response?.status === 201) {
                toast.success('Task has been Archived')
                setArchiveId()
                archiveRefresh()
                setArchiveLoading(false)
                close()
                // handleClose()
            } else {
                toast.error(response?.response?.data?.message)
                setArchiveId()
                setArchiveLoading(false)
            }
        }).catch((error) => {
            console.log(error);
            toast.error(error?.response?.data?.message)
            setArchiveLoading(false)
        })

    }

    const [reOpenId, setreOpenId] = useState()
    const handleReopen = () => {
        setreOpenId(taskId)
    }
    const reOpen = () => {
        setArchiveLoading(true)
        let dataToSubmit = {
            id: reOpenId
        }

        TaskApi.reopen(dataToSubmit).then((response) => {
            if (response?.status === 200 || response?.status === 201) {
                toast.success(response?.data?.message)
                setArchiveId()
                archiveRefresh()
                setArchiveLoading(false)
                close()
                // handleClose()
            } else {
                toast.error(response?.response?.data?.message)
                setArchiveId()
                setArchiveLoading(false)
            }
        }).catch((error) => {
            console.log(error);
            toast.error(error?.response?.data?.message)
            setArchiveLoading(false)
        })

    }


    const getDetails = async () => {
        setLoading(true)
        try {
            const response = await TaskApi.view({ id })
            if (response?.data?.data) {
                setDetails(response?.data?.data)
                setTaskId(response?.data?.data?.id)
                setLoading(false)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }

    }

    useEffect(() => {
        if (activeTab == 0) {
            getDetails()
        }
    }, [activeTab])


    const tabs = [
        {
            component: <Details data={details} loading={loading} />,
            label: 'Details'
        },
        // {
        //     component: <Details />,
        //     label: 'Document'
        // },
        // {
        //     component: <CheckListTab id={id} />,
        //     label: 'Checklist'
        // },
        {
            component: <TaskNotes id={id} />,
            label: 'Notes'
        },
    ];

    return (
        <>
            <ConfirmPopup loading={archiveLoading} ID={archiveId} setID={setArchiveId} clickFunc={archiveTask} title={'Do you want to Archive this Task?'} />
            <ConfirmPopup loading={archiveLoading} ID={reOpenId} setID={setreOpenId} clickFunc={reOpen} title={'Do you want to Un Archive this Task?'} />


            {/* <Box sx={{ width: '100%' }}> */}
                <Grid className='modal_title d-flex align-items-center' >
                    <a className='back_modal' onClick={close}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                            <path d="M21.9582 15.5H9.0415M9.0415 15.5L14.2082 20.6666M9.0415 15.5L14.2082 10.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>

                    {/* <a className='back_modal_head'>Details </a> */}

                    <div className='communication-log-block-tab-block tab-block'>
                        <div className='communication-log-attachments'>
                            {/* <h3>Attachments</h3> */}
                        </div>

                        <div className='communication-log-attachments-tab'>
                            <div onClick={() => setActiveTab(0)} className='communication-log-item '>
                                <div className={`lead-score-block-tab flex   ${activeTab == 0 ? 'lead-tab-active' : 'bg-trans'}`}>
                                    <span style={{ color: 'white' }} >Details</span>
                                </div>
                            </div>

                            <div onClick={() => setActiveTab(1)} className='communication-log-item '>
                                <div className={`lead-score-block-tab tab flex ${activeTab == 1 ? 'lead-tab-active' : 'bg-trans'}`} >
                                    <span style={{ color: 'white' }}>
                                        Notes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Grid display={'flex'} alignItems={'center'} justifyContent={'end'}>
                        {
                            (details?.status == 'Completed' && details?.archived != 1) &&
                            <Button onClick={handleConfirmArchive} size='small' sx={{ textTransform: 'none', mr: 2, height: '28px' }} className='bg-sky-500' variant='contained'><Archive sx={{ mr: 1 }} fontSize='small' /> Archive</Button>
                        }
                        {
                            details?.archived == 1 &&
                            <Button onClick={handleReopen} size='small' sx={{ textTransform: 'none', mr: 2, height: '28px' }} className='bg-sky-500' variant='contained'><Archive sx={{ mr: 1 }} fontSize='small' /> Un Archive</Button>
                        }
                    </Grid>
                </Grid>
                {tabs.map((obj, index) => {
                    return <TabPanel value={activeTab} index={index} key={index}>
                        {obj.component}
                    </TabPanel>
                })}
            {/* </Box> */}
        </>
    );
}
