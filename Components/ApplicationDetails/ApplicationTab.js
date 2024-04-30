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
import LeadTimeline from '../LeadDetails/Tabs/LeadTimeline';
import LeadCommunicationLog from'../LeadDetails/Tabs/communication/LeadCommunicationLog'
import { useState } from 'react';
import { useEffect } from 'react';
import CreateLead from '../Lead/Create/Create';
import LeadDocuments from '../LeadDetails/Tabs/document/LeadDocuments';
import { Skeleton } from '@mui/material';
import LeadDetail from './Tabs/AppDetails';
import { Apps, Payment, SchoolOutlined, TaskSharp } from '@mui/icons-material';
import FollowUp from '../LeadDetails/Tabs/follow-up/LeadFollowup';
import LeadTask from '../LeadDetails/Tabs/LeadTask';
import LeadPayments from '../LeadDetails/Tabs/payments/LeadPayments';
import StudentDetail from '../LeadDetails/Tabs/StudentDetail';
import ConvertLeadToStudent from '../LeadDetails/Modals/ConvertToStudent';

function TabPanel(props) {
  const { children, value, index, ...other } = props;


  const [age, setAge] = React.useState('');



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

export default function ApplicationVerticalTabs({ data, refresh, setRefresh, loading,leadDetails,handleRefresh }) {
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState()

  const [studentEditId, setstudentEditId] = useState()

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEdit = () => {
    setEditId(data?.id)
  }

  const handleStudentEdit = () => {
    setstudentEditId(data?.student?.id)
  }

  const [isClient, setIsClient] = useState(false);

  const TabData = [
    // {
    //   label: 'Lead Details',
    //   component: isClient && (
    //     <LeadDetail handleEdit={handleEdit} data={leadDetails} appDetails={data} loading={loading} />
    //   ),
    //   icon: <PermIdentityIcon />
    // },
    // {
    //   label: 'Student Details',
    //   component: isClient && <StudentDetail handleEdit={handleStudentEdit} data={data} loading={loading} handleRefresh={handleRefresh} />,
    //   icon: <SchoolOutlined />
    // },
    {
      label: 'Timeline',
      component: isClient && <LeadTimeline from={'app'} lead_id={data?.lead_id} app_id={data?.id} />,
      icon: <AccessTimeIcon />
    },
    {
      label: 'Follow up & Notes',
      component: <FollowUp from={'app'} app_id={data?.id} data={data} lead_id={data?.id} />,
      icon: <ChecklistIcon />
    },
    {
      label: 'Communication Logs',
      component: <LeadCommunicationLog refresh={refresh} from={'app'} app_id={data?.id} data={data} lead_id={data?.lead_id} />,
      icon: <ChatBubbleOutlineIcon />
    },
    {
      label: 'Documents',
      component: <LeadDocuments lead_id={data?.lead_id} from={'app'} app_id={data?.id} app_details={data} appRefresh={handleRefresh} />,
      icon: <FolderOpenIcon />
    },
    {
      label: 'Payments',
      component: <LeadPayments from={'app'} app_id={data?.id} lead_id={data?.lead_id} />,
      icon: <Payment />
    },
    {
      label: 'Task',
      component: <LeadTask from={'app'} app_id={data?.id} lead_id={data?.id} />,
      icon: <TaskSharp />
    },
    // {
    //   label: 'Tickets',
    //   component: 'Item Six',
    //   icon: <PostAddIcon />
    // },
    // {
    //   label: 'Call Logs',
    //   component: 'Item Seven',
    //   icon: <PhoneIcon />
    // },
  ]

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <CreateLead editId={editId} setEditId={setEditId} refresh={refresh} setRefresh={setRefresh} />
      <ConvertLeadToStudent lead_id={data?.id} editId={studentEditId} setEditId={setstudentEditId} leadId={data?.id} refresh={refresh} setRefresh={setRefresh} handleRefresh={handleRefresh} />

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
          {
            TabData?.map((obj, index) => (
              <Tab key={index} className='lead-tab-item' icon={obj?.icon} label={obj?.label} {...a11yProps(index)} />
            ))
          }
        </Tabs>
        {
          TabData?.map((obj, index) => (
            <TabPanel key={index} className='lead-tabpanel' value={value} index={index}>
              {obj?.component}
            </TabPanel>
          ))
        }
        {/* <TabPanel className='lead-tabpanel' value={value} index={0}>

          {
            isClient && (
              <LeadDetail handleEdit={handleEdit} data={data} loading={loading} />
            )
          }
        </TabPanel>

        <TabPanel className='lead-tabpanel' value={value} index={1}>
          <LeadTimeline id={data?.id} />
        </TabPanel>

        <TabPanel className='lead-tabpanel' value={value} index={2}>
          <LeadFollowUp />
        </TabPanel>
        <TabPanel className='lead-tabpanel' value={value} index={3}>
          <LeadCommunicationLog />
        </TabPanel>
        <TabPanel className='lead-tabpanel' value={value} index={4}>
          <LeadDocuments id={data?.id} />
        </TabPanel>
        <TabPanel className='lead-tabpanel' value={value} index={5}>
          Item Six
        </TabPanel>
        <TabPanel className='lead-tabpanel' value={value} index={6}>
          Item Seven
        </TabPanel> */}
      </Box>
    </>
  );
}