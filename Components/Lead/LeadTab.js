import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PhoneIcon from '@mui/icons-material/Phone';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChecklistIcon from '@mui/icons-material/Checklist';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import PostAddIcon from '@mui/icons-material/PostAdd';
import EditNoteIcon from '@mui/icons-material/EditNote';
import LeadTimeline from './LeadTimeline';
import LeadFollowUp from './LeadFollowUp';
import LeadCommunicationLog from './LeadCommunicationLog'

function TabPanel(props) {
  const { children, value, index, ...other } = props;


  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}
    >
      <Tabs
        className='lead-tab'
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab className='lead-tab-item' icon={<PermIdentityIcon />} label="Lead Details " {...a11yProps(0)} />
        <Tab className='lead-tab-item' icon={<AccessTimeIcon />} label="Timeline" {...a11yProps(1)} />
        <Tab className='lead-tab-item' icon={<ChecklistIcon />} label="Follow up & Notes" {...a11yProps(2)} />
        <Tab className='lead-tab-item' icon={<ChatBubbleOutlineIcon />} label="Communication Logs" {...a11yProps(3)} />
        <Tab className='lead-tab-item' icon={<FolderOpenIcon />} label="Document Locker" {...a11yProps(4)} />
        <Tab className='lead-tab-item' icon={<PostAddIcon />} label="Tickets" {...a11yProps(5)} />
        <Tab className='lead-tab-item' icon={<PhoneIcon />} label="Call Logs" {...a11yProps(6)} />
      </Tabs>
      <TabPanel className='lead-tabpanel' value={value} index={0}>
        <div className='lead-tabpanel-content-block'>
            <div className='lead-tabpanel-content-block-title'>
                <h2>Lead Details</h2>
                <a className='edit-btn'><EditNoteIcon /></a>
            </div>
            <div className='lead-tabpanel-content-item'>
                <div class="lead-details-list">
                    <label>Form Interested In </label>: Manipal Academy of Higher Education, India
                </div>

                <div class="lead-details-list">
                    <label>Email Address </label>: bas.baarma@fikrgs.edu.sa
                </div>

                <div class="lead-details-list">
                    <label>Mobile Number  </label>: +91- 8888888888
                </div>

                <div class="lead-details-list">
                    <label>Alternate Mobile Number </label>: NA
                </div>

                <div class="lead-details-list">
                    <label>Name </label>: Basma
                </div>

                <div class="lead-details-list">
                    <label>Country Applying For </label>: India
                </div>

                <div class="lead-details-list">
                    <label>Institute Applying For </label>: Manipal Academy of Higher Education (MAHE), India
                </div>

                <div class="lead-details-list">
                    <label>Lead Stage </label>: Hot
                </div>

                <div class="lead-details-list">
                    <label>Forms Applied </label>: Manipal Academy of Higher Education, India
                </div>
                

            </div>

        </div>
      </TabPanel>

      <TabPanel className='lead-tabpanel' value={value} index={1}>
        <LeadTimeline />
      </TabPanel>

      <TabPanel className='lead-tabpanel' value={value} index={2}>
        <LeadFollowUp />
      </TabPanel>
      <TabPanel className='lead-tabpanel' value={value} index={3}>
        <LeadCommunicationLog />
      </TabPanel>
      <TabPanel className='lead-tabpanel' value={value} index={4}>
        
      <div className='lead-tabpanel-content-block'>
            <div className='lead-tabpanel-content-block-title'>
                <h2>Lead Details</h2>
            </div>
            <div className='no-follw-up-block'>
                <h4>You have no follow-ups<br />
and Remarks for Basma</h4>
            </div>
        </div>



      </TabPanel>
      <TabPanel className='lead-tabpanel' value={value} index={5}>
        Item Six
      </TabPanel>
      <TabPanel className='lead-tabpanel' value={value} index={6}>
        Item Seven
      </TabPanel>
    </Box>
  );
}