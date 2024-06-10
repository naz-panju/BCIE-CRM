import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useState } from 'react';
import TabPanel from '@/utils/TabPanel';
import ApplicationSubmittedGraph from './TabComponent';

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

export default function TargetTabs({ targets }) {

    // console.log(targets);

    const [value, setValue] = React.useState(0);
    const [activeTab, setActiveTab] = useState(0);

    const handleChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const tabs = [
        {
            component: <ApplicationSubmittedGraph data={targets?.data?.A} />,
            label: 'Application Submitted'
        },
        {
            component: <ApplicationSubmittedGraph />,
            label: 'Unconditional Offer'
        },
        {
            component: <ApplicationSubmittedGraph />,
            label: 'Deposit Paid'
        },
        {
            component: <ApplicationSubmittedGraph />,
            label: 'Visa Obtained'
        },

    ];

    return (
        <>

            <Box sx={{ width: '100%' }}>
<<<<<<< HEAD
                <Box className='targets-tab-block' sx={{  display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Tabs className='targets-tab-block-item-item' value={activeTab} onChange={handleChange} aria-label="basic tabs example" >
                        {tabs.map((obj, index) => (
                            <Tab className='targets-tab-item' label={obj.label} key={index} {...a11yProps(index)} sx={{ textTransform: 'none' }} />
=======
                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Tabs value={activeTab} onChange={handleChange} aria-label="basic tabs example" >
                        {targets?.map((obj, index) => (
                            <Tab label={obj?.stage} key={index} {...a11yProps(index)} sx={{ textTransform: 'none' }} />
>>>>>>> 11346ce4f5b68d6b8790ec2fc3667fa32f65c800
                        ))}
                    </Tabs>

                </Box>

                {targets?.map((obj, index) => {
                    return <TabPanel value={activeTab} index={index} key={index}>
                        <ApplicationSubmittedGraph data={obj} />
                    </TabPanel>
                })}
            </Box>
        </>
    );
}
