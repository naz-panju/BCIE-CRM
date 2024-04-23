import React, { useEffect, useState } from 'react'
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Skeleton } from '@mui/material';
import moment from 'moment';

function StudentDetail({ data, handleEdit, loading }) {

    // console.log(data?.student);

    const [student, setstudent] = useState(data?.student)

    useEffect(() => {
        setstudent(data?.student)
    }, [data?.student])


    return (
        <div className='lead-tabpanel-content-block'>
            <div className='lead-tabpanel-content-block-title'>
                <h2>Student Details</h2>
                <a onClick={handleEdit} className='edit-btn' style={{ cursor: 'pointer' }}><EditNoteIcon /></a>
            </div>
            {
                loading ?
                    <div className='lead-tabpanel-content-item'>
                        <div className="lead-details-list">
                            <label><Skeleton variant="rectangular" width={130} height={20} /> </label>  <Skeleton variant="rectangular" width={250} height={20} />
                        </div>

                        <div className="lead-details-list">
                            <label><Skeleton variant="rectangular" width={130} height={20} /> </label>  <Skeleton variant="rectangular" width={250} height={20} />
                        </div>

                        <div className="lead-details-list">
                            <label><Skeleton variant="rectangular" width={130} height={20} /> </label>  <Skeleton variant="rectangular" width={250} height={20} />
                        </div>

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
                            <label className='title'>First Name </label>: {student?.first_name}
                        </div>

                        <div className="lead-details-list">
                            <label className='title'>Middle Name </label>: {student?.middle_name}
                        </div>

                        <div className="lead-details-list">
                            <label className='title'>Last Name </label>: {student?.last_name}
                        </div>



                        <div className="lead-details-list">
                            <label className='title'>Email Address </label>: {student?.email}
                        </div>

                        <div className="lead-details-list">
                            <label className='title'>Mobile Number  </label>: +{student?.phone_number}
                        </div>
                        <div className="lead-details-list">
                            <label className='title'>Alternate Mobile Number </label>:
                            {
                                student?.alternate_phone_number?.length > 5 ?
                                    ` +${student?.alternate_phone_number}`
                                    : ' NA'
                            }
                        </div>
                        <div className="lead-details-list">
                            <label className='title'>WhatsApp Number </label>:
                            {
                                student?.whatsapp_number?.length > 5 ?
                                    ` +${student?.whatsapp_number}`
                                    : ' NA'
                            }
                        </div>


                        <div className="lead-details-list">
                            <label className='title'>Date Of Birth </label>: {moment(student?.date_of_birth).format('DD-MM-YYYY')}
                        </div>

                        <div className="lead-details-list">
                            <label className='title'>Address</label>: {student?.address}
                        </div>

                        {
                            student?.country &&
                            <div className="lead-details-list">
                                <label className='title'>Country</label>: {student?.country?.name}
                            </div>
                        }

                        {
                            student?.state &&
                            <div className="lead-details-list">
                                <label className='title'>State / Province </label>: {student?.state}
                            </div>
                        }

                        {
                            student?.zipcode &&
                            <div className="lead-details-list">
                                <label className='title'>Zipcode </label>: {student?.zipcode}
                            </div>
                        }
                        {
                            data?.substage &&
                            <div className="lead-details-list">
                                <label className='title'>Lead Sub Stage </label>: {data?.substage?.name}
                            </div>
                        }

                    </div>
            }
        </div>
    )
}

export default StudentDetail
