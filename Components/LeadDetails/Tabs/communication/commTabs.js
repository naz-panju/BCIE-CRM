import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TabPanel from '@/utils/TabPanel';
import EmailTab from './tabs/email';
import WhatsappTab from './tabs/whatsapp';

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

export default function CreateTabs({ list,value,setValue,activeTab,setActiveTab,setEmailLimit,loading ,setwhatsappLimit,whatsappList}) {
    // const [value, setValue] = React.useState(0);
    // const [activeTab, setActiveTab] = useState(0);
    const handleChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const tabs = [
        {
            component: <EmailTab list={list} setEmailLimit={setEmailLimit} loading={loading} />,
            label: 'Email'
        },
        {
            component: <WhatsappTab list={whatsappList} setwhatsappLimit={setwhatsappLimit} loading={loading} />,
            label: 'Whatsapp'
        },
    ];

    return (
        <Box sx={{ width: '100%' }}>
            {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleChange} aria-label="basic tabs example" >
                    {tabs.map((obj, index) => (
                        <Tab label={obj.label} key={index} {...a11yProps(index)} sx={{ textTransform: 'none' }} />
                    ))}
                </Tabs>
            </Box> */}
            {tabs.map((obj, index) => {
                return <TabPanel value={activeTab} index={index} key={index}>
                    {obj.component}
                </TabPanel>
            })}
        </Box>
    );
}