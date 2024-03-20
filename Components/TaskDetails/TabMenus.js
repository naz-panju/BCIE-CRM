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

export default function TaskDetailTabs({ id, close ,archiveRefresh}) {
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
        {
            component: <Details />,
            label: 'Document'
        },
        {
            component: <CheckListTab id={id} />,
            label: 'Checklist'
        },
        {
            component: <TaskNotes id={id} />,
            label: 'Notes'
        },
    ];

    return (
        <>
            <ConfirmPopup loading={archiveLoading} ID={archiveId} setID={setArchiveId} clickFunc={archiveTask} title={'Do you want to Archive this Task?'} />

            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Tabs value={activeTab} onChange={handleChange} aria-label="basic tabs example" >
                        {tabs.map((obj, index) => (
                            <Tab label={obj.label} key={index} {...a11yProps(index)} sx={{ textTransform: 'none' }} />
                        ))}
                    </Tabs>
                    <Grid display={'flex'} alignItems={'center'} justifyContent={'end'}>
                        {
                            details?.status == 'Completed' &&
                            <Button onClick={handleConfirmArchive} size='small' sx={{ textTransform: 'none', mr: 2, height: '28px' }} className='bg-sky-500' variant='contained'><Archive sx={{ mr: 1 }} fontSize='small' /> Archive</Button>
                        }

                        <IconButton
                            onClick={close}
                        >
                            <Close />
                        </IconButton>
                    </Grid>
                </Box>
                {tabs.map((obj, index) => {
                    return <TabPanel value={activeTab} index={index} key={index}>
                        {obj.component}
                    </TabPanel>
                })}
            </Box>
        </>
    );
}
