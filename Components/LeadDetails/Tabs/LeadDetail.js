import React from 'react'
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Skeleton } from '@mui/material';

function LeadDetail({ data, handleEdit, loading }) {
    return (
        <div className='lead-tabpanel-content-block'>
            <div className='lead-tabpanel-content-block-title'>
                <h2>Lead Details</h2>
                <a onClick={handleEdit} className='edit-btn' style={{ cursor: 'pointer' }}><EditNoteIcon /></a>
            </div>
            {
                loading ?
                    <div className='lead-tabpanel-content-item'>
                        <div className="lead-details-list">
                            <label><Skeleton variant="rectangular" width={130} height={20} /> </label>  <Skeleton variant="rectangular" width={250} height={20} />
                        </div>

                        <div className="lead-details-list">
                            <label><Skeleton variant="rectangular" width={130} height={20} /> </label> <Skeleton variant="rectangular" width={250} height={20} />
                        </div>

                        <div className="lead-details-list">
                            <label><Skeleton variant="rectangular" width={130} height={20} />  </label> <Skeleton variant="rectangular" width={250} height={20} />
                        </div>

                        <div className="lead-details-list">
                            <label><Skeleton variant="rectangular" width={130} height={20} /> </label><Skeleton variant="rectangular" width={250} height={20} />

                        </div>

                        <div className="lead-details-list">
                            <label><Skeleton variant="rectangular" width={130} height={20} /> </label><Skeleton variant="rectangular" width={250} height={20} />
                        </div>

                        <div className="lead-details-list">
                            <label><Skeleton variant="rectangular" width={130} height={20} /> </label> <Skeleton variant="rectangular" width={250} height={20} />
                        </div>

                        <div className="lead-details-list">

                            <label><Skeleton variant="rectangular" width={130} height={20} /> </label> <Skeleton variant="rectangular" width={250} height={20} />
                        </div>

                        <div className="lead-details-list">
                            <label><Skeleton variant="rectangular" width={130} height={20} /> </label> <Skeleton variant="rectangular" width={250} height={20} />
                        </div>

                        <div className="lead-details-list">
                            <label><Skeleton variant="rectangular" width={130} height={20} /> </label> <Skeleton variant="rectangular" width={250} height={20} />

                        </div>
                    </div>
                    :
                    <div className='lead-tabpanel-content-item'>

                        <div className="lead-details-list">
                            <label>Name </label>: {data?.name}
                        </div>

                        <div className="lead-details-list">
                            <label>Preferred Course </label>: {data?.preferred_course}
                        </div>

                        <div className="lead-details-list">
                            <label>Email Address </label>: {data?.email}
                        </div>

                        <div className="lead-details-list">
                            <label>Mobile Number  </label>: +{data?.phone_country_code} {data?.phone_number}
                        </div>

                        <div className="lead-details-list">
                            <label>Alternate Mobile Number </label>:
                            {
                                data?.alternate_phone_number ?
                                    ` +${data?.alternate_phone_country_code} ${data?.alternate_phone_number}`
                                    : ' NA'
                            }
                        </div>
                        <div className="lead-details-list">
                            <label>WhatsApp Number </label>:
                            {
                                data?.whatsapp_number ?
                                    ` +${data?.whatsapp_country_code} ${data?.whatsapp_number}`
                                    : ' NA'
                            }
                        </div>

                        {
                            data?.note &&
                            <div className="lead-details-list">
                                <label>Note </label>: {data?.note}
                            </div>
                        }

                        {
                            data?.country &&
                            <div className="lead-details-list">
                                <label>Country From </label>: {data?.country?.name}
                            </div>
                        }

                        {
                            data?.state &&
                            <div className="lead-details-list">
                                <label>State </label>: {data?.state}
                            </div>
                        }

                        {
                            data?.stage &&
                            <div className="lead-details-list">
                                <label>Lead Stage </label>: {data?.stage?.name}
                            </div>
                        }

                        {/* <div className="lead-details-list">
                            <label>Forms Applied </label>: {data?.applyingForCourse?.name}
                        </div> */}

                    </div>
            }
        </div>
    )
}

export default LeadDetail
