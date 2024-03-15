import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Detail from './Tabs/Detail';
import { useState } from 'react';
import TabPanel from '@/utils/TabPanel';

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

export default function CreateTabs({ handleClose, refresh, setRefresh,editId,handleRefresh }) {
    const [value, setValue] = React.useState(0);
    const [activeTab, setActiveTab] = useState(0);

    const handleChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const tabs = [
        {
            component: <Detail editId={editId} handleClose={handleClose} refresh={refresh} setRefresh={setRefresh} handleRefresh={handleRefresh} />,
            label: 'Lead Details'
        },
    ];

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleChange} aria-label="basic tabs example" >
                    {tabs.map((obj, index) => (
                        <Tab label={obj.label} key={index} {...a11yProps(index)} sx={{ textTransform: 'none' }} />
                    ))}
                </Tabs>
            </Box>
            {tabs.map((obj, index) => {
                return <TabPanel value={activeTab} index={index} key={index}>
                    {obj.component}
                </TabPanel>
            })}
        </Box>
    );
}
