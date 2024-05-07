import React from 'react'
import LeadTab from './LeadTab'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { LeadApi } from '@/data/Endpoints/Lead';
import { useState } from 'react';
import moment from 'moment';
import { Button, Grid, Skeleton, Tooltip } from '@mui/material';
import { PieChart } from '@mui/icons-material';
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


function LeadDetails() {

  const [details, setDetails] = useState()
  const [refresh, setRefresh] = useState(false)
  const [loading, setLoading] = useState(false)
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


  const [confirmId, setconfirmId] = useState()
  const [confirmLoading, setconfirmLoading] = useState(false)

  const [phoneCallRefresh, setphoneCallRefresh] = useState(false)



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
    setMailId(0)
  }

  const handleOpenWhatsappModal = () => {
    setWhatsappId(0)
  }

  const handleOpenStageModal = () => {
    setStageId(0)
  }

  const handleConfirmOpen = () => {
    setconfirmId(details?.id)
  }

  const handleFollowupOpen = () => {
    setfollowupId(0)
  }

  const handleNoteOpen = () => {
    setNoteId(0)
  }

  // console.log(details)

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
    let params = {
      lead_id: ID,
    }
    
    const response = await CommunicationLogApi.summary(params)
    // console.log(response);
    setcommDetails(response?.data?.data)
  }

  const getCallSummary = async () => {
    let params = {
      lead_id: ID,
    }
    
    const response = await PhoneCallApi.summmary(params)
    // console.log(response);
    setcallDetails(response?.data?.data)
  }

  useEffect(() => {
    getSummary()
    getCallSummary()
  }, [refresh])
  // useEffect(() => {
  //     getCallSummary()
  // }, [phoneCallRefresh])


  useEffect(() => {
    getDetails()
  }, [refresh])




  return (

    <>
      <ConvertLeadToStudent lead_id={details?.id} details={details} editId={editId} setEditId={setEditId} leadId={urlID} refresh={refresh} setRefresh={setRefresh} handleRefresh={handleRefresh} />
      <StageChangeModal details={details} editId={stageId} setEditId={setStageId} leadId={urlID} refresh={refresh} setRefresh={setRefresh} />

      <SendMail from={'lead'} details={details} lead_id={details?.id} editId={mailId} setEditId={setMailId} refresh={refresh} setRefresh={handleRefresh} />
      <SendWhatsApp details={details} lead_id={details?.id} editId={whatsappId} setEditId={setWhatsappId} refresh={refresh} setRefresh={handleRefresh} from={'lead'} />

      <FollowUpModal from={'lead'} lead_id={details?.id} refresh={followRefresh} setRefresh={setFollowRefresh} editId={followupId} setEditId={setfollowupId} data={details} />
      <LeadNoteModal from={'lead'} lead_id={details?.id} refresh={followRefresh} setRefresh={setFollowRefresh} editId={noteId} setEditId={setNoteId} />

      <ArchiveConfirmPopup getDetails={getDetails} loading={confirmLoading} ID={confirmId} setID={setconfirmId} setLoading={setconfirmLoading} title={`${details?.name}`} details={details} />


      <section>
        <div className={`page-title-block`}>
          <div className='page-title-block-content justify-between'>
            <h1>Lead Details</h1>

            {/* disabled={details?.verification_status == 'Yes'} */}
            <Grid>
              <Button sx={{ mr: 2 }} onClick={details && handleOpenMailModal} variant='contained' className='bg-sky-300 text-white hover:bg-sky-500 text-white'>Send Mail</Button>
              {/* <Tooltip title={!details?.whatsapp_number && 'Whatsapp Number not Found'}>
                <Button sx={{ mr: 2 }} onClick={details && handleOpenWhatsappModal} disabled={!details?.whatsapp_number} variant='contained' className='bg-sky-400 text-white hover:bg-sky-600 text-white'>Send Whatsapp</Button>
              </Tooltip> */}
              {
                details?.whatsapp_number ?
                  <Button variant='contained' disabled={!details?.whatsapp_number} onClick={handleOpenWhatsappModal} className='bg-sky-500 mr-4' sx={{ color: 'white', '&:hover': { backgroundColor: '#0c8ac2' } }}>Send Whatsapp</Button>
                  :
                  <Tooltip title="Whatsapp Number not Found" >
                    <a>
                      <Button variant='contained' disabled={true} className='bg-sky-500 mr-4' sx={{ color: 'white', '&:hover': { backgroundColor: '#0c8ac2' } }}>Send Whatsapp</Button>
                    </a>
                  </Tooltip>
              }
              <Button sx={{ mr: 2 }} onClick={details && handleOpenStageModal} variant='contained' className='bg-sky-500 text-white hover:bg-sky-600 text-white'>Change Stage</Button>
              <Button sx={{ mr: 2 }} onClick={details && handleNoteOpen} variant='contained' className='bg-sky-600 text-white hover:bg-sky-700 text-white'>Add Note</Button>
              <Button sx={{ mr: 2 }} onClick={details && handleFollowupOpen} variant='contained' className='bg-sky-700 text-white hover:bg-sky-800 text-white'>Add Followup</Button>
              <Button onClick={details && handleConfirmOpen} variant='contained' className='bg-sky-800 text-white hover:bg-sky-900 text-white'>{details?.closed == 1 ? 'UnArchive' : 'Archive'}</Button>
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
                            {
                              loading ?
                                <Skeleton variant="circular" width={30} height={30} />
                                :
                                details?.name && details.name[0]
                            }
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
                      {
                        loading ?
                          <Skeleton sx={{ mt: 1 }} variant="rectangular" width={250} height={20} />
                          :
                          details?.email &&
                          <p>Email: {details?.email}</p>
                      }

                      {
                        loading ?
                          <Skeleton sx={{ mt: 1 }} variant="rectangular" width={250} height={20} />
                          :
                          details?.phone_number &&
                          <p>Mobile: +{details?.phone_country_code} {details?.phone_number}</p>
                      }

                      {
                        loading ?
                          <Skeleton sx={{ mt: 1 }} variant="rectangular" width={250} height={20} />
                          :
                          details?.created_at &&
                          <p>Added On: {moment(details?.created_at).format('DD MMM YYYY hh:mm A')}</p>
                      }

                      {
                        loading ?
                          <Skeleton sx={{ mt: 1 }} variant="rectangular" width={250} height={20} />
                          :
                          details?.updated_at &&
                          <p>Last Active: {moment(details?.updated_at).format('DD MMM YYYY hh:mm A')}</p>
                      }

                    </div>
                  </>
                  {/* } */}

                </div>


              </div>



              <div className='w-full md:w-5/12 lg:w-6/12 pad-10 '>
                <div className='lead-status-block'>
                  <div className='lead-communication-status'>
                    <h4>Communication Status</h4>
                    <ul>
                      <li>Email Sent - <span>{commDetails?.email_send_summary}</span></li>
                      {/* <li>SMS Sent - <span>1</span></li> */}
                      <li>Whatsapp Sent - <span>{commDetails?.whatsapp_send_summary}</span></li>
                      <li>Call Inbound - <span>{callDetails?.calls_inbound}</span></li>

                    </ul>
                  </div>

                  <div className='lead-communication-status'>
                    <h4>Upcoming Followup</h4>
                    <ul>
                      <li>NA</li>
                    </ul>
                  </div>

                  {/* <div className='lead-communication-status'>
                    <h4>Telephony Status</h4>
                    <ul>
                      <li>Inbound Call - <span>0</span></li>
                      <li>Outbound Call - <span>0</span></li>
                    </ul>
                  </div> */}

                  <div className='lead-communication-status'>
                    <h4>Lead Source</h4>
                    <ul>
                      <li>{details?.lead_source?.name || 'NA'}</li>
                    </ul>
                  </div>

                  <div className='lead-communication-status'>
                    <h4>Assigned Counsellor</h4>
                    <ul>
                      <li>{details?.assignedToUser?.name || 'NA'}</li>
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          </div>


          <div className='lead-details-stepper-block'>


            <div className="arrow-steps clearfix fadeIn">
              <div className="step unverified filled">
                <span className="stepTitle">Unverified</span>
                <a tabIndex="0" className="stepsOpt" role="button" data-toggle="popover" data-trigger="focus" data-placement="top" data-container="body" data-content="Manipal Academy of Higher Education, India">1</a>
              </div>

              <div className="step verified prl10 pr0 filled">
                <span className="stepTitle">Verified</span>
              </div>

              <div className="step app-started active">
                <span className="stepTitle">Application Started</span>
              </div>

              <div className="step app-complete ">
                <span className="stepTitle">Payment Approved</span>
              </div>

              <div className="step app-submitted ">
                <span className="stepTitle">Application Submitted</span>
              </div>
            </div>


          </div>

          <LeadTab data={details} refresh={refresh} setRefresh={setRefresh} loading={loading} handleRefresh={handleRefresh} handleStudentModalOpen={handleStudentModalOpen} followRefresh={followRefresh} setFollowRefresh={setFollowRefresh} phoneCallRefresh={phoneCallRefresh} setphoneCallRefresh={setphoneCallRefresh} />

        </div>
      </section>
    </>
  )
}

export default LeadDetails



