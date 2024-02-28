import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';

function LeadDetail() {
  return (
    <section>
      <div className='page-title-block'>
        <div className='page-title-block-content'>
          <h1>Lead Details</h1>
        </div>
      </div>
      <div className='content-block'>
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
                      <h4>Basma</h4>
                      <div className="leadStageBox">
                        <a className="word-break leadStage lscommonTour">Hot&nbsp;
                          <span className="draw-edit" style={{fontWeight:600}}></span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="tileCellDiv qr-code-scan text-right">
                    <div id="leadQrCode">
                      <a href="#" type="button"><FontAwesomeIcon icon={faQrcode} /><small className="text-dark">Scan from App</small></a></div></div>
                </div>

                <div className='lead-top-contact-details'>
                  <p>Email: bas.baarma@fikrgs.edu.sa</p>
                  <p>Mobile: +91 8888888888</p>
                  <p>Added On: 01 Feb 2024 11:02 AM</p>
                  <p>Last Active: 01 Feb 2024 11:42 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

export default LeadDetail
