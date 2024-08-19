import React from 'react'
import LeadTab from './LeadTab'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { LeadApi } from '@/data/Endpoints/Lead';
import { useState } from 'react';
import moment from 'moment';
import { Button, Grid, Skeleton, Tooltip } from '@mui/material';
import { PieChart, SettingsBackupRestoreOutlined } from '@mui/icons-material';
import ConvertLeadToStudent from './Modals/ConvertToStudent';
import BasicPie from './Chart/Pie';
import SendMail from './Modals/SendMail';
import ConfirmPopup from '../Common/Popup/confirm';
import toast from 'react-hot-toast';
import ArchiveConfirmPopup from './Modals/ArchiveConfirmation';
import StageChangeModal from './Modals/StageChange';
import SendWhatsApp from './Modals/SendWhatsapp';
import FollowUpModal from './Tabs/follow-up/create';
import LeadNoteModal from './Tabs/follow-up/noteCreate';
import { CommunicationLogApi } from '@/data/Endpoints/CommunicationLog';
import { PhoneCallApi } from '@/data/Endpoints/PhoneCall';
import { ListingApi } from '@/data/Endpoints/Listing';
import PhoneCallModal from './Tabs/communication/Modals/SummaryModal';
import CreateTask from '../Task/Create/Create';
import AssignLeadModal from '../Lead/Modal/AssignModal';
import UnArchiveConfirmPopup from './Modals/UnarchiveConfirmation';
import { useSession } from 'next-auth/react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import WithdrawPopup from './Modals/WithdrawConfirmModal';

function LeadDetails() {

  const session = useSession()


  const [details, setDetails] = useState()
  const [refresh, setRefresh] = useState(false)
  const [loading, setLoading] = useState(true)
  const [disabled, setdisabled] = useState(false)
  const [followRefresh, setFollowRefresh] = useState(false)

  const [editId, setEditId] = useState()

  const [mailId, setMailId] = useState()

  const [stageId, setStageId] = useState()

  const [whatsappId, setWhatsappId] = useState()

  const [followupId, setfollowupId] = useState()

  const [noteId, setNoteId] = useState()

  const [callDetails, setcallDetails] = useState()
  const [commDetails, setcommDetails] = useState()

  const [summaryLoading, setsummaryLoading] = useState(false)

  const [stages, setstages] = useState([])


  const [confirmId, setconfirmId] = useState()
  const [confirmLoading, setconfirmLoading] = useState(false)

  const [phonecallId, setphonecallId] = useState()


  const [phoneCallRefresh, setphoneCallRefresh] = useState(false)

  const [taskRefresh, settaskRefresh] = useState(false)
  const [taskId, settaskId] = useState()

  const [stageLength, setstageLength] = useState()

  const handlePhoneRefresh = () => {
    setphoneCallRefresh(!phoneCallRefresh)
  }
  const handlePhoneandDetailRefresh = () => {
    handlePhoneRefresh()
    setRefresh(!refresh)
  }

  const handleTaskRefresh = () => {
    settaskRefresh(!taskRefresh)
  }

  const handleTaskOpen = () => {
    settaskId(0)
  }

  const handlePhoneCallOpen = () => {
    setphonecallId(0)
  }

  const router = useRouter()
  const urlID = router?.query?.slug

  const getDetails = async () => {
    setLoading(true)
    try {
      // console.log(urlID);
      const response = await LeadApi.view({ id: urlID })
      // console.log(response);
      setDetails(response?.data?.data)
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  }

  // console.log(details);
  const handleStudentModalOpen = () => {
    setEditId(0)
  }

  const handleOpenMailModal = () => {
    if (details?.id) {
      setMailId(details?.id)
    }
  }

  const handleOpenWhatsappModal = () => {
    setWhatsappId(0)
  }

  const handleOpenStageModal = () => {
    setStageId(0)
  }

  const [unArchiveId, setunArchiveId] = useState()
  const handleConfirmOpen = () => {
    if (details?.closed != 1) {
      setconfirmId(details?.id)
    } else {
      setunArchiveId(details?.id)
    }
  }

  const [withdrawId, setwithdrawId] = useState()
  const handleWithdrawOpen = () => {
    setwithdrawId(details?.id)
  }

  const handleFollowupOpen = () => {
    setfollowupId(0)
  }

  const handleNoteOpen = () => {
    setNoteId(0)
  }

  const handleCloseAdmission = () => {
    setconfirmLoading(true)
    let dataToSubmit = {
      id: confirmId
    }
    LeadApi.closeLead(dataToSubmit).then((response) => {
      // console.log(response);
      if (response?.status == 200 || response?.status == 201) {
        toast.success(response?.data?.message)
        setconfirmId()
        getDetails()
        setconfirmLoading(false)
      } else {
        toast.error(response?.response?.data?.message)
        setconfirmLoading(false)
      }
    }).catch((error) => {
      console.log(error);
      setconfirmLoading(false)
    })
  }

  const handleRefresh = () => {
    setRefresh(!refresh)
  }


  const ID = router?.query?.slug


  const getSummary = async () => {

    setsummaryLoading(true)

    let params = {
      lead_id: ID,
    }

    const response = await CommunicationLogApi.summary(params)
    // console.log(response);
    setcommDetails(response?.data?.data)
    setsummaryLoading(false)
  }

  const getCallSummary = async () => {
    setsummaryLoading(true)
    let params = {
      lead_id: ID,
    }

    const response = await PhoneCallApi.summmary(params)
    // console.log(response);
    setcallDetails(response?.data?.data)
    setsummaryLoading(false)
  }
  const getStageList = () => {
    ListingApi.stages({ type: 'student' }).then((response) => {
      setstages(response?.data?.data)
    })
  }


  const getFirstLettersOfTwoWords = (name) => {
    if (name) {
      const words = name.split(" "); // Split the name into an array of words
      if (words.length >= 2) {
        // Extract the first letter of the first two words and concatenate them
        return words[0].charAt(0) + words[1].charAt(0);
      } else if (words.length === 1) {
        // If there's only one word, return its first letter
        return words[0].charAt(0);
      }
    }
    return ""; // Return an empty string if name is not provided
  };

  const [assignId, setAssignId] = useState()
  const [singleAssign, setsingleAssign] = useState(false)
  const [selected, setSelected] = useState([]);

  const handleSigleAssign = () => {
    setAssignId(0)
    setSelected([details?.id])
    setsingleAssign(true)
  }

  const [toNoteTab, setToNoteTab] = useState(false)
  const switchNoteTab = () => {
    setToNoteTab(true)
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  const [toTaskTab, setToTaskTab] = useState(false)
  const switchTaskTab = () => {
    setToTaskTab(true)
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  const [appRefresh, setappRefresh] = useState(false)

  const handleAppRefresh = () => {
    setappRefresh(!appRefresh)
  }

  function formatPercentage(value) {
    if (typeof value === 'number' && !isNaN(value)) {
      const valueString = value.toFixed(2);
      const [integerPart, decimalPart] = valueString.split('.');

      if (parseInt(decimalPart, 10) >= 50) {
        return parseInt(integerPart, 10) + 1;
      } else {
        return parseInt(integerPart, 10);
      }
    } else {
      return value;
    }
  }


  const loadDetails = () => {
    getDetails()
    handleAppRefresh()
  }

  useEffect(() => {
    getSummary()
    getCallSummary()
  }, [refresh, phoneCallRefresh])
  // useEffect(() => {
  //     getCallSummary()
  // }, [phoneCallRefresh])


  useEffect(() => {
    getDetails()
  }, [refresh, followRefresh])

  useEffect(() => {
    getStageList()
  }, [])

  console.log(details);
  

  const gradientId = 'myGradient';

  return (

    <>
      <ConvertLeadToStudent lead_id={details?.id} details={details} editId={editId} setEditId={setEditId} leadId={urlID} refresh={refresh} setRefresh={setRefresh} handleRefresh={handleRefresh} />
      <StageChangeModal details={details} editId={stageId} setEditId={setStageId} leadId={urlID} refresh={refresh} setRefresh={setRefresh} />

      <SendMail from={'lead'} details={details} lead_id={details?.id} editId={mailId} setEditId={setMailId} refresh={refresh} setRefresh={handleRefresh} />
      <SendWhatsApp details={details} lead_id={details?.id} editId={whatsappId} setEditId={setWhatsappId} refresh={refresh} setRefresh={handleRefresh} from={'lead'} />

      <PhoneCallModal lead_id={details?.id} editId={phonecallId} setEditId={setphonecallId} handleRefresh={handlePhoneandDetailRefresh} />

      <CreateTask lead_id={details?.id} from={'lead'} editId={taskId} setEditId={settaskId} refresh={refresh} setRefresh={settaskRefresh} handleRefresh={handleTaskRefresh} detailRefresh={handleRefresh} />

      {/* <FollowUpModal from={'lead'} lead_id={details?.id} refresh={followRefresh} setRefresh={setFollowRefresh} editId={followupId} setEditId={setfollowupId} data={details} /> */}
      <LeadNoteModal from={'lead'} lead_id={details?.id} refresh={followRefresh} setRefresh={setFollowRefresh} handleDetailRefresh={handleRefresh} editId={noteId} setEditId={setNoteId} />

      <ArchiveConfirmPopup getDetails={getDetails} loading={confirmLoading} ID={confirmId} setID={setconfirmId} setLoading={setconfirmLoading} title={`${details?.name}`} details={details} />
      <UnArchiveConfirmPopup getDetails={getDetails} loading={confirmLoading} ID={unArchiveId} setID={setunArchiveId} setLoading={setconfirmLoading} title={`${details?.name}`} details={details} />

      <AssignLeadModal single={singleAssign} setsingle={setsingleAssign} selected={selected} setSelected={setSelected} editId={assignId} setEditId={setAssignId} handleRefresh={handleRefresh} />

      <WithdrawPopup ID={withdrawId} setID={setwithdrawId} details={details} getDetails={loadDetails} title={details?.withdrawn == 1 ? `Resume ${details?.name}?` : `Withdraw ${details?.name}?`} />


      <section>
        <div className={`page-title-block`}>
          <div className='page-title-block-content justify-between'>
            <h1>Lead Details</h1>

            {/* disabled={details?.verification_status == 'Yes'} */}
            <Grid>
              {/* <Button sx={{ mr: 2 }} onClick={details && handleOpenMailModal} variant='contained' className='bg-sky-300 text-white hover:bg-sky-500 text-white'>Send Mail</Button> */}
              {/* <Tooltip title={!details?.whatsapp_number && 'Whatsapp Number not Found'}>
                <Button sx={{ mr: 2 }} onClick={details && handleOpenWhatsappModal} disabled={!details?.whatsapp_number} variant='contained' className='bg-sky-400 text-white hover:bg-sky-600 text-white'>Send Whatsapp</Button>
              </Tooltip> */}
              {/* {
                details?.whatsapp_number ?
                  <Button variant='contained' disabled={!details?.whatsapp_number} onClick={handleOpenWhatsappModal} className='bg-sky-500 mr-4' sx={{ color: 'white', '&:hover': { backgroundColor: '#0c8ac2' } }}>Send Whatsapp</Button>
                  :
                  <Tooltip title="Whatsapp Number not Found" >
                    <a>
                      <Button variant='contained' disabled={true} className='bg-sky-500 mr-4' sx={{ color: 'white', '&:hover': { backgroundColor: '#0c8ac2' } }}>Send Whatsapp</Button>
                    </a>
                  </Tooltip>
              } */}
              {/* <Button sx={{ mr: 2 }} onClick={details && handleOpenStageModal} variant='contained' className='bg-sky-500 text-white hover:bg-sky-600 text-white'>Change Stage</Button> */}
              {/* <Button sx={{ mr: 2 }} onClick={details && handleNoteOpen} variant='contained' className='bg-sky-600 text-white hover:bg-sky-700 text-white'>Add Note</Button>
              <Button sx={{ mr: 2 }} onClick={details && handleFollowupOpen} variant='contained' className='bg-sky-700 text-white hover:bg-sky-800 text-white'>Add Followup</Button> */}

              {
                session?.data?.user?.role?.id != 6 &&
                <Button onClick={details && handleConfirmOpen} variant='contained' className='bg-sky-800 text-white hover:bg-sky-900 text-white'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M6.59937 9H17.3994M6.59937 9C6.03932 9 5.75859 9 5.54468 9.10899C5.35652 9.20487 5.20365 9.35774 5.10778 9.5459C4.99878 9.75981 4.99878 10.04 4.99878 10.6001V15.8001C4.99878 16.9202 4.99878 17.4804 5.21677 17.9082C5.40852 18.2845 5.71426 18.5905 6.09058 18.7822C6.51798 19 7.07778 19 8.19569 19H15.8015C16.9194 19 17.4784 19 17.9058 18.7822C18.2821 18.5905 18.5893 18.2844 18.781 17.9081C18.9988 17.4807 18.9988 16.9216 18.9988 15.8037V10.591C18.9988 10.037 18.9988 9.75865 18.8904 9.5459C18.7945 9.35774 18.6409 9.20487 18.4528 9.10899C18.2389 9 17.9594 9 17.3994 9M6.59937 9H4.97409C4.125 9 3.7007 9 3.45972 8.85156C3.13813 8.65347 2.9558 8.29079 2.98804 7.91447C3.01222 7.63223 3.26495 7.29089 3.77124 6.60739C3.91768 6.40971 3.99092 6.31084 4.08055 6.23535C4.20006 6.1347 4.34188 6.06322 4.4939 6.02709C4.60791 6 4.73029 6 4.97632 6H19.0207C19.2667 6 19.3894 6 19.5034 6.02709C19.6555 6.06322 19.7972 6.1347 19.9168 6.23535C20.0064 6.31084 20.0799 6.40924 20.2263 6.60693C20.7326 7.29042 20.9858 7.63218 21.0099 7.91442C21.0422 8.29074 20.8592 8.65347 20.5376 8.85156C20.2966 9 19.8713 9 19.0222 9H17.3994M9.99878 14H13.9988" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {details?.closed == 1 ? 'UnArchive' : 'Archive'}</Button>
              }
              {
                session?.data?.user?.role?.id != 6 &&
                <Button onClick={details && handleWithdrawOpen} variant='contained' className='bg-sky-800 text-white hover:bg-sky-900 text-white ml-2'>
                  {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M6.59937 9H17.3994M6.59937 9C6.03932 9 5.75859 9 5.54468 9.10899C5.35652 9.20487 5.20365 9.35774 5.10778 9.5459C4.99878 9.75981 4.99878 10.04 4.99878 10.6001V15.8001C4.99878 16.9202 4.99878 17.4804 5.21677 17.9082C5.40852 18.2845 5.71426 18.5905 6.09058 18.7822C6.51798 19 7.07778 19 8.19569 19H15.8015C16.9194 19 17.4784 19 17.9058 18.7822C18.2821 18.5905 18.5893 18.2844 18.781 17.9081C18.9988 17.4807 18.9988 16.9216 18.9988 15.8037V10.591C18.9988 10.037 18.9988 9.75865 18.8904 9.5459C18.7945 9.35774 18.6409 9.20487 18.4528 9.10899C18.2389 9 17.9594 9 17.3994 9M6.59937 9H4.97409C4.125 9 3.7007 9 3.45972 8.85156C3.13813 8.65347 2.9558 8.29079 2.98804 7.91447C3.01222 7.63223 3.26495 7.29089 3.77124 6.60739C3.91768 6.40971 3.99092 6.31084 4.08055 6.23535C4.20006 6.1347 4.34188 6.06322 4.4939 6.02709C4.60791 6 4.73029 6 4.97632 6H19.0207C19.2667 6 19.3894 6 19.5034 6.02709C19.6555 6.06322 19.7972 6.1347 19.9168 6.23535C20.0064 6.31084 20.0799 6.40924 20.2263 6.60693C20.7326 7.29042 20.9858 7.63218 21.0099 7.91442C21.0422 8.29074 20.8592 8.65347 20.5376 8.85156C20.2966 9 19.8713 9 19.0222 9H17.3994M9.99878 14H13.9988" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg> */}
                  <SettingsBackupRestoreOutlined />

                  {details?.withdrawn == 1 ? 'Resume' : 'Withdraw'}</Button>
              }
            </Grid>
          </div>
        </div>
        <div className='content-block-details'>
          <div className='content-block-top'>


            <div className='flex mar-10'>
              <div className='w-full md:w-6/12 lg:w-6/12 pad-10 '>

                <div className='lead-top-details-block'>
                  {/* {
                    loading ?
                      <Skeleton variant="rectangular" width={'100%'} height={165} />
                      : */}
                  <>
                    <div className='lead-top-details-block-name'>
                      <div>
                        <div className="nameInitialsDiv">
                          <div className="nameInitials">
                            <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18.5 19.3264C17.8971 16.6041 15.6249 15 11.5001 15C7.37535 15 5.10289 16.6041 4.5 19.3264M11.5 22C17.299 22 22 17.299 22 11.5C22 5.70101 17.299 1 11.5 1C5.70101 1 1 5.70101 1 11.5C1 17.299 5.70101 22 11.5 22ZM11.5 11.5C13.0556 11.5 13.8333 10.6667 13.8333 8.58333C13.8333 6.5 13.0556 5.66667 11.5 5.66667C9.94444 5.66667 9.16667 6.5 9.16667 8.58333C9.16667 10.6667 9.94444 11.5 11.5 11.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {/*
                              loading ?
                                <Skeleton variant="circular" width={30} height={30} />
                                :
                                details?.name && details.name[0]
                    */ }
                          </div>
                        </div>
                        <div className="tileCellDiv">

                          {
                            loading ?
                              <Skeleton variant="rectangular" width={150} height={30} />
                              :
                              <h4>{details?.name}</h4>
                          }
                          {/* <div className="leadStageBox">  
                            {
                              loading ?
                                <Skeleton variant="rectangular" width={100} height={30} />
                                :
                                <a className="word-break leadStage lscommonTour">{details?.stage?.name}
                                  <span className="draw-edit" style={{ fontWeight: 600 }}></span>
                                </a>
                            }

                          </div> */}
                        </div>
                      </div>

                      <div className="tileCellDiv qr-code-scan text-right">
                        {/* {
                          loading ?
                            <Skeleton variant="rectangular" width={40} height={40} />
                            :
                            <div id="leadQrCode">
                              <a href="#" type="button" className=''><QrCode /><small className="text-dark">Scan from App</small></a>
                            </div>
                        } */}
                      </div>
                    </div>

                    <div className='lead-top-contact-details'>


                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-50'>

                        {
                          loading ?
                            <Skeleton sx={{ mt: 1 }} variant="rectangular" width={250} height={20} />
                            :
                            <div>
                              {details?.email &&
                              <p><label>Email:</label> <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
                                <path d="M2.875 7.66675L10.3906 12.6771C11.0624 13.125 11.9376 13.125 12.6094 12.6771L20.125 7.66675M4.875 18.2084H18.125C19.2296 18.2084 20.125 17.313 20.125 16.2084V6.79175C20.125 5.68718 19.2296 4.79175 18.125 4.79175H4.875C3.77043 4.79175 2.875 5.68718 2.875 6.79175V16.2084C2.875 17.313 3.77043 18.2084 4.875 18.2084Z" stroke="#0B0D23" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg> {details?.email}</p>}
                            </div>
                        }

                        {
                          loading ?
                            <Skeleton sx={{ mt: 1 }} variant="rectangular" width={250} height={20} />
                            :
                            <div>
                              <p><label>Mobile:</label>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                  <path d="M3.44487 4.96848C4.2382 10.8128 9.18786 15.7625 15.0322 16.5558C15.9769 16.684 16.8019 15.9937 16.9889 15.0589L17.2011 13.9979C17.3779 13.1135 16.941 12.2202 16.1343 11.8168L15.3326 11.416C14.6578 11.0786 13.8383 11.272 13.3856 11.8756C13.0908 12.2687 12.6173 12.5083 12.1641 12.3184C10.6066 11.6655 8.33517 9.394 7.68229 7.83651C7.49233 7.38336 7.73199 6.90983 8.12507 6.61502C8.72861 6.16236 8.92208 5.34285 8.58468 4.66807L8.18381 3.86632C7.78047 3.05963 6.88711 2.62271 6.00272 2.79959L4.94175 3.01178C4.0069 3.19875 3.31663 4.02378 3.44487 4.96848Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg> {details?.phone_number ? '+' + details?.phone_number : 'NA'} </p>
                            </div>
                        }

                      </div>







                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

                        <div>
                          {
                            loading ?
                              <Skeleton sx={{ mt: 1 }} variant="rectangular" width={250} height={20} />
                              :
                              details?.created_at &&
                              <p><span className='add-on'>Added On</span>  {moment(details?.created_at).format('DD MMM YYYY hh:mm A')}</p>
                          }
                        </div>

                        <div>
                          {
                            loading ?
                              <Skeleton sx={{ mt: 1 }} variant="rectangular" width={250} height={20} />
                              :
                              details?.updated_at &&
                              <p> <span className='last-on'> Last Active  </span>   {moment(details?.updated_at).format('DD MMM YYYY hh:mm A')}</p>
                          }
                        </div>

                      </div>





                    </div>
                  </>
                  {/* } */}

                </div>


              </div>

              <div className='w-full md:w-6/12 lg:w-6/12 pad-10 '>

                {
                  loading ?
                    <div className='student-vari-block'>
                      <Skeleton variant='rounded' width={'100%'} height={200} />
                    </div>
                    :
                    <div className='student-vari-block'>
                      <div className='flex align-items-center justify-content-between'>

                        <div className='vari-left'>
                          <div className='vari-left-cap'>
                            {/* {
                              stages?.map((obj, index) => {
                                let ind;
                                ind = stages.findIndex(obj =>
                                  obj.sub_stages.some(subStage =>
                                    subStage.name === details?.stage.name
                                  ) || obj.name === details?.stage.name
                                );
                                let finalIndex;
                                if (ind >= 0) {
                                  finalIndex = ind + 1
                                } else {
                                  ind = stages.findIndex(obj => obj?.name == details?.stage?.name)
                                  finalIndex = ind + 1
                                }

                                return (

                                  ind == index && */}
                            {/* <h5 key={index}>{finalIndex / stages?.length * 100}%</h5> */}
                            <h5 >{formatPercentage(details?.stage?.progress_percentage)}%</h5>
                            {/* )
                              })
                            } */}

                            {
                              stages?.length > 0 &&
                              <label>Complete</label>
                            }
                          </div>


                          {/* <RadialBarChartComponent /> */}

                          {/* <CircularProgressbar value={30} />; */}

                          <div style={{ width: 129, height: 129 }}>

                            {/* {
                              stages?.map((obj, index) => {
                                let ind;
                                ind = stages.findIndex(obj =>
                                  obj.sub_stages.some(subStage =>
                                    subStage.name === details?.stage.name
                                  ) || obj.name === details?.stage.name
                                );
                                let finalIndex;
                                if (ind >= 0) {
                                  finalIndex = ind + 1
                                } else {
                                  ind = stages.findIndex(obj => obj?.name == details?.stage?.name)
                                  finalIndex = ind + 1
                                }

                                return (

                                  ind == index && */}
                            {/* // <h5 key={index}>{finalIndex / stages?.length * 100}%</h5> */}
                            <React.Fragment >
                              <CircularProgressbar
                                // value={finalIndex / stages?.length * 100}
                                value={formatPercentage(details?.stage?.progress_percentage)}
                                strokeWidth={5}
                                styles={buildStyles({
                                  pathColor: 'url(#newGradient)',
                                  trailColor: 'transparent',
                                  // strokeLinecap: 'butt',
                                  pathTransitionDuration: 0.5,
                                  pathTransition: 'none',
                                  // rotation: 0.75,  // Adjust this value to start the progress from the top
                                })}
                              />
                              <svg width="0" height="0">
                                <defs>
                                  <linearGradient id="newGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#04FFFF" />
                                    <stop offset="100%" stopColor="#0029FF" />
                                  </linearGradient>
                                </defs>
                              </svg>
                            </React.Fragment>
                            {/* )
                              })
                            } */}

                          </div>

                          {/* <svg xmlns="http://www.w3.org/2000/svg" width="129" height="129" viewBox="0 0 129 129" fill="none">
                        <g filter="url(#filter0_d_1041_732)">
                          <path fillRule="evenodd" clipRule="evenodd" d="M64.5 10.05C75.2692 10.05 85.7965 13.2434 94.7508 19.2265C103.705 25.2095 110.684 33.7134 114.805 43.6629C118.926 53.6123 120.005 64.5604 117.904 75.1227C115.803 85.6849 110.617 95.387 103.002 103.002C95.387 110.617 85.6849 115.803 75.1227 117.904C64.5604 120.005 53.6123 118.926 43.6629 114.805C33.7134 110.684 25.2095 103.705 19.2265 94.7508C13.2434 85.7965 10.05 75.2692 10.05 64.5H4C4 66.6155 4.1109 68.7225 4.33023 70.813C5.3515 80.5471 8.72355 89.9218 14.1961 98.112C20.8439 108.061 30.2927 115.816 41.3476 120.395C52.4026 124.974 64.5671 126.172 76.3029 123.837C88.0388 121.503 98.8189 115.741 107.28 107.28C115.741 98.8189 121.503 88.0388 123.837 76.3029C126.172 64.5671 124.974 52.4026 120.395 41.3476C115.816 30.2927 108.061 20.8439 98.112 14.1961C89.9218 8.72355 80.5471 5.3515 70.813 4.33023C68.7225 4.1109 66.6155 4 64.5 4V10.05Z" fill="url(#paint0_linear_1041_732)" />
                        </g>
                        <defs>
                          <filter id="filter0_d_1041_732" x="0" y="0" width="129" height="129" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                            <feOffset />
                            <feGaussianBlur stdDeviation="2" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1041_732" />
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1041_732" result="shape" />
                          </filter>
                          <linearGradient id="paint0_linear_1041_732" x1="125" y1="13.7326" x2="9.78696" y2="130.787" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#04FFFF" />
                            <stop offset="1" stopColor="#0029FF" />
                          </linearGradient>
                        </defs>
                      </svg> */}

                        </div>

                        <div className='vari-center'>
                          <span>Application Status</span>
                          <h4>{details?.stage?.description}</h4>
                        </div>


                        <div className='vari-right'>
                        {/* || details?.stage?.action_type=='alumni' */}
                          {
                            session?.data?.user?.role?.id != 6 &&
                            !details?.user  &&
                            <a onClick={handleOpenStageModal}>Change Status</a>
                          }
                        </div>


                      </div>

                      {/* {
                    console.log(details)
                  } */}


                      <div className='stage_track_cntr'>
                        <div className='stage_track'>
                          <ul>
                            {
                              stages?.map((obj, index) => {
                                const isSubStage = obj?.sub_stages?.some(stage =>
                                  stage?.name === details?.stage?.name
                                );
                                return (
                                  <li key={index} className={isSubStage ? 'opened' : ''}></li>
                                )
                              })
                            }
                            {/* <li> </li>
                        <li> </li>
                        <li className='opened'> </li>
                        <li >   </li>
                        <li > </li> */}
                          </ul>

                          {/* {
                            stages?.map((obj, index) => {
                              let ind;
                              ind = stages.findIndex(obj =>
                                obj.sub_stages.some(subStage =>
                                  subStage.name === details?.stage.name
                                ) || obj.name === details?.stage.name
                              );
                              let finalIndex;
                              if (ind >= 0) {
                                finalIndex = ind + 1
                              } else {
                                ind = stages.findIndex(obj => obj?.name == details?.stage?.name)
                                finalIndex = ind + 1
                              }

                              return (

                                ind == index && */}


                          <div style={{ width: `${details?.stage?.progress_percentage}%` }} className='track-range'>
                          </div>
                          {/* )
                            })
                          } */}
                          {/* {
                        stages?.map((obj, index) => {
                          return (

                            <div key={index} style={{ width: `${stageLength + 1 / stages?.length * 100}%` }} className='track-range'>
                              )
                        
                        )
                      } */}


                        </div>
                        <ul className='tract-names'>
                          {
                            stages?.map((obj, index) => (
                              <li key={index}>{obj?.name}</li>
                            ))
                          }
                          {/* <li>Unverified</li> */}
                          {/* <li>Verified</li>
                      <li>Started</li>
                      <li>Payment Approved</li>
                      <li>Submitted</li> */}
                        </ul>
                      </div>

                    </div>
                }


              </div>





              {/*            

              <div className='w-full md:w-3/12 lg:w-3/12 pad-10 '>
                <div className='lead-score-block'>
                  <h3>30</h3>
                  <h4>Lead Score </h4>
                </div>

                 
              </div>



              <div className='w-full md:w-3/12 lg:w-3/12 pad-10 '>
                 

                <div className='generate-lead-block'>
                 
                  <div className='lead-percent-icon'>
                    <PieChart color='success' />
                  </div>
                  <h4>Generate Lead Strength</h4>
                </div>
              </div>  
            */}


            </div>



            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


              <div>

                <div className='lead-communication-status'>
                  <h4>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className='lead-ic'>
                      <path d="M5.59961 19.9203L7.12357 18.7012L7.13478 18.6926C7.45249 18.4384 7.61281 18.3101 7.79168 18.2188C7.95216 18.1368 8.12328 18.0771 8.2998 18.0408C8.49877 18 8.70603 18 9.12207 18H17.8031C18.921 18 19.4806 18 19.908 17.7822C20.2843 17.5905 20.5905 17.2842 20.7822 16.9079C21 16.4805 21 15.9215 21 14.8036V7.19691C21 6.07899 21 5.5192 20.7822 5.0918C20.5905 4.71547 20.2837 4.40973 19.9074 4.21799C19.4796 4 18.9203 4 17.8002 4H6.2002C5.08009 4 4.51962 4 4.0918 4.21799C3.71547 4.40973 3.40973 4.71547 3.21799 5.0918C3 5.51962 3 6.08009 3 7.2002V18.6712C3 19.7369 3 20.2696 3.21846 20.5433C3.40845 20.7813 3.69644 20.9198 4.00098 20.9195C4.35115 20.9191 4.76744 20.5861 5.59961 19.9203Z" stroke="#232648" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg> Communication Status

                    <a className='hide-sec' >
                      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                        <path d="M8.5 16.7C3.97127 16.7 0.299999 13.0287 0.299999 8.5C0.299999 3.97126 3.97127 0.299999 8.5 0.3C13.0287 0.3 16.7 3.97127 16.7 8.5C16.7 13.0287 13.0287 16.7 8.5 16.7Z" stroke="#898989" strokeWidth="0.6" />
                        <path d="M11.0007 8.00016L8.66732 10.3335L6.33398 8.00016" stroke="#898989" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </h4>
                  <div className='lead-communication-status-bg commu-txt'>

                    <ul>

                      {
                        summaryLoading ?
                          <li>
                            <h3>Emails</h3>
                            <div>
                              <span> <b>{commDetails?.email_receive_summary}</b> Received</span>
                              <span> <b>{commDetails?.email_send_summary}</b> Send</span>
                            </div>
                            {/*  <p><span><Skeleton width={'100%'} height={'100%'} variant='rounded' /></span>  Email Sent  </p>  */}

                            <a className='btn' onClick={details && handleOpenMailModal}>Send Mail</a>
                          </li>
                          :
                          <li>
                            <h3>Emails </h3>
                            <div>
                              <span> <b>{commDetails?.email_receive_summary}</b> Received</span>
                              <span> <b>{commDetails?.email_send_summary}</b> Send</span>
                            </div>
                            {/*  <p><span>{commDetails?.email_send_summary}</span>    Sent  </p> */}
                            {
                              session?.data?.user?.role?.id != 6 &&
                              <a className='btn' onClick={details && handleOpenMailModal}>Send Mail</a>
                            }
                          </li>
                      }

                      {/* <li>SMS Sent - <span>1</span></li> */}
                      <li>
                        <h3>Calls </h3>
                        <div>
                          <span> <b>{callDetails?.calls_inbound}</b> Inbound</span>
                          <span> <b>{callDetails?.calls_outbound}</b> Outbound</span>
                        </div>
                        {/*<p> <span>{commDetails?.whatsapp_send_summary}</span> Whatsapp Sent  </p> */}
                        {
                          session?.data?.user?.role?.id != 6 &&
                          <a className='btn' onClick={handlePhoneCallOpen} > Add Call Log </a>
                        }
                      </li>
                    </ul>
                  </div>
                </div>


              </div>


              <div>
                <div className='lead-communication-status'>
                  <h4><svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none" className='lead-ic'>
                    <path d="M1 7H17M1 7V15.8002C1 16.9203 1 17.4801 1.21799 17.9079C1.40973 18.2842 1.71547 18.5905 2.0918 18.7822C2.5192 19 3.07899 19 4.19691 19H13.8031C14.921 19 15.48 19 15.9074 18.7822C16.2837 18.5905 16.5905 18.2842 16.7822 17.9079C17 17.4805 17 16.9215 17 15.8036V7M1 7V6.2002C1 5.08009 1 4.51962 1.21799 4.0918C1.40973 3.71547 1.71547 3.40973 2.0918 3.21799C2.51962 3 3.08009 3 4.2002 3H5M17 7V6.19691C17 5.07899 17 4.5192 16.7822 4.0918C16.5905 3.71547 16.2837 3.40973 15.9074 3.21799C15.4796 3 14.9203 3 13.8002 3H13M13 1V3M13 3H5M5 1V3" stroke="#232648" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg> Upcoming Task
                    <a className='hide-sec'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                        <path d="M8.5 16.7C3.97127 16.7 0.299999 13.0287 0.299999 8.5C0.299999 3.97126 3.97127 0.299999 8.5 0.3C13.0287 0.3 16.7 3.97127 16.7 8.5C16.7 13.0287 13.0287 16.7 8.5 16.7Z" stroke="#898989" strokeWidth="0.6" />
                        <path d="M11.0007 8.00016L8.66732 10.3335L6.33398 8.00016" stroke="#898989" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </h4>
                  <div className='lead-communication-status-bg followup'>


                    <div className='d-flex align-items-center justify-content-between mb-30'>
                      <div>
                        <span>Date</span>
                        {
                          details?.latest_task ?
                            <Tooltip title={details?.latest_task?.title}>
                              <h5 className='a_hover' style={{ cursor: 'pointer' }} onClick={switchTaskTab}>{details?.latest_task?.due_date ?
                                moment(details?.latest_task?.due_date).format('DD-MM-YYYY')
                                :
                                details?.latest_task?.title
                              }
                              </h5>
                            </Tooltip>
                            :
                            <h5>NA</h5>
                        }

                      </div>
                      <div>
                        {
                          session?.data?.user?.role?.id != 6 &&
                          <a className='btn' onClick={details && handleTaskOpen} >Add Task</a>
                        }
                      </div>
                    </div>


                    <div className='d-flex align-items-center justify-content-between'>
                      <div>
                        <span>Note</span>

                        {
                          details?.latest_lead_note?.note ?

                            <h5 className='a_hover' style={{ cursor: 'pointer' }} onClick={switchNoteTab}>
                              {details.latest_lead_note.note.length > 20 ?
                                <Tooltip title={details.latest_lead_note.note}>
                                  {
                                    <a>{details.latest_lead_note.note.slice(0, 20) + '...'}</a>
                                  }
                                </Tooltip>
                                : details.latest_lead_note.note
                              }
                            </h5>
                            :
                            <h5>
                              NA
                            </h5>
                        }

                      </div>
                      <div>
                        {
                          session?.data?.user?.role?.id != 6 &&
                          <a className='btn' onClick={details && handleNoteOpen}>  Add Note </a>
                        }
                      </div>
                    </div>


                  </div>
                </div>
              </div>


              <div>



                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                  <div>
                    <div className='lead-communication-status'>
                      <h4><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className='lead-ic'>
                        <path d="M7.5 11.25L12.5 13.75M12.5 6.25L7.5 8.75M15 17.5C13.6193 17.5 12.5 16.3807 12.5 15C12.5 13.6193 13.6193 12.5 15 12.5C16.3807 12.5 17.5 13.6193 17.5 15C17.5 16.3807 16.3807 17.5 15 17.5ZM5 12.5C3.61929 12.5 2.5 11.3807 2.5 10C2.5 8.61929 3.61929 7.5 5 7.5C6.38071 7.5 7.5 8.61929 7.5 10C7.5 11.3807 6.38071 12.5 5 12.5ZM15 7.5C13.6193 7.5 12.5 6.38071 12.5 5C12.5 3.61929 13.6193 2.5 15 2.5C16.3807 2.5 17.5 3.61929 17.5 5C17.5 6.38071 16.3807 7.5 15 7.5Z" stroke="#0B0D23" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg> Lead Source</h4>
                      <div className='lead-communication-status-bg lead-hit-auto lead_source'>

                        <h5>{details?.lead_source?.name || 'NA'}</h5>

                      </div>
                    </div>
                  </div>


                  <div>
                    <div className='lead-communication-status'>
                      <h4><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none" className='lead-ic'>
                        <path d="M2.75 10.0834H7.33333M5.04167 12.3751V7.79175M13.2917 12.8334C16.694 12.8334 18.4644 14.0051 19.0377 16.3484C19.3002 17.4214 18.3546 18.3334 17.25 18.3334H9.33334C8.22877 18.3334 7.28316 17.4214 7.54565 16.3484C8.11894 14.0051 9.88932 12.8334 13.2917 12.8334ZM13.2917 9.16675C14.8194 9.16675 15.5833 8.38103 15.5833 6.41675C15.5833 4.45246 14.8194 3.66675 13.2917 3.66675C11.7639 3.66675 11 4.45246 11 6.41675C11 8.38103 11.7639 9.16675 13.2917 9.16675Z" stroke="#232648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg> Assigned Counsellor</h4>
                      <div className='lead-communication-status-bg lead-hit-auto assigned'>
                        {

                          !details ?
                            <p>NA</p>
                            :
                            details?.assignedToCounsellor ?
                              <p> {details?.assignedToCounsellor?.name && <span>{getFirstLettersOfTwoWords(details?.assignedToCounsellor?.name)}</span>} {details?.assignedToCounsellor?.name || 'NA'}</p>
                              :

                              session?.data?.user?.role?.id != 6 ?
                                <Button onClick={handleSigleAssign} sx={{ textTransform: 'none' }} variant='outlined' size='small'>Assign</Button>
                                :
                                'NA'
                        }



                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>

          <div className='lead-det-cnt'>

            <LeadTab data={details} refresh={refresh} setRefresh={setRefresh} loading={loading} handleRefresh={handleRefresh} handleStudentModalOpen={handleStudentModalOpen} followRefresh={followRefresh} setFollowRefresh={setFollowRefresh} phoneCallRefresh={phoneCallRefresh} setphoneCallRefresh={setphoneCallRefresh} taskRefresh={taskRefresh} handleTaskRefresh={handleTaskRefresh} toNoteTab={toNoteTab} setToNoteTab={setToNoteTab} toTaskTab={toTaskTab} setToTaskTab={setToTaskTab} appRefresh={appRefresh} />
          </div>
        </div>
      </section>
    </>
  )
}

export default LeadDetails



