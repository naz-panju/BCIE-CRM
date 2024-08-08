import React from 'react'
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Skeleton } from '@mui/material';

function LeadDetail({ data, handleEdit, loading, appDetails }) {

    // console.log(appDetails);

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
                            <label style={{ fontWeight: 'bold' }} >Name </label>: {data?.name}
                        </div>

                        {/* <div className="lead-details-list">
                            <label style={{ fontWeight: 'bold' }} >Preferred Course </label>: {data?.preferred_course}
                        </div> */}

                        <div className="lead-details-list">
                            <label style={{ fontWeight: 'bold' }} >Email Address </label>: {data?.email}
                        </div>

                        <div className="lead-details-list">
                            <label style={{ fontWeight: 'bold' }} >Mobile Number  </label>: {data?.phone_number ? '+'+data?.phone_number:'NA'}
                        </div>

                        <div className="lead-details-list">
                            <label style={{ fontWeight: 'bold' }} >Alternate Mobile Number </label>:
                            {
                                data?.alternate_phone_number ?
                                    ` +${data?.alternate_phone_country_code} ${data?.alternate_phone_number}`
                                    : ' NA'
                            }
                        </div>
                        <div className="lead-details-list">
                            <label style={{ fontWeight: 'bold' }} >WhatsApp Number </label>:
                            {
                                data?.whatsapp_number ?
                                    ` +${data?.whatsapp_country_code} ${data?.whatsapp_number}`
                                    : ' NA'
                            }
                        </div>

                        {
                            appDetails?.country &&
                            <div className="lead-details-list">
                                <label style={{ fontWeight: 'bold' }} >Applied Country </label>: {appDetails?.country?.name}
                            </div>
                        }

                        {
                            appDetails?.university &&
                            <div className="lead-details-list">
                                <label style={{ fontWeight: 'bold' }} >Applied University </label>: {appDetails?.university?.name}
                            </div>
                        }

                        {
                            appDetails?.subject_area &&
                            <div className="lead-details-list">
                                <label style={{ fontWeight: 'bold' }} >Subject Area </label>: {appDetails?.subject_area?.name}
                            </div>
                        }

                        {
                            appDetails?.course &&
                            <div className="lead-details-list">
                                <label style={{ fontWeight: 'bold' }} >Applied Courses </label>: {appDetails?.course}
                            </div>
                        }

                        {
                            appDetails?.status &&
                            <div className="lead-details-list">
                                <label style={{ fontWeight: 'bold' }} >Application Status </label>: {appDetails?.status}
                            </div>
                        }

                        {
                            data?.note &&
                            <div className="lead-details-list">
                                <label style={{ fontWeight: 'bold' }} >Note </label>: {data?.note}
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
