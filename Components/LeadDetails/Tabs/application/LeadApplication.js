import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { LeadApi } from '@/data/Endpoints/Lead'
import moment from 'moment'
import { Delete, Download, Edit, ExpandLess, ExpandMore } from '@mui/icons-material'
import { blue } from '@mui/material/colors'
import LeadApplicationModal from './create'
import { ApplicationApi } from '@/data/Endpoints/Application'
import { useRouter } from 'next/router'
import UniversityDocumentModal from './modals/universityDocument'
import DownloadDocumentModal from '@/Components/Applications/Modals/downloadDocument'
import SendUniversityMail from './modals/mailToUniversity'
import ApplicationStageChangeModal from './modals/stageChange'
import toast from 'react-hot-toast'
import ConfirmPopup from '@/Components/Common/Popup/confirm'
import UniversityDeposit from './modals/universityDepost'
import DeferIntake from './modals/deferIntake'

function LeadApplication({ data, lead_id, handleStudentModalOpen }) {

    const router = useRouter()

    const [editId, setEditId] = useState()
    const [list, setList] = useState([])

    const [loading, setLoading] = useState(false)
    const [uniLoading, setuniLoading] = useState(false)
    const [studentLoading, setstudentLoading] = useState(false)

    const [reqId, setReqId] = useState()
    const [refresh, setRefresh] = useState(false)
    const [details, setDetails] = useState()

    const [docLoading, setdocLoading] = useState(false)
    const [deleteId, setdeleteId] = useState()
    const [deleteLoading, setdeleteLoading] = useState(false)

    const [stageId, setStageId] = useState()

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);

    const [expandedRowId, setExpandedRowId] = useState(null);


    const [uniDocId, setuniDocId] = useState()
    const [applicationId, setapplicationId] = useState()
    const [downloadId, setDownloadId] = useState()
    const [mailId, setMailId] = useState()
    const [depositId, setdepositId] = useState()
    const [deferId, setdeferId] = useState()

    const handleUniDocOpen = (id) => {
        setuniDocId(0)
        setapplicationId(id)
    }
    const handleDeferOpen = () => {
        setdeferId(0)
    }
    const handleDepositOpen = () => {
        setdepositId(0)
    }
    const handleDepositEdit = (id) => {
        setdepositId(id)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setLimit(parseInt(event.target.value));
        setPage(0);
    };


    const handleExpand = (id) => {
        if (id?.id === expandedRowId) {
            setExpandedRowId(null)
            setDetails()
        } else {
            setExpandedRowId(id?.id)
            setDetails(id)
            // fetchUniversityDocument()
            // fetchStudentDocument()
        }

    };
    const handleDeleteOpen = (id) => {
        setdeleteId(id)
    }


    function trimUrlAndNumbers(url) {
        const lastSlashIndex = url?.lastIndexOf('/');
        let trimmedString = url?.substring(lastSlashIndex + 1);
        trimmedString = trimmedString?.replace(/[0-9]/g, ''); // Replace all numeric characters with an empty string
        return trimmedString?.replace(/_/g, ''); // Replace all underscores with an empty string
    }

    const isRowExpanded = (id) => {
        return expandedRowId === id;
    };



    const handleCreate = () => {
        setEditId(0)
    }
    const handleRequest = () => {
        setReqId(0)
    }

    const handleEditDocument = (id) => {
        setEditId(id)
    }

    const handleDownloadOpen = (id) => {
        setDownloadId(id)
    }

    const handleDelete = () => {
        setdeleteLoading(true)
        ApplicationApi.deleteUniversityDocument({ id: deleteId }).then((response) => {
            if (response?.status == 200 || response?.status == 201) {
                toast.success(response?.data?.message)
                setdeleteLoading(false)
                setdeleteId()
                fetchLoadingList()
            } else {
                toast.error(response?.response?.data?.message)
                setdeleteLoading(false)
            }
        }).catch((error) => {
            toast.error(error?.response?.data?.message)
            setdeleteLoading(false)
        })
    }

    const handleRefresh = () => {
        if (page != 0) {
            setPage(0)
        }
        setRefresh(!refresh)
    }

    const handleStageOpen = (row) => {
        setStageId(0)
        // setDetails(row) 
    }

    const handleMailOpen = () => {
        setMailId(0)
    }

    const fetchList = async () => {
        setLoading(true)
        const response = await ApplicationApi.list({ limit: limit, student_id: data?.student?.id, page: page + 1, })
        setList(response?.data)
        setLoading(false)
    }

    const fetchLoadingList = async () => {
        setdocLoading(true)
        const response = await ApplicationApi.list({ limit: limit, student_id: data?.student?.id, page: page + 1, })
        setList(response?.data)
        setdocLoading(false)
    }

    useEffect(() => {
        {
            data?.student &&
                fetchList()
        }
    }, [refresh, page])



    return (
        <>
            <LeadApplicationModal details={data} lead_id={lead_id} editId={editId} setEditId={setEditId} handleRefresh={handleRefresh} />
            <ApplicationStageChangeModal editId={stageId} setEditId={setStageId} details={details} setDetails={setDetails} refresh={refresh} setRefresh={setRefresh} />
            <UniversityDocumentModal app_id={applicationId} setapp_id={setapplicationId} editId={uniDocId} setEditId={setuniDocId} handleRefresh={fetchLoadingList} />

            <UniversityDeposit editId={depositId} setEditId={setdepositId} details={details} setDetails={setDetails} refresh={refresh} setRefresh={setRefresh} />
            <DeferIntake editId={deferId} setEditId={setdeferId} details={details} setDetails={setDetails} refresh={refresh} setRefresh={setRefresh} />


            <ConfirmPopup loading={deleteLoading} ID={deleteId} setID={setdeleteId} clickFunc={handleDelete} title={`Do you want to Delete this Document?`} />

            <DownloadDocumentModal editId={downloadId} setEditId={setDownloadId} />

            <SendUniversityMail from={'lead'} details={details} lead_id={lead_id} editId={mailId} setEditId={setMailId} refresh={refresh} setRefresh={handleRefresh} />

            <div className='lead-tabpanel-content-block timeline'>
                <div className='lead-tabpanel-content-block-title'>
                    <h2>Applications</h2>
                    <Grid display={'flex'} alignItems={'end'}>
                        <Grid>
                            <Button sx={{ mr: 2 }} disabled={data?.verification_status == 'Yes'} onClick={data && handleStudentModalOpen} variant='contained' className='bg-sky-600 text-white hover:bg-sky-700 text-white'>Submit Applicant Data</Button>
                        </Grid>
                        <Grid>
                            {
                                data?.student?.id ?
                                    <Button variant='contained' disabled={data?.verification_status != 'Yes'} onClick={handleCreate} className='bg-sky-500 mr-4' sx={{ color: 'white', '&:hover': { backgroundColor: '#0c8ac2' } }}>Apply</Button>
                                    :
                                    <Tooltip title="Only for Applicants" >
                                        <a>
                                            <Button variant='contained' disabled={true} className='bg-sky-500 mr-4' sx={{ color: 'white', '&:hover': { backgroundColor: '#0c8ac2' } }}>Apply</Button>
                                        </a>
                                    </Tooltip>
                            }

                        </Grid>

                    </Grid>
                </div>
                {
                    loading ?
                        loadTable()
                        :
                        <div className='no-follw-up-block app_tab_cntr'>
                            {
                                list?.data?.length > 0 ?

                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
  <path d="M1 17H3M3 17H14M3 17V11.3682C3 10.8428 3 10.58 3.063 10.335C3.11883 10.1178 3.21073 9.91184 3.33496 9.72518C3.47505 9.51468 3.67114 9.33842 4.06152 8.9877L6.3631 6.91997C7.11784 6.24192 7.49549 5.90264 7.92249 5.77393C8.29894 5.66045 8.7007 5.66045 9.07715 5.77393C9.50451 5.90275 9.88267 6.2422 10.6387 6.92139L12.9387 8.9877C13.3295 9.33881 13.5245 9.51456 13.6647 9.72518C13.7889 9.91184 13.8807 10.1178 13.9365 10.335C13.9995 10.58 14 10.8428 14 11.3682V17M14 17H19M19 17H21M19 17V4.19691C19 3.07899 19 2.5192 18.7822 2.0918C18.5905 1.71547 18.2837 1.40973 17.9074 1.21799C17.4796 1 16.9203 1 15.8002 1H9.2002C8.08009 1 7.51962 1 7.0918 1.21799C6.71547 1.40973 6.40973 1.71547 6.21799 2.0918C6 2.51962 6 3.08009 6 4.2002V7.0002" stroke="#0B0D23" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg> University
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell>

                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" fill="none">
  <path d="M2.75 5.74992H2.76759M2.76759 5.74992H19.2325M2.76759 5.74992C2.75 6.05119 2.75 6.42258 2.75 6.90011V16.1001C2.75 17.1735 2.75 17.7095 2.94982 18.1195C3.12559 18.4801 3.40585 18.7741 3.75081 18.9579C4.14261 19.1666 4.65575 19.1666 5.68053 19.1666L16.3195 19.1666C17.3443 19.1666 17.8567 19.1666 18.2484 18.9579C18.5934 18.7741 18.8746 18.4801 19.0504 18.1195C19.25 17.7099 19.25 17.1742 19.25 16.1028L19.25 6.89695C19.25 6.42095 19.25 6.05053 19.2325 5.74992M2.76759 5.74992C2.78954 5.37395 2.83889 5.10717 2.94982 4.87956C3.12559 4.51891 3.40585 4.22591 3.75081 4.04216C4.14299 3.83325 4.65675 3.83325 5.68351 3.83325H16.3168C17.3436 3.83325 17.8563 3.83325 18.2484 4.04216C18.5934 4.22591 18.8746 4.51891 19.0504 4.87956C19.1613 5.10717 19.2106 5.37395 19.2325 5.74992M19.2325 5.74992H19.25M13.75 10.5416L10.0833 14.3749L8.25 12.4583" stroke="#232648" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>  Subject Area
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M12 9.7998V19.9998M12 9.7998C12 8.11965 12 7.27992 12.327 6.63818C12.6146 6.0737 13.0732 5.6146 13.6377 5.32698C14.2794 5 15.1196 5 16.7998 5H19.3998C19.9599 5 20.2401 5 20.454 5.10899C20.6422 5.20487 20.7948 5.35774 20.8906 5.5459C20.9996 5.75981 21 6.04004 21 6.6001V15.4001C21 15.9601 20.9996 16.2398 20.8906 16.4537C20.7948 16.6419 20.6425 16.7952 20.4543 16.8911C20.2406 17 19.961 17 19.402 17H16.5693C15.6301 17 15.1597 17 14.7334 17.1295C14.356 17.2441 14.0057 17.4317 13.701 17.6821C13.3568 17.965 13.096 18.3557 12.575 19.1372L12 19.9998M12 9.7998C12 8.11965 11.9998 7.27992 11.6729 6.63818C11.3852 6.0737 10.9263 5.6146 10.3618 5.32698C9.72004 5 8.87977 5 7.19961 5H4.59961C4.03956 5 3.75981 5 3.5459 5.10899C3.35774 5.20487 3.20487 5.35774 3.10899 5.5459C3 5.75981 3 6.04004 3 6.6001V15.4001C3 15.9601 3 16.2398 3.10899 16.4537C3.20487 16.6419 3.35774 16.7952 3.5459 16.8911C3.7596 17 4.03901 17 4.59797 17H7.43073C8.36994 17 8.83942 17 9.26569 17.1295C9.64306 17.2441 9.99512 17.4317 10.2998 17.6821C10.6426 17.9638 10.9017 18.3526 11.4185 19.1277L12 19.9998" stroke="#0B0D23" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>    Course
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
  <path d="M1 6.66667H17M1 6.66667V14.978C1 16.0358 1 16.5645 1.21799 16.9686C1.40973 17.324 1.71547 17.6132 2.0918 17.7943C2.5192 18 3.07899 18 4.19691 18H13.8031C14.921 18 15.48 18 15.9074 17.7943C16.2837 17.6132 16.5905 17.324 16.7822 16.9686C17 16.5649 17 16.037 17 14.9812V6.66667M1 6.66667V5.9113C1 4.85342 1 4.32409 1.21799 3.92003C1.40973 3.56461 1.71547 3.27586 2.0918 3.09477C2.51962 2.88889 3.08009 2.88889 4.2002 2.88889H5M17 6.66667V5.90819C17 4.85238 17 4.32369 16.7822 3.92003C16.5905 3.56461 16.2837 3.27586 15.9074 3.09477C15.4796 2.88889 14.9203 2.88889 13.8002 2.88889H13M13 1V2.88889M13 2.88889H5M5 1V2.88889" stroke="#232648" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>   Intake
                                                        </Typography>
                                                    </TableCell>


                                                 {/*    <TableCell>
                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Stage 
                                                        </Typography>
                                                    </TableCell>
*/}

                                                    <TableCell>
                                                        <Typography sx={{ color: 'black' }} fontWeight="bold">
                                                           
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    list?.data?.map((obj, index) => (
                                                        <React.Fragment key={obj?.id}>
                                                            {/* sx={{ height: isRowExpanded(obj.id) ? 300 : null }} */}
                                                            <TableRow >
                                                                <TableCell>{obj?.university?.name}</TableCell>
                                                                <TableCell>{obj?.subject_area?.name}</TableCell>
                                                                <TableCell>{obj?.course}</TableCell>
                                                                <TableCell>{obj?.intake?.name}</TableCell>
                                                                {/* <TableCell>{obj?.stage?.name}</TableCell>*/}
                                                        
                                                                <TableCell >

                                                                {/* <Edit onClick={() => handleEditDocument(obj?.id)} sx={{ color: blue[400], cursor: 'pointer' }} fontSize='small' />*/}

                                                                <svg onClick={() => handleEditDocument(obj?.id)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M12 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V12M9 15V12.5L17.75 3.75C18.4404 3.05964 19.5596 3.05964 20.25 3.75V3.75C20.9404 4.44036 20.9404 5.55964 20.25 6.25L15.5 11L11.5 15H9Z" stroke="black" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>


                                                                    {isRowExpanded(obj?.id) ? ( 
                                                                        <><svg onClick={() => handleExpand(obj)} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M9 18C4.02944 18 -6.10673e-07 13.9706 -3.93402e-07 9C-1.76132e-07 4.02944 4.02944 -6.10673e-07 9 -3.93402e-07C13.9706 -1.76132e-07 18 4.02944 18 9C18 13.9706 13.9706 18 9 18Z" fill="#BF70CC"/>
  <path d="M12 8L9.5 11L7 8" stroke="white" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/></svg></>
                                                                    ) : ( 
                                                                        <><svg onClick={() => handleExpand(obj)} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                                        <path d="M9 18C4.02944 18 -6.10673e-07 13.9706 -3.93402e-07 9C-1.76132e-07 4.02944 4.02944 -6.10673e-07 9 -3.93402e-07C13.9706 -1.76132e-07 18 4.02944 18 9C18 13.9706 13.9706 18 9 18Z" fill="#0047CD"/>
                                                                        <path d="M12 8L9.5 11L7 8" stroke="white" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/></svg></>
                                                                    )}
                                                                </TableCell>                                                                
                                                              
                                                            </TableRow>
                                                            {isRowExpanded(obj.id) && (
                                                                // <TableRow>
                                                                <TableCell colSpan={5} style={{ padding: 0, borderTop: 'none' }} >
                                                                    <div className='appl_act_cntr' >
                                                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6' > 



                                                                        <div className='app_list'> 
                                                                                <h3>  University Deposit </h3> 
                                                                                <ul>
                                                                                    <li >
                                                                                        <span className='spn1'> Amt. Paid </span> 
                                                                                    </li>
                                                                                    <li  > 
                                                                                    <a style={{ color: 'black' }}> {obj?.deposit_amount_paid}</a>
                                                                                    </li> 
                                                                                </ul> 

                                                                                <ul>
                                                                                    <li >
                                                                                    <span  className='spn2'> Date Paid </span>
                                                                                    </li>
                                                                                    <li  > 
                                                                                         <a style={{ color: 'black' }}> {moment(obj?.deposit_paid_on).format('DD-MM-YYYY')}</a>
                                                                                    </li> 
                                                                                </ul> 
                                                                                <Button onClick={() => obj?.deposit_amount_paid ? handleDepositEdit(obj?.id) : handleDepositOpen}  >{obj?.deposit_amount_paid ? 'Edit' : 'Add'} <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
  <path d="M6.33268 9.50008H9.49935M9.49935 9.50008H12.666M9.49935 9.50008V12.6667M9.49935 9.50008V6.33341M3.16602 13.3002V5.70024C3.16602 4.81349 3.16602 4.36978 3.33859 4.03109C3.49039 3.73316 3.73243 3.49112 4.03035 3.33932C4.36905 3.16675 4.81275 3.16675 5.6995 3.16675H13.2995C14.1863 3.16675 14.6294 3.16675 14.9681 3.33932C15.266 3.49112 15.5085 3.73316 15.6603 4.03109C15.8329 4.36978 15.8329 4.81316 15.8329 5.69991V13.2999C15.8329 14.1867 15.8329 14.6301 15.6603 14.9687C15.5085 15.2667 15.266 15.5092 14.9681 15.661C14.6297 15.8334 14.1872 15.8334 13.3022 15.8334H5.6969C4.81189 15.8334 4.36872 15.8334 4.03035 15.661C3.73243 15.5092 3.49039 15.2667 3.33859 14.9688C3.16602 14.6301 3.16602 14.187 3.16602 13.3002Z" stroke="#0B0D23" stroke-linecap="round" stroke-linejoin="round"/>
</svg></Button>   
                                                                        </div>


                                                                       <div className='app_list'> 
                                                                       
                                                                             <h3 className='d-flex align-items-center justify-content-between'>  <font>Student Documents </ font>
                                                                             <Download onClick={() => handleDownloadOpen(obj?.id)} sx={{ cursor: 'pointer' }} fontSize='small' /> </h3> 
                                                                       
                                                                               
                                                                             

                                                                            {
                                                                                loading ?
                                                                                    loadInnerTable()
                                                                                    :
                                                                                    obj?.documents.length > 0 ?
                                                                                        <p  >
                                                                                            {obj?.documents?.map((obj, index) => (
                                                                                                <Grid key={index} display={'flex'} justifyContent={'space-between'} sx={{ mt: index !== 0 ? 1 : '' }}>
                                                                                                    <a target='_blank' href={obj?.document} style={{ color: 'blue', cursor: 'pointer' }} key={index} >{trimUrlAndNumbers(obj?.title || obj?.document_template?.name)}</a>
                                                                                                    {/* <Delete onClick={() => handleDeleteOpen(obj?.id)} fontSize='small' style={{ color: 'red', cursor: 'pointer' }} /> */}
                                                                                                </Grid>
                                                                                                // <a key={index}>{obj?.title || obj?.document_template?.name}</a>
                                                                                            ))}

                                                                                        </p>
                                                                                        :
                                                                                        <Grid height={'90%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                                                                            <a>No Document Found</a>
                                                                                        </Grid>

                                                                            }
                                                                        </div>





                                                                        <Grid p={1} item sx={{ border: '1px solid grey' }} md={3.8}>
                                                                            <Grid sx={{ borderBottom: '1px solid grey', marginRight: 1 }} >
                                                                                <Typography variant="body1" style={{ color: blue[400], fontSize: '1.2em', textAlign: 'center' }}>
                                                                                    University Documents
                                                                                </Typography>
                                                                            </Grid>

                                                                            {
                                                                                docLoading ?
                                                                                    loadInnerTable()
                                                                                    :
                                                                                    obj?.university_documents?.length > 0 ?
                                                                                        <Grid sx={{ overflowY: 'auto', maxHeight: 180 }} mt={1}>
                                                                                            {obj?.university_documents?.map((obj, index) => (
                                                                                                <Grid key={index} display={'flex'} justifyContent={'space-between'} sx={{ mt: index !== 0 ? 1 : '' }}>
                                                                                                    <a target='_blank' href={obj?.document} style={{ color: 'blue', cursor: 'pointer' }} key={index} >{trimUrlAndNumbers(obj?.document_template?.name)}</a>
                                                                                                    <Delete onClick={() => handleDeleteOpen(obj?.id)} fontSize='small' style={{ color: 'red', cursor: 'pointer' }} />
                                                                                                </Grid>
                                                                                            ))}

                                                                                        </Grid>
                                                                                        :
                                                                                        <Grid height={'90%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                                                                            <a>No Document Found</a>
                                                                                        </Grid>

                                                                            }
                                                                        </Grid>
                                                                    </div>
                                                                   
                                                                    <div >
                                                                        <Button size='small' variant='contained' onClick={() => handleStageOpen(obj)} className='bg-sky-500 text-white hover:bg-sky-600 text-white' >Change Stage</Button>
                                                                        <Button size='small' variant='outlined' onClick={handleDeferOpen} sx={{ ml: 1 }}>Defer Intake</Button>
                                                                        <Button size='small' variant='outlined' onClick={handleMailOpen} sx={{ ml: 1 }}>Mail to University</Button>
                                                                        <Button size='small' variant='outlined' onClick={() => handleUniDocOpen(obj?.id)} sx={{ ml: 1 }}>Add Univer. Document</Button>
                                                                    </div>
                                                                     </div>

                                                                </TableCell>
                                                                // </TableRow>
                                                            )}
                                                        </React.Fragment>
                                                    ))
                                                }


                                            </TableBody>
                                        </Table>
                                        <TablePagination
                                            rowsPerPageOptions={[10, 15, 25]}
                                            component="div"
                                            count={list?.meta?.total || 0}
                                            rowsPerPage={list?.meta?.per_page || 0}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />

                                    </TableContainer>
                                    :
                                    <h4>No Application Found</h4>
                            }
                        </div>
                }

            </div>
        </>
    )
}

export default LeadApplication

const loadTable = () => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    {[...Array(4)].map((_, index) => (
                        <TableCell key={index} align="left">
                            <Skeleton variant='rounded' width={60} height={20} />
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    [...Array(5)]?.map((_, index) => (
                        <TableRow key={index} className='table-custom-tr'>
                            {
                                [...Array(4)]?.map((_, colindex) => (
                                    <TableCell key={colindex} align="left"><Skeleton variant='rounded' width={120} height={20} /></TableCell>
                                ))
                            }
                        </TableRow>
                    ))
                }

            </TableBody>
        </Table>
    )

}

const loadInnerTable = () => {
    return (

        <Grid mt={1}>
            {[...Array(5)].map((_, index) => (
                <Grid p={1} key={index} align="left">
                    <Skeleton variant='rounded' width={'100%'} height={20} />
                </Grid>
            ))}
        </Grid>


    )

}
