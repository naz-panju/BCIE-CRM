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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        {
                            loading ?
                                <div className="lead-details-list">
                                    <label><Skeleton variant="rectangular" width={130} height={20} /> </label>  <Skeleton variant="rectangular" width={250} height={20} />
                                </div>
                                :
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Name </label> <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                        <path d="M16.8333 17.1413C16.2879 14.705 14.2321 13.2694 10.5001 13.2694C6.76817 13.2694 4.71213 14.705 4.16667 17.1413M10.5 19.5341C15.7467 19.5341 20 15.3269 20 10.137C20 4.9472 15.7467 0.73999 10.5 0.73999C5.25329 0.73999 1 4.9472 1 10.137C1 15.3269 5.25329 19.5341 10.5 19.5341ZM10.5 10.137C11.9074 10.137 12.6111 9.39125 12.6111 7.52675C12.6111 5.66226 11.9074 4.91646 10.5 4.91646C9.09259 4.91646 8.38889 5.66226 8.38889 7.52675C8.38889 9.39125 9.09259 10.137 10.5 10.137Z" stroke="#0B0D23" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg> {student?.name}
                                </div>
                        }
                    </div>
                    <div>
                        <a onClick={handleEdit} className='edit-btn' style={{ cursor: 'pointer' }}> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V12M9 15V12.5L17.75 3.75C18.4404 3.05964 19.5596 3.05964 20.25 3.75V3.75C20.9404 4.44036 20.9404 5.55964 20.25 6.25L15.5 11L11.5 15H9Z" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>  Edit </a>
                    </div>

                    {/* <h2>Student Details</h2>
                    <a onClick={handleEdit} className='edit-btn' style={{ cursor: 'pointer' }}><EditNoteIcon /></a> */}
                </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


                            {/* <div className="lead-details-list">
                            <label className='title'>Middle Name </label>: {student?.middle_name}
                        </div>

                        <div className="lead-details-list">
                            <label className='title'>Last Name </label>: {student?.last_name}
                        </div> */}



                            <div className="lead-details-list">
                                <label className='title'>Email Address </label> {student?.email}
                            </div>

                            <div className="lead-details-list">
                                <label className='title'>Mobile Number  </label> +{student?.phone_number}
                            </div>
                          
                            <div className="lead-details-list">
                                <label className='title'>Alternate Mobile Number </label>
                                {
                                    student?.alternate_phone_number?.length > 5 ?
                                        ` +${student?.alternate_phone_number}`
                                        : ' NA'
                                }
                            </div>
                            <div className="lead-details-list">
                                <label className='title'>WhatsApp Number </label>
                                {
                                    student?.whatsapp_number?.length > 5 ?
                                        ` +${student?.whatsapp_number}`
                                        : ' NA'
                                }
                            </div>

                            {
                                student?.intake &&
                                <div className="lead-details-list">
                                    <label className='title'>Intake </label> {student?.intake?.name}
                                </div>
                            }

                            <div className="lead-details-list">
                                <label className='title'>Date Of Birth </label> {moment(student?.date_of_birth).format('DD-MM-YYYY')}
                            </div>

                            {
                                student?.address &&
                                <div className="lead-details-list">
                                    <label className='title'>Address</label> {student?.address}
                                </div>
                            }

                            {
                                student?.country_of_birth &&
                                <div className="lead-details-list">
                                    <label className='title'>Country of Birth</label> {student?.country_of_birth?.name}
                                </div>
                            }

                            {
                                student?.country_of_residence &&
                                <div className="lead-details-list">
                                    <label className='title'>Country of Residence</label> {student?.country_of_residence?.name}
                                </div>
                            }

                            {
                                student?.state &&
                                <div className="lead-details-list">
                                    <label className='title'>State / Province </label> {student?.state}
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
                    </div>
            }
        </div>
    )
}

export default StudentDetail
