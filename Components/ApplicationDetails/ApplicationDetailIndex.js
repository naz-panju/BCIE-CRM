import React from 'react'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { LeadApi } from '@/data/Endpoints/Lead';
import { useState } from 'react';
import moment from 'moment';
import { Button, Grid, Skeleton, Tooltip } from '@mui/material';
import { LaunchOutlined, PieChart } from '@mui/icons-material';
import Link from 'next/link';


import toast from 'react-hot-toast';
import ApplicationVerticalTabs from './ApplicationTab';
import { ApplicationApi } from '@/data/Endpoints/Application';
import ApplicationStageChangeModal from '../Applications/Modals/stageChange';
import SendMail from '../LeadDetails/Modals/SendMail';
import SendWhatsApp from '../LeadDetails/Modals/SendWhatsapp';
import AlumniConfirmConfirmPopup from './Modals/ArchiveConfirmation';


function ApplicationDetails() {

  const [details, setDetails] = useState()
  const [leaddetails, setleaddetails] = useState()
  const [refresh, setRefresh] = useState(false)
  const [loading, setLoading] = useState(false)

  const [editId, setEditId] = useState()

  const [mailId, setMailId] = useState()

  const [whatsappId, setWhatsappId] = useState()

  const [stageId, setStageId] = useState()


  const [confirmId, setconfirmId] = useState()
  const [confirmLoading, setconfirmLoading] = useState(false)


  const router = useRouter()
  const urlID = router?.query?.slug

  const getDetails = async () => {
    setLoading(true)
    try {
      // console.log(urlID);
      const response = await ApplicationApi.view({ id: urlID })
      const leadResponse = await LeadApi.view({ id: response?.data?.data?.lead_id })
      // console.log(response);
      setDetails(response?.data?.data)
      setleaddetails(leadResponse?.data?.data)
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

  const handleOpenStageModal = () => {
    setStageId(0)
  }

  const handleConfirmOpen = () => {
    setconfirmId(details?.student?.id)
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

  const handleOpenWhatsappModal = () => {
    setWhatsappId(0)
  }


  const handleRefresh = () => {
    setRefresh(!refresh)
  }

  useEffect(() => {
    getDetails()
  }, [refresh])


  console.log(details);

  return (

    <>
      {/* <ConvertLeadToStudent details={details} editId={editId} setEditId={setEditId} leadId={urlID} refresh={refresh} setRefresh={setRefresh} /> */}
      <ApplicationStageChangeModal details={details} editId={stageId} setEditId={setStageId} leadId={urlID} refresh={refresh} setRefresh={setRefresh} />

      <SendMail from={'app'} app_id={details?.id}  details={details} lead_id={details?.lead_id} editId={mailId} setEditId={setMailId} refresh={refresh} setRefresh={handleRefresh}  />
      <SendWhatsApp from={'app'} app_id={details?.id} details={details} lead_id={details?.lead_id} editId={whatsappId} setEditId={setWhatsappId} refresh={refresh} setRefresh={handleRefresh}  />

      {/* <AlumniConfirmConfirmPopup getDetails={getDetails} loading={confirmLoading} ID={confirmId} setID={setconfirmId} setLoading={setconfirmLoading} title={`${details?.student?.first_name} ${details?.student?.last_name}`} details={details} /> */}


      <section>
        <div className='page-title-block'>
          <div className='page-title-block-content justify-between'>
            <h1>Application Details</h1>

            {/* disabled={details?.verification_status == 'Yes'} */}
            <Grid>
              <Button sx={{ mr: 2 }} onClick={details && handleOpenMailModal} variant='contained' className='bg-sky-300 text-white hover:bg-sky-500 text-white'>Send Mail</Button>
              {/* <Tooltip title={!details?.whatsapp_number && 'Whatsapp Number not Found'}>
                <Button sx={{ mr: 2 }} onClick={details && handleOpenWhatsappModal} disabled={!details?.whatsapp_number} variant='contained' className='bg-sky-400 text-white hover:bg-sky-600 text-white'>Send Whatsapp</Button>
              </Tooltip> */}
              {
                details?.student?.whatsapp_number ?
                  <Button variant='contained' disabled={!details?.student?.whatsapp_number} onClick={handleOpenWhatsappModal} className='bg-sky-500 mr-4' sx={{ color: 'white', '&:hover': { backgroundColor: '#0c8ac2' } }}>Send Whatsapp</Button>
                  :
                  <Tooltip title="Whatsapp Number not Found" >
                    <a>
                      <Button variant='contained' disabled={true} className='bg-sky-500 mr-4' sx={{ color: 'white', '&:hover': { backgroundColor: '#0c8ac2' } }}>Send Whatsapp</Button>
                    </a>
                  </Tooltip>
              }
              <Button sx={{ mr: 2 }} onClick={details && handleOpenStageModal} variant='contained' className='bg-sky-500 text-white hover:bg-sky-600 text-white'>Change Stage</Button>
              {/* <Button sx={{ mr: 2 }} disabled={details?.verification_status == 'Yes'} onClick={details && handleStudentModalOpen} variant='contained' className='bg-sky-600 text-white hover:bg-sky-700 text-white'>Convert To Student</Button> */}
              {/* <Button onClick={details && handleConfirmOpen} variant='contained' className='bg-sky-800 text-white hover:bg-sky-900 text-white'>Convert to Alumini</Button> */}
            </Grid>
          </div>
        </div>
        <div className='content-block-details'>
          <div className='content-block-top'>
            <div className='flex mar-10'>
              <div className='w-full md:w-4/12 lg:w-4/12 pad-10 '>

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
                                details?.student?.name && details?.student?.name[0]
                            }
                          </div>
                        </div>
                        <div className="tileCellDiv">

                          {
                            loading ?
                              <Skeleton variant="rectangular" width={150} height={30} />
                              :
                              <h4>{details?.student?.name}</h4>
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
                          details?.student?.email &&
                          <p>University: {details?.university?.name}</p>
                      }
                      {
                        loading ?
                          <Skeleton sx={{ mt: 1 }} variant="rectangular" width={250} height={20} />
                          :
                          details?.student?.email &&
                          <p>Email: {details?.student?.email}</p>
                      }

                      {
                        loading ?
                          <Skeleton sx={{ mt: 1 }} variant="rectangular" width={250} height={20} />
                          :
                          details?.student?.phone_number &&
                          <p>Mobile: +{details?.student?.phone_number}</p>
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

                      {
                        loading ?
                          <Skeleton sx={{ mt: 1 }} variant="rectangular" width={250} height={20} />
                          :
                          <p className=''><Link href={`/lead/${details?.lead_id}`} className='text-sky-500' >Go to Lead Detail <LaunchOutlined fontSize='small' /></Link></p>
                      }
                    </div>
                  </>
                  {/* } */}

                </div>


              </div>


              <div className='w-full md:w-8/12 lg:w-8/12 pad-10 '>
                <div className='lead-status-block'>
                  <div className='lead-communication-status'>
                    <h4>Communication Status</h4>
                    <ul>
                      <li>Email Sent - <span>5</span></li>
                      <li>SMS Sent - <span>1</span></li>
                      <li>Whatsapp Sent - <span>0</span></li>
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

                  {/* <div className='lead-communication-status'>
                    <h4>Lead Source</h4>
                    <ul>
                      <li>{leaddetails?.lead_source?.name || 'NA'}</li>
                    </ul>
                  </div>

                  <div className='lead-communication-status'>
                    <h4>Assigned Counsellor</h4>
                    <ul>
                      <li>{leaddetails?.assignedToUser?.name || 'NA'}</li>
                    </ul>
                  </div> */}

                </div>
              </div>
            </div>
          </div>


          <div className='lead-details-stepper-block'>


            {/* <div className="arrow-steps clearfix fadeIn">
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
            </div> */} 


          </div>

          <ApplicationVerticalTabs data={details} leadDetails={leaddetails} refresh={refresh} setRefresh={setRefresh} loading={loading} handleRefresh={handleRefresh} />

        </div>
      </section>
    </>
  )
}

export default ApplicationDetails



