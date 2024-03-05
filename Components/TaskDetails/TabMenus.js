import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useState } from 'react';
import TabPanel from '@/utils/TabPanel';
import Details from './Tabs/Details';
import { Grid, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { TaskApi } from '@/data/Endpoints/Task';
import { useEffect } from 'react';
import TaskNotes from './Tabs/Notes';

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

export default function TaskDetailTabs({ id, close }) {
    const [value, setValue] = React.useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const [details, setDetails] = useState()

    const handleChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const getDetails = async () => {
        const response = await TaskApi.view({ id })
        if (response?.data?.data) {
            let data = response?.data?.data
            setDetails(response?.data?.data)
        }
    }

    useEffect(() => {
        if (activeTab == 0) {
            getDetails()
        }
    }, [activeTab])


    const tabs = [
        {
            component: <Details data={details} />,
            label: 'Details'
        },
        {
            component: <Details />,
            label: 'Document'
        },
        {
            component: <Details />,
            label: 'Checklist'
        },
        {
            component: <TaskNotes id={id} />,
            label: 'Notes'
        },
    ];

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Tabs value={activeTab} onChange={handleChange} aria-label="basic tabs example" >
                    {tabs.map((obj, index) => (
                        <Tab label={obj.label} key={index} {...a11yProps(index)} sx={{ textTransform: 'none' }} />
                    ))}
                </Tabs>
                <Grid display={'flex'} justifyContent={'end'}>
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
    );
}
