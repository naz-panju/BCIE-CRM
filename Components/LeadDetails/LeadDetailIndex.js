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


                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-50'>

                        <div>
                          {
                            loading ?
                              <Skeleton sx={{ mt: 1 }} variant="rectangular" width={250} height={20} />
                              :
                              details?.email &&
                              <p><label>Email:</label> <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
                                <path d="M2.875 7.66675L10.3906 12.6771C11.0624 13.125 11.9376 13.125 12.6094 12.6771L20.125 7.66675M4.875 18.2084H18.125C19.2296 18.2084 20.125 17.313 20.125 16.2084V6.79175C20.125 5.68718 19.2296 4.79175 18.125 4.79175H4.875C3.77043 4.79175 2.875 5.68718 2.875 6.79175V16.2084C2.875 17.313 3.77043 18.2084 4.875 18.2084Z" stroke="#0B0D23" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                              </svg> {details?.email}</p>
                          }
                        </div>

                        <div>
                          {
                            loading ?
                              <Skeleton sx={{ mt: 1 }} variant="rectangular" width={250} height={20} />
                              :
                              details?.phone_number &&
                              <p><label>Mobile:</label>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                  <path d="M3.44487 4.96848C4.2382 10.8128 9.18786 15.7625 15.0322 16.5558C15.9769 16.684 16.8019 15.9937 16.9889 15.0589L17.2011 13.9979C17.3779 13.1135 16.941 12.2202 16.1343 11.8168L15.3326 11.416C14.6578 11.0786 13.8383 11.272 13.3856 11.8756C13.0908 12.2687 12.6173 12.5083 12.1641 12.3184C10.6066 11.6655 8.33517 9.394 7.68229 7.83651C7.49233 7.38336 7.73199 6.90983 8.12507 6.61502C8.72861 6.16236 8.92208 5.34285 8.58468 4.66807L8.18381 3.86632C7.78047 3.05963 6.88711 2.62271 6.00272 2.79959L4.94175 3.01178C4.0069 3.19875 3.31663 4.02378 3.44487 4.96848Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>  +{details?.phone_country_code} {details?.phone_number}</p>
                          }
                        </div>

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
                <div className='student-vari-block'>


                  <div className='flex align-items-center justify-content-between'>

                    <div className='vari-left'>
                      <div className='vari-left-cap'>
                        <h5>10%</h5>
                        <label>Complete</label>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="129" height="129" viewBox="0 0 129 129" fill="none">
                        <g filter="url(#filter0_d_1041_732)">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M64.5 10.05C75.2692 10.05 85.7965 13.2434 94.7508 19.2265C103.705 25.2095 110.684 33.7134 114.805 43.6629C118.926 53.6123 120.005 64.5604 117.904 75.1227C115.803 85.6849 110.617 95.387 103.002 103.002C95.387 110.617 85.6849 115.803 75.1227 117.904C64.5604 120.005 53.6123 118.926 43.6629 114.805C33.7134 110.684 25.2095 103.705 19.2265 94.7508C13.2434 85.7965 10.05 75.2692 10.05 64.5H4C4 66.6155 4.1109 68.7225 4.33023 70.813C5.3515 80.5471 8.72355 89.9218 14.1961 98.112C20.8439 108.061 30.2927 115.816 41.3476 120.395C52.4026 124.974 64.5671 126.172 76.3029 123.837C88.0388 121.503 98.8189 115.741 107.28 107.28C115.741 98.8189 121.503 88.0388 123.837 76.3029C126.172 64.5671 124.974 52.4026 120.395 41.3476C115.816 30.2927 108.061 20.8439 98.112 14.1961C89.9218 8.72355 80.5471 5.3515 70.813 4.33023C68.7225 4.1109 66.6155 4 64.5 4V10.05Z" fill="url(#paint0_linear_1041_732)" />
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
                            <stop stop-color="#04FFFF" />
                            <stop offset="1" stop-color="#0029FF" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                    <div className='vari-center'>
                      <span>Application Status</span>
                      <h4>Verifying Student Details..</h4>
                    </div>


                    <div className='vari-right'>
                      <a>Change Status</a>
                    </div>


                  </div>

                  <div className='stage_track_cntr'>  
<div className='stage_track'>  
    <ul>
      <li className='opened'> </li>
      <li> </li>
      <li> </li>
      <li>   </li>
      <li> </li>
    </ul>
  <div className='track-range'></div> 
</div>
<ul className='tract-names'>
      <li>Unverified</li>
      <li>Verified</li>
      <li>Started</li>
      <li>Payment Approved</li>
      <li>Submitted</li>
    </ul>
</div>
                  
                </div>


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



            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">


              <div>

                <div className='lead-communication-status'>
                  <h4>Communication Status</h4>
                  <div className='lead-communication-status-bg'>

                    <ul>
                      <li><span>5</span> <p> Email Sent  </p> <a className='btn'>Send Mail</a></li>
                      {/* <li>SMS Sent - <span>1</span></li> */}
                      <li><span>0</span> <p> Whatsapp Sent  </p> <a className='btn'>  Send Whatsapp </a></li>
                    </ul>
                  </div>
                </div>


              </div>


              <div>
                <div className='lead-communication-status'>
                  <h4>Upcoming Followup</h4>
                  <div className='lead-communication-status-bg'>
                    <ul>
                      <li>NA</li>
                    </ul>
                    <p><a className='btn'>Add Followup</a>
                      <a className='btn'>  Add Note </a>
                    </p>
                  </div>
                </div>
              </div>


              <div>



                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">


                  <div>
                    <div className='lead-communication-status'>
                      <h4>Lead Source</h4>
                      <div className='lead-communication-status-bg'>
                        <ul>
                          <li>{details?.lead_source?.name || 'NA'}</li>
                        </ul>
                      </div>
                    </div>
                  </div>


                  <div>
                    <div className='lead-communication-status'>
                      <h4>Assigned Counsellor</h4>
                      <div className='lead-communication-status-bg'>
                        <ul>
                          <li>{details?.assignedToUser?.name || 'NA'}</li>
                        </ul>
                      </div>
                    </div>
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

          <div className='lead-det-cnt'>

            <LeadTab data={details} refresh={refresh} setRefresh={setRefresh} loading={loading} handleRefresh={handleRefresh} handleStudentModalOpen={handleStudentModalOpen} followRefresh={followRefresh} setFollowRefresh={setFollowRefresh} />
          </div>
        </div>
      </section>
    </>
  )
}

export default LeadDetails



