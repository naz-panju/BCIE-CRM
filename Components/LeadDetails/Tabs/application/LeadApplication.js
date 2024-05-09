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
                                                            University
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell>

                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Subject Area
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Course
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Intake
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                            Stage v
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
                                                                <TableCell>{obj?.stage?.name}</TableCell>
                                                                <TableCell><Edit onClick={() => handleEditDocument(obj?.id)} sx={{ color: blue[400], cursor: 'pointer' }} fontSize='small' /></TableCell>
                                                                <TableCell >
                                                                    {isRowExpanded(obj?.id) ? (
                                                                        <ExpandLess
                                                                            onClick={() => handleExpand(obj)}
                                                                            sx={{ color: blue[400], cursor: 'pointer' }}
                                                                            fontSize='small'
                                                                        />
                                                                    ) : (
                                                                        <ExpandMore
                                                                            onClick={() => handleExpand(obj)}
                                                                            sx={{ color: blue[400], cursor: 'pointer' }}
                                                                            fontSize='small'
                                                                        />
                                                                    )}
                                                                </TableCell>                                                                
                                                              
                                                            </TableRow>
                                                            {isRowExpanded(obj.id) && (
                                                                // <TableRow>
                                                                <TableCell colSpan={4} style={{ padding: 0, borderTop: 'none' }} >
                                                                    <Grid container p={1} style={{ width: '100%', height: 250 }}>
                                                                        <Grid item p={1} sx={{ border: '1px solid grey', marginRight: 1 }} md={3.8} style={{ display: 'flex', flexDirection: 'column' }}>
                                                                            <Grid sx={{ borderBottom: '1px solid grey', marginRight: 1 }}>
                                                                                <Typography variant="body1" style={{ color: blue[400], fontSize: '1.2em', textAlign: 'center' }}>
                                                                                    University Deposit
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid mt={2}>
                                                                                <Typography style={{ color: blue[400], fontSize: '14px' }}>
                                                                                    Amt. Paid : <a style={{ color: 'black' }}> {obj?.deposit_amount_paid}</a>
                                                                                </Typography>
                                                                                <Typography style={{ color: blue[400], fontSize: '14px', marginTop: 5 }}>
                                                                                    Date Paid : <a style={{ color: 'black' }}> {moment(obj?.deposit_paid_on).format('DD-MM-YYYY')}</a>
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid container style={{ marginTop: 'auto' }}>
                                                                                <Grid item xs={12} display="flex" justifyContent="flex-end">
                                                                                    <Button onClick={() => obj?.deposit_amount_paid ? handleDepositEdit(obj?.id) : handleDepositOpen} variant='outlined' size='small'>{obj?.deposit_amount_paid ? 'Edit' : 'Add'}</Button>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                        <Grid p={1} item sx={{ border: '1px solid grey', marginRight: 1 }} md={3.8}>
                                                                            <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'} sx={{ borderBottom: '1px solid grey', marginRight: 1 }} >
                                                                                <Typography variant="body1" style={{ color: blue[400], fontSize: '1.2em', textAlign: 'center' }}>
                                                                                    Student Documents
                                                                                </Typography>
                                                                                <Download onClick={() => handleDownloadOpen(obj?.id)} sx={{ cursor: 'pointer' }} fontSize='small' />
                                                                            </Grid>

                                                                            {
                                                                                loading ?
                                                                                    loadInnerTable()
                                                                                    :
                                                                                    obj?.documents.length > 0 ?
                                                                                        <Grid sx={{ overflowY: 'auto', maxHeight: 180 }} mt={1}>
                                                                                            {obj?.documents?.map((obj, index) => (
                                                                                                <Grid key={index} display={'flex'} justifyContent={'space-between'} sx={{ mt: index !== 0 ? 1 : '' }}>
                                                                                                    <a target='_blank' href={obj?.document} style={{ color: 'blue', cursor: 'pointer' }} key={index} >{trimUrlAndNumbers(obj?.title || obj?.document_template?.name)}</a>
                                                                                                    {/* <Delete onClick={() => handleDeleteOpen(obj?.id)} fontSize='small' style={{ color: 'red', cursor: 'pointer' }} /> */}
                                                                                                </Grid>
                                                                                                // <a key={index}>{obj?.title || obj?.document_template?.name}</a>
                                                                                            ))}

                                                                                        </Grid>
                                                                                        :
                                                                                        <Grid height={'90%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                                                                            <a>No Document Found</a>
                                                                                        </Grid>

                                                                            }
                                                                        </Grid>
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
                                                                    </Grid>
                                                                    <Grid pl={1} pb={0.5}>
                                                                        <Button size='small' variant='contained' onClick={() => handleStageOpen(obj)} className='bg-sky-500 text-white hover:bg-sky-600 text-white' >Change Stage</Button>
                                                                        <Button size='small' variant='outlined' onClick={handleDeferOpen} sx={{ ml: 1 }}>Defer Intake</Button>
                                                                        <Button size='small' variant='outlined' onClick={handleMailOpen} sx={{ ml: 1 }}>Mail to University</Button>
                                                                        <Button size='small' variant='outlined' onClick={() => handleUniDocOpen(obj?.id)} sx={{ ml: 1 }}>Add Univer. Document</Button>
                                                                    </Grid>

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
