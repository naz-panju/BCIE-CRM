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
import { useEffect } from 'react';
import { WhatsAppTemplateApi } from '@/data/Endpoints/WhatsAppTemplate';


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

export default function WhatsAppTemplateDetailTabs({ id, close }) {
    const [value, setValue] = React.useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const [details, setDetails] = useState()
    const [loading, setLoading] = useState(false)

    const handleChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const getDetails = async () => {
        setLoading(true)
        try {
            const response = await WhatsAppTemplateApi.view({ id })
            if (response?.data?.data) {
                setDetails(response?.data?.data)
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
    ];

    return (
        <Box sx={{ width: '100%' }}>
            <Grid className='modal_title d-flex align-items-center' >
                <a className='back_modal' onClick={close}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                        <path d="M21.9582 15.5H9.0415M9.0415 15.5L14.2082 20.6666M9.0415 15.5L14.2082 10.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </a>

                <a className='back_modal_head'> Details</a>



                {/* <div className='communication-log-attachments-tab'>
                    <div onClick={() => setActiveTab(0)} className='communication-log-item '>
                        <div className={`lead-score-block-tab flex   ${activeTab == 0 ? 'lead-tab-active' : 'bg-trans'}`}>
                            <span style={{ color: 'white' }} >Details</span>
                        </div>
                    </div>
                </div> */}


            </Grid>
            {tabs.map((obj, index) => {
                return <TabPanel value={activeTab} index={index} key={index}>
                    {obj.component}
                </TabPanel>
            })}
        </Box>
    );
}
