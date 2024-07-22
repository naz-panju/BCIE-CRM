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
import LeadTimeline from './Tabs/LeadTimeline';
import LeadFollowUp from './Tabs/LeadFollowUp';
import LeadCommunicationLog from './Tabs/communication/LeadCommunicationLog'
import { useState } from 'react';
import { useEffect } from 'react';
import CreateLead from '../Lead/Create/Create';
import LeadDocuments from './Tabs/document/LeadDocuments';
import { Skeleton } from '@mui/material';
import LeadDetail from './Tabs/LeadDetail';
import LeadApplication from './Tabs/application/LeadApplication';
import { Apps, Payment, SchoolOutlined, TaskSharp } from '@mui/icons-material';
import FollowUp from './Tabs/follow-up/LeadFollowup';
import LeadTask from './Tabs/LeadTask';
import LeadPayments from './Tabs/payments/LeadPayments';
import StudentDetail from './Tabs/StudentDetail';
import ConvertLeadToStudent from './Modals/ConvertToStudent';
import { useRouter } from 'next/router';

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

export default function VerticalTabs({ data, refresh, setRefresh, loading, handleRefresh, handleStudentModalOpen, setFollowRefresh, followRefresh, phoneCallRefresh, setphoneCallRefresh, taskRefresh, handleTaskRefresh, toNoteTab, setToNoteTab, toTaskTab, setToTaskTab,appRefresh }) {
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState()

  const [studentEditId, setstudentEditId] = useState()

  const router = useRouter()


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEdit = () => {
    setEditId(data?.id)
  }

  const handleStudentEdit = () => {
    setstudentEditId(data?.student?.id)
  }


  // console.log(data);

  const [isClient, setIsClient] = useState(false);

  let TabData = [
    {
      label: 'Lead Details',
      component: isClient && (
        <LeadDetail handleEdit={handleEdit} data={data} loading={loading} />
      ),
      icon: <PermIdentityIcon />
    },

    {
      label: 'Timeline',
      component: <LeadTimeline from='lead' lead_id={data?.id} refresh={refresh} />,
      icon: <AccessTimeIcon />
    },
    {
      label: 'Notes',
      component: <FollowUp from='lead' data={data} lead_id={data?.id} refresh={followRefresh} setRefresh={setFollowRefresh} />,
      icon: <ChecklistIcon />
    },
    {
      label: 'Communication Logs',
      component: <LeadCommunicationLog leadData={data} refresh={refresh} setDetailRefresh={setRefresh} from='lead' lead_id={data?.id} phoneCallRefresh={phoneCallRefresh} setphoneCallRefresh={setphoneCallRefresh} />,
      icon: <ChatBubbleOutlineIcon />
    },
    {
      label: 'Documents',
      component: <LeadDocuments from='lead' lead_id={data?.id} leadData={data} />,
      icon: <FolderOpenIcon />
    },
    {
      label: 'Payments',
      component: <LeadPayments from='lead' lead_id={data?.id} />,
      icon: <Payment />
    },
    {
      label: 'Task',
      component: <LeadTask from='lead' lead_id={data?.id} taskRefresh={taskRefresh} handleTaskRefresh={handleTaskRefresh} detailRefresh={handleRefresh} />,
      icon: <TaskSharp />
    },
    {
      label: 'Applications',
      component: <LeadApplication setDetailRefresh={setRefresh} from='lead' data={data} lead_id={data?.id} handleStudentModalOpen={handleStudentModalOpen} handleLeadRefresh={handleRefresh} appRefresh={appRefresh} />,
      icon: <Apps />
    },
  ]

  // if (data?.student) {
  //   const newTab = {
  //     label: 'Applicant Details',
  //     component: isClient && <StudentDetail handleEdit={handleStudentEdit} data={data} loading={loading} handleRefresh={handleRefresh} />,
  //     icon: <SchoolOutlined />
  //   };
  //   TabData.splice(1, 0, newTab);
  // }



  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (router?.query?.app_id) {
      setValue(8)
    }
  }, []);

  useEffect(() => {
    if (toNoteTab) {
      setValue(2)
      setToNoteTab(false)
    }
  }, [toNoteTab]);

  useEffect(() => {
    if (toTaskTab) {
      setValue(6)
      setToTaskTab(false)
    }
  }, [toTaskTab]);

  return (
    <>
      <CreateLead from='lead' editId={editId} setEditId={setEditId} refresh={refresh} setRefresh={setRefresh} />
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
              <Tab key={index} className='lead-tab-item' label={obj?.label} {...a11yProps(index)} />

            ))
          }

          {/* icon={obj?.icon} */}
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