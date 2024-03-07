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
                            <label>Form Interested In </label>: {data?.applyingForCourse?.name}
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
                            <label>Name </label>: {data?.name}
                        </div>

                        <div className="lead-details-list">
                            <label>Country Applying For </label>: {data?.applyingForCountry?.name}
                        </div>

                        <div className="lead-details-list">

                            <label>University Applying For </label>: {data?.applyingForUniversity?.name}
                        </div>

                        <div className="lead-details-list">
                            <label>Lead Stage </label>: {data?.stage?.name}
                        </div>

                        <div className="lead-details-list">
                            <label>Forms Applied </label>: {data?.applyingForCourse?.name}
                        </div>

                    </div>
            }
        </div>
    )
}

export default LeadDetail
