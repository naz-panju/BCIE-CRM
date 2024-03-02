import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import { faPercent } from '@fortawesome/free-solid-svg-icons';
import LeadTab from './LeadTab'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { LeadApi } from '@/data/Endpoints/Lead';
import { useState } from 'react';
import moment from 'moment';


function LeadDetails() {

  const [details, setDetails] = useState()
  const [refresh, setRefresh] = useState(false)


  const router = useRouter()
  const urlID = router?.query?.slug

  const getDetails = async () => {
    try {
      const response = await LeadApi.view({ id: urlID })
      console.log(response?.data?.data);
      setDetails(response?.data?.data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getDetails()
  }, [refresh])



  return (


    <section>
      <div className='page-title-block'>
        <div className='page-title-block-content'>
          <h1>Lead Details</h1>
        </div>
      </div>
      <div className='content-block-details'>
        <div className='content-block-top'>
          <div className='flex mar-10'>
            <div className='w-full md:w-4/12 lg:w-4/12 pad-10 '>
              <div className='lead-top-details-block'>
                <div className='lead-top-details-block-name'>
                  <div>
                    <div className="nameInitialsDiv">
                      <div className="nameInitials">B</div>
                    </div>
                    <div className="tileCellDiv">
                      <h4>{details?.name}</h4>
                      <div className="leadStageBox">
                        <a className="word-break leadStage lscommonTour">{details?.stage?.name}
                          <span className="draw-edit" style={{ fontWeight: 600 }}></span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="tileCellDiv qr-code-scan text-right">
                    <div id="leadQrCode">
                      <a href="#" type="button"><FontAwesomeIcon icon={faQrcode} /><small className="text-dark">Scan from App</small></a></div></div>
                </div>

                <div className='lead-top-contact-details'>
                  <p>Email: {details?.email}</p>
                  <p>Mobile: +{details?.phone_country_code} {details?.phone_number}</p>
                  <p>Added On: {moment(details?.created_at).format('DD MMM YYYY hh:mm A')}</p>
                  <p>Last Active: {moment(details?.updated_at).format('DD MMM YYYY hh:mm A')}</p>
                </div>
              </div>
            </div>

            <div className='w-full md:w-3/12 lg:w-2/12 pad-10 '>
              <div className='lead-score-block'>
                <h3>30</h3>
                <h4>Lead Score </h4>
              </div>

              <div className='generate-lead-block'>
                <div className='lead-percent-icon'>
                  <FontAwesomeIcon icon={faPercent} />
                </div>
                <h4>Generate Lead Strength</h4>
              </div>
            </div>

            <div className='w-full md:w-5/12 lg:w-6/12 pad-10 '>
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

                <div className='lead-communication-status'>
                  <h4>Telephony Status</h4>
                  <ul>
                    <li>Inbound Call - <span>0</span></li>
                    <li>Outbound Call - <span>0</span></li>
                  </ul>
                </div>

                <div className='lead-communication-status'>
                  <h4>Lead Source</h4>
                  <ul>
                    <li>Direct</li>
                  </ul>
                </div>

                <div className='lead-communication-status'>
                  <h4>Assigned Counsellor</h4>
                  <ul>
                    <li>NA</li>
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
              <a tabindex="0" className="stepsOpt" role="button" data-toggle="popover" data-trigger="focus" data-placement="top" data-container="body" data-content="Manipal Academy of Higher Education, India">1</a>
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

        <LeadTab data={details} refresh={refresh} setRefresh={setRefresh} />

      </div>
    </section>
  )
}

export default LeadDetails



