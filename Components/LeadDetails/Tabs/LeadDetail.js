import React from 'react'
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Skeleton } from '@mui/material';
import moment from 'moment';
import { useSession } from 'next-auth/react';

function LeadDetail({ data, handleEdit, loading }) {

    const session = useSession()



    return (
        <div className='lead-tabpanel-content-block'>
            <div className='lead-tabpanel-content-block-title'>


                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">

                    <div className='lead-detail-title'>
                        Edit and Preview Details of Students
                        {
                            session?.data?.user?.role?.id != 6 && data?.closed != 1 && data?.withdrawn != 1 && data?.completed != 1 &&
                            <a onClick={data && handleEdit} className='edit-btn' style={{ cursor: 'pointer' }}> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V12M9 15V12.5L17.75 3.75C18.4404 3.05964 19.5596 3.05964 20.25 3.75V3.75C20.9404 4.44036 20.9404 5.55964 20.25 6.25L15.5 11L11.5 15H9Z" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>  Edit Details </a>
                        }
                    </div>



                </div>


            </div>
            {
                loading ?
                    <div className='lead-tabpanel-content-item'>

                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div className="lead-details-list">
                                <label><Skeleton variant="rectangular" width={130} height={20} /> </label>  <Skeleton variant="rectangular" width={250} height={20} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                            <div className="lead-details-list">
                                <label><Skeleton variant="rectangular" width={130} height={20} /> </label> <Skeleton variant="rectangular" width={250} height={20} />

                            </div>
                        </div>
                    </div>
                    :
                    <div className='lead-tabpanel-content-item'>

                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div>
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Name </label> <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                        <path d="M16.8333 17.1413C16.2879 14.705 14.2321 13.2694 10.5001 13.2694C6.76817 13.2694 4.71213 14.705 4.16667 17.1413M10.5 19.5341C15.7467 19.5341 20 15.3269 20 10.137C20 4.9472 15.7467 0.73999 10.5 0.73999C5.25329 0.73999 1 4.9472 1 10.137C1 15.3269 5.25329 19.5341 10.5 19.5341ZM10.5 10.137C11.9074 10.137 12.6111 9.39125 12.6111 7.52675C12.6111 5.66226 11.9074 4.91646 10.5 4.91646C9.09259 4.91646 8.38889 5.66226 8.38889 7.52675C8.38889 9.39125 9.09259 10.137 10.5 10.137Z" stroke="#0B0D23" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg> {data?.name}
                                </div>

                            </div>
                        </div>



                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            {
                                data?.stage &&
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Lead Stage </label> {data?.stage?.name}
                                </div>
                            }

                            <div>
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Email Address </label> <svg xmlns="http://www.w3.org/2000/svg" width="23" height="24" viewBox="0 0 23 24" fill="none">
                                        <path d="M2.875 8.33433L10.399 13.2959C11.0669 13.7364 11.9331 13.7364 12.601 13.2959L20.125 8.33433M4.875 18.7618H18.125C19.2296 18.7618 20.125 17.8663 20.125 16.7618V7.49048C20.125 6.38591 19.2296 5.49048 18.125 5.49048H4.875C3.77043 5.49048 2.875 6.38591 2.875 7.49048V16.7618C2.875 17.8663 3.77043 18.7618 4.875 18.7618Z" stroke="#0B0D23" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg> {data?.email || 'NA'}
                                </div>
                            </div>

                            <div>
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Mobile Number  </label> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                        <path d="M3.44776 5.6863C4.25031 11.4593 9.19682 16.3452 15.0355 17.1276C15.9789 17.254 16.8029 16.5661 16.9916 15.6332L17.1959 14.6226C17.3756 13.7339 16.9349 12.8355 16.1222 12.4335L15.3256 12.0396C14.6534 11.7071 13.8397 11.8988 13.3866 12.4964C13.091 12.8863 12.6193 13.1238 12.1671 12.9368C10.6106 12.2931 8.33851 10.0468 7.68355 8.50529C7.49267 8.05604 7.73179 7.58582 8.12381 7.295C8.72671 6.84772 8.91983 6.03122 8.58117 5.36126L8.18518 4.57785C7.78047 3.77721 6.89216 3.34401 6.01211 3.51812L4.94584 3.72906C4.00907 3.91438 3.31627 4.74047 3.44776 5.6863Z" stroke="#0B0D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg> {data?.phone_number ? '+' : ''}{data?.phone_number || 'NA'}
                                </div>
                            </div>

                            {/* phone_country_code
                            alternate_phone_country_code
                            whatsapp_country_code */}
                            <div>
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Alternate Mobile Number </label> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                        <path d="M3.44776 5.6863C4.25031 11.4593 9.19682 16.3452 15.0355 17.1276C15.9789 17.254 16.8029 16.5661 16.9916 15.6332L17.1959 14.6226C17.3756 13.7339 16.9349 12.8355 16.1222 12.4335L15.3256 12.0396C14.6534 11.7071 13.8397 11.8988 13.3866 12.4964C13.091 12.8863 12.6193 13.1238 12.1671 12.9368C10.6106 12.2931 8.33851 10.0468 7.68355 8.50529C7.49267 8.05604 7.73179 7.58582 8.12381 7.295C8.72671 6.84772 8.91983 6.03122 8.58117 5.36126L8.18518 4.57785C7.78047 3.77721 6.89216 3.34401 6.01211 3.51812L4.94584 3.72906C4.00907 3.91438 3.31627 4.74047 3.44776 5.6863Z" stroke="#0B0D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {
                                        data?.alternate_phone_number ?
                                            ` + ${data?.alternate_phone_number}`
                                            : ' NA'
                                    }
                                </div>
                            </div>


                            <div>
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>WhatsApp Number </label> <svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" fill="none">
                                        <path d="M8.09361 10.1995C8.41826 9.985 8.65309 9.84127 8.4417 9.21785C8.23031 8.59442 8.06858 8.04597 7.55813 8.80406C6.80869 9.91773 8.28103 12.0197 9.66168 13.2128C11.0423 14.4059 13.3675 15.5857 14.3826 14.7016C15.0735 14.0995 14.5023 14.0146 13.8494 13.8911C13.1965 13.7676 13.084 14.0171 12.9127 14.3641M19.25 11.6533C19.25 16.1603 15.5563 19.8139 11 19.8139C9.49732 19.8139 8.08847 19.4165 6.875 18.7221L2.75 19.8139L4.00908 15.9884C3.21135 14.7324 2.75 13.2461 2.75 11.6533C2.75 7.1463 6.44365 3.49268 11 3.49268C15.5563 3.49268 19.25 7.1463 19.25 11.6533Z" stroke="#0B0D23" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {
                                        data?.whatsapp_number ?
                                            ` +${data?.whatsapp_number}`
                                            : ' NA'
                                    }
                                </div>
                            </div>


                            {
                                data?.country_of_birth &&
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Country of Birth </label> {data?.country_of_birth?.name}
                                </div>
                            }
                            {
                                data?.country_of_residence &&
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Country of Residence </label> {data?.country_of_residence?.name}
                                </div>
                            }
                            {
                                data?.city &&
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>City </label> {data?.city}
                                </div>
                            }
                            {
                                data?.address &&
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Address </label> {data?.address}
                                </div>
                            }

                            {
                                data?.date_of_birth &&
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Date of Birth </label> {moment(data?.date_of_birth).format('DD-MM-YYYY')}
                                </div>
                            }

                            {/* {
                                data?.intake &&
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Intake </label> {data?.intake?.name}
                                </div>
                            } */}


                            {/* {
                                data?.course_level &&
                                <div>
                                    <div className="lead-details-list">
                                        <label style={{ fontWeight: 'bold' }}>Preferred Course Level </label>  {data?.course_level?.name}
                                    </div>
                                </div>
                            } */}

                            <div>
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Preferred Courses </label> {data?.preferred_course || 'NA'}
                                </div>
                            </div>


                            {
                                data?.preferred_countries &&
                                <div>
                                    <div className="lead-details-list">
                                        <label style={{ fontWeight: 'bold' }}>Preferred Countries </label> {data?.preferred_countries}
                                    </div>
                                </div>
                            }

                            {
                                data?.passport &&
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Passport Number </label> {data?.passport}
                                </div>
                            }
                            {
                                data?.passport_exp_date &&
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Passport Expiry Date </label>{moment(data?.passport_exp_date).format('DD-MM-YYYY')}
                                </div>
                            }

                            {
                                data?.lead_source &&
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Lead Source </label> {data?.lead_source?.name}
                                </div>
                            }
                            {/* referrance_from */}

                            {
                                data?.lead_source?.id == 5 &&
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Referred Student </label> {data?.referredStudent?.name || 'NA'}
                                </div>
                            }

                            {
                                data?.lead_source?.id == 6 &&
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Referred Agency </label> {data?.agency?.name || 'NA'}
                                </div>
                            }
                            {
                                data?.lead_source?.id == 7 &&
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Referred University </label> {data?.referred_university?.name || 'NA'}
                                </div>
                            }
                            {
                                data?.lead_source?.id == 11 &&
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Event </label> {data?.event?.name || 'NA'}
                                </div>
                            }

                            {
                                data?.sponser_details &&
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Sponser Detail </label> {data?.sponser_details || 'NA'}
                                </div>
                            }

                            

                            {
                                data?.referrance_from &&
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Here about us from </label> {data?.referrance_from}
                                </div>
                            }


                            {
                                data?.note &&
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Note </label> {data?.note}
                                </div>
                            }



                            {
                                data?.substage &&
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Lead Sub Stage </label>: {data?.substage?.name}
                                </div>
                            }

                            {
                                data?.closed == 1 && data?.archive_reason &&
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Archive Reason </label> {data?.archive_reason}
                                </div>
                            }

                            {
                                data?.closed == 1 && data?.archive_note &&
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Archive Note </label> {data?.archive_note}
                                </div>
                            }

                            {
                                data?.withdrawn == 1 && data?.withdraw_reason &&
                                <div className="lead-details-list">
                                    <label style={{ fontWeight: 'bold' }}>Withdrawn Reason</label>: {data?.withdraw_reason}
                                </div>
                            }





                        </div>





















                        {/* <div className="lead-details-list">
                            <label>Forms Applied </label>: {data?.applyingForCourse?.name}
                        </div> */}

                    </div>
            }
        </div>
    )
}

export default LeadDetail
