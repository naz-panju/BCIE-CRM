import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Pagination, Paper, Select, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography, styled, tooltipClasses } from '@mui/material'
import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import moment from 'moment'
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
import ViewDocumentModal from './modals/viewDocModal'
import { InfoOutlined, Note, Print, PrintOutlined } from '@mui/icons-material'
import CreateLead from '@/Components/Lead/Create/Create'
import { Divider } from 'rsuite'
import UniversityInfoModal from '@/Components/Applications/Modals/UniversityInfo'
import { useSession } from 'next-auth/react'
import SendMail from '../../Modals/SendMail'
import { blue } from '@mui/material/colors'
import { useReactToPrint } from 'react-to-print'
import { LoadingButton } from '@mui/lab'
import PrintDetails from '../../common/printDetails'


const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip placement="right" {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));


function LeadApplication({ data, lead_id, handleLeadRefresh, appRefresh, setDetailRefresh }) {

    const session = useSession()


    const router = useRouter()

    const [editId, setEditId] = useState()
    const [list, setList] = useState([])

    const [loading, setLoading] = useState(true)
    const [uniLoading, setuniLoading] = useState(false)
    const [studentLoading, setstudentLoading] = useState(false)

    const [reqId, setReqId] = useState()
    const [refresh, setRefresh] = useState(false)
    const [details, setDetails] = useState()

    const [docLoading, setdocLoading] = useState(false)
    const [deleteId, setdeleteId] = useState()
    const [deleteLoading, setdeleteLoading] = useState(false)

    const [submitId, setsubmitId] = useState()
    const handleSubmitOpen = (id) => {
        setsubmitId(id)
    }

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [expandedRowId, setExpandedRowId] = useState(null);


    const [stageId, setStageId] = useState()
    const [uniDocId, setuniDocId] = useState()
    const [applicationId, setapplicationId] = useState()
    const [downloadId, setDownloadId] = useState()
    const [mailId, setMailId] = useState()
    const [depositId, setdepositId] = useState()
    const [deferId, setdeferId] = useState()
    const [documentId, setdocumentId] = useState()

    const handleUniDocOpen = (id) => {
        setuniDocId(0)
        setapplicationId(id)
    }
    const handleDeferOpen = (data) => {
        setDetails(data)
        setdeferId(0)
    }
    const handleDocOpen = (data) => {
        setDetails(data)
        setdocumentId(data?.id)
    }
    const handleDepositOpen = (data) => {
        setDetails(data)
        setdepositId(0)
    }
    const handleDepositEdit = (data) => {
        setDetails(data)
        setdepositId(data?.id)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setLimit(parseInt(event.target.value));
        setPage(1);
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

    const [leadEditId, setleadEditId] = useState()

    const handleLeadEditOpen = () => {
        setleadEditId(lead_id)
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

    const handleSubmit = () => {
        setdeleteLoading(true)
        ApplicationApi.submitToCordinator({ id: submitId }).then((response) => {
            // console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                toast.success(response?.data?.message)
                setdeleteLoading(false)
                setsubmitId()
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
        if (page != 1) {
            setPage(1)
        }
        setRefresh(!refresh)
    }

    const handleStageOpen = (row) => {
        setStageId(0)
        setDetails(row)
    }

    const handleMailOpen = (data) => {
        setDetails(data)
        setMailId(data?.id)
    }

    const fetchList = async () => {
        setLoading(true)
        // console.log(lead_id);
        const response = await ApplicationApi.list({ limit: limit, lead_id: lead_id, page: page, intake_id: 'All', withdrawn: 1, all: 1 })
        setList(response?.data)
        setLoading(false)
    }


    const fetchLoadingList = async () => {
        setdocLoading(true)
        const response = await ApplicationApi.list({ limit: limit, lead_id: lead_id, page: page, intake_id: 'All', withdrawn: 1, all: 1 })
        setList(response?.data)
        setdocLoading(false)
    }

    const [uniInfoId, setuniInfoId] = useState()
    const handlUniInfoOpen = (obj) => {
        setDetails(obj)
        setuniInfoId(obj?.id)
    }

    const [sendMailId, setsendMailId] = useState()
    const handlelSendMailOpen = (obj) => {
        setsendMailId(obj?.id)
    }

    useEffect(() => {
        if (lead_id) {
            fetchList()
        }

    }, [refresh, page, appRefresh, limit, lead_id])

    const contentRef = useRef()
    const [printLoad, setPrintLoad] = useState(false)
    const [printList, setPrintList] = useState()

    const handlePrintFetch = useReactToPrint({ contentRef })

    // const handlePrintFetch = useReactToPrint({
    //     content: () => contentRef.current,
    // });

    const handlePrint = async () => {
        try {
            setPrintLoad(true);
            const response = await ApplicationApi.list({
                limit: 1000,
                lead_id: lead_id,
                page: page,
                intake_id: 'All',
                withdrawn: 1,
                all: 1
            });
            setPrintList(response?.data);
            // Trigger print after data is ready
        } catch (error) {
            console.error('Error fetching data for print', error);
            setPrintLoad(false);
        }
    };

    useEffect(() => {
        if (printList?.data?.length > 0) {
            setTimeout(() => {
                handlePrintFetch();
                setPrintLoad(false);
            }, 1000);
        }
    }, [printList])



    return (
        <>
            <CreateLead from='app' editId={leadEditId} setEditId={setleadEditId} refresh={refresh} setRefresh={setRefresh} handleRefresh={handleRefresh} handleLeadRefresh={handleLeadRefresh} />

            <LeadApplicationModal setDetailRefresh={setDetailRefresh} details={data} lead_id={lead_id} editId={editId} setEditId={setEditId} handleRefresh={handleRefresh} />
            <ApplicationStageChangeModal editId={stageId} setEditId={setStageId} details={details} setDetails={setDetails} refresh={refresh} setRefresh={setRefresh} />
            <UniversityDocumentModal app_id={applicationId} setapp_id={setapplicationId} editId={uniDocId} setEditId={setuniDocId} handleRefresh={fetchLoadingList} />

            <UniversityDeposit editId={depositId} setEditId={setdepositId} details={details} setDetails={setDetails} refresh={refresh} setRefresh={setRefresh} />
            <DeferIntake editId={deferId} setEditId={setdeferId} details={details} setDetails={setDetails} refresh={refresh} setRefresh={setRefresh} />

            <ViewDocumentModal appSubmit={true} editId={documentId} setEditId={setdocumentId} details={details} setDetails={setDetails} refresh={refresh} setRefresh={setRefresh} handleDeleteOpen={handleDeleteOpen} handleUniDocOpen={handleUniDocOpen} fetchTable={fetchList} handleLeadRefresh={handleLeadRefresh} />
            <SendUniversityMail from={'lead'} details={details} lead_id={lead_id} editId={mailId} setEditId={setMailId} refresh={refresh} setRefresh={handleRefresh} />

            <ConfirmPopup loading={deleteLoading} ID={deleteId} setID={setdeleteId} clickFunc={handleDelete} title={`Do you want to Delete this Document?`} />

            <ConfirmPopup loading={deleteLoading} ID={submitId} setID={setsubmitId} clickFunc={handleSubmit} title={`Do you want to Submit this Application to the App Cordinator?`} />

            <DownloadDocumentModal editId={downloadId} setEditId={setDownloadId} />

            <UniversityInfoModal editId={uniInfoId} setEditId={setuniInfoId} details={details} setDetails={setDetails} />

            <SendMail application={true} from={'app'} details={data} lead_id={data?.id} editId={sendMailId} setEditId={setsendMailId} refresh={refresh} setRefresh={setDetailRefresh} />


            <div className='lead-tabpanel-content-block timeline'>
                <div className='lead-tabpanel-content-block-title'>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">

                        <div className='lead-detail-title'>
                            Find Universities,Courses and more

                        </div>



                    </div>

                    <Grid display={'flex'} alignItems={'end'}>
                        {

                            session?.data?.user?.role?.id != 6 && data?.closed != 1 && data?.withdrawn != 1 &&
                            !data?.user &&
                            <Grid>
                                <Tooltip
                                    title={(data?.stage?.action_type !== 'Hot Lead' || data?.assignedToCounsellor == null) && 'This button will be enabled if student is Hot and Counsellor is assigned'}
                                >
                                    <a>

                                        <Button
                                            sx={{ mr: 2 }}
                                            disabled={(data?.stage?.action_type !== 'Hot Lead' || data?.assignedToCounsellor == null)}
                                            onClick={handleLeadEditOpen}
                                            variant='contained'
                                            className='bg-sky-600 hover:bg-sky-700 text-white'
                                        >
                                            Submit Applicant Data
                                        </Button>
                                    </a>
                                </Tooltip>

                            </Grid>
                        }

                        <Grid className='mr-3'>

                            {

                                (data?.user &&
                                    list?.data?.length > 0 && session?.data?.user?.role?.id == 3 &&
                                    <LoadingButton loading={printLoad} variant='contained' onClick={handlePrint} className='edit-btn' sx={{ color: 'white', '&:hover': { backgroundColor: '#0c8ac2' } }}>
                                        <PrintOutlined fontSize='small' />
                                        Print
                                    </LoadingButton>
                                )
                            }

                        </Grid>

                        <Grid>

                            {

                                (session?.data?.user?.role?.id != 6 && data?.closed != 1 && data?.withdrawn != 1) &&
                                (data?.user ?
                                    <Button variant='contained' onClick={handleCreate} className='edit-btn' sx={{ color: 'white', '&:hover': { backgroundColor: '#0c8ac2' } }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 17H15M9 14H15M13.0004 3.00087C12.9048 3 12.7974 3 12.6747 3H8.2002C7.08009 3 6.51962 3 6.0918 3.21799C5.71547 3.40973 5.40973 3.71547 5.21799 4.0918C5 4.51962 5 5.08009 5 6.2002V17.8002C5 18.9203 5 19.4801 5.21799 19.9079C5.40973 20.2842 5.71547 20.5905 6.0918 20.7822C6.51921 21 7.079 21 8.19694 21L15.8031 21C16.921 21 17.48 21 17.9074 20.7822C18.2837 20.5905 18.5905 20.2842 18.7822 19.9079C19 19.4805 19 18.9215 19 17.8036V9.32568C19 9.20302 18.9999 9.09553 18.999 9M13.0004 3.00087C13.2858 3.00348 13.4657 3.01407 13.6382 3.05547C13.8423 3.10446 14.0379 3.18526 14.2168 3.29492C14.4186 3.41857 14.5918 3.59181 14.9375 3.9375L18.063 7.06298C18.4089 7.40889 18.5809 7.58136 18.7046 7.78319C18.8142 7.96214 18.8953 8.15726 18.9443 8.36133C18.9857 8.53379 18.9964 8.71454 18.999 9M13.0004 3.00087L13 5.80021C13 6.92031 13 7.48015 13.218 7.90797C13.4097 8.2843 13.7155 8.59048 14.0918 8.78223C14.5192 9 15.079 9 16.1969 9H18.999" stroke="#232648" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>Apply
                                    </Button>
                                    :
                                    <Tooltip title="Only for Applicants" >
                                        <a>
                                            <Button variant='contained' disabled={true} className='edit-btn' sx={{ color: 'white', '&:hover': { backgroundColor: '#0c8ac2' } }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 17H15M9 14H15M13.0004 3.00087C12.9048 3 12.7974 3 12.6747 3H8.2002C7.08009 3 6.51962 3 6.0918 3.21799C5.71547 3.40973 5.40973 3.71547 5.21799 4.0918C5 4.51962 5 5.08009 5 6.2002V17.8002C5 18.9203 5 19.4801 5.21799 19.9079C5.40973 20.2842 5.71547 20.5905 6.0918 20.7822C6.51921 21 7.079 21 8.19694 21L15.8031 21C16.921 21 17.48 21 17.9074 20.7822C18.2837 20.5905 18.5905 20.2842 18.7822 19.9079C19 19.4805 19 18.9215 19 17.8036V9.32568C19 9.20302 18.9999 9.09553 18.999 9M13.0004 3.00087C13.2858 3.00348 13.4657 3.01407 13.6382 3.05547C13.8423 3.10446 14.0379 3.18526 14.2168 3.29492C14.4186 3.41857 14.5918 3.59181 14.9375 3.9375L18.063 7.06298C18.4089 7.40889 18.5809 7.58136 18.7046 7.78319C18.8142 7.96214 18.8953 8.15726 18.9443 8.36133C18.9857 8.53379 18.9964 8.71454 18.999 9M13.0004 3.00087L13 5.80021C13 6.92031 13 7.48015 13.218 7.90797C13.4097 8.2843 13.7155 8.59048 14.0918 8.78223C14.5192 9 15.079 9 16.1969 9H18.999" stroke="#232648" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>Apply</Button>
                                        </a>
                                    </Tooltip>)
                            }

                        </Grid>

                    </Grid>
                </div>
                {
                    data?.user ?
                        loading ?
                            loadTable()
                            :

                            <div className='no-follw-up-block app_tab_cntr'>


                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow style={{ backgroundColor: '#232648' }} className=' text-white' >
                                                <TableCell>
                                                    {/* #0B0D23 svg white color */}
                                                    <Typography style={{ color: '#ffffff' }} className='app-tab-title ' variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                                                            <path d="M1 17H3M3 17H14M3 17V11.3682C3 10.8428 3 10.58 3.063 10.335C3.11883 10.1178 3.21073 9.91184 3.33496 9.72518C3.47505 9.51468 3.67114 9.33842 4.06152 8.9877L6.3631 6.91997C7.11784 6.24192 7.49549 5.90264 7.92249 5.77393C8.29894 5.66045 8.7007 5.66045 9.07715 5.77393C9.50451 5.90275 9.88267 6.2422 10.6387 6.92139L12.9387 8.9877C13.3295 9.33881 13.5245 9.51456 13.6647 9.72518C13.7889 9.91184 13.8807 10.1178 13.9365 10.335C13.9995 10.58 14 10.8428 14 11.3682V17M14 17H19M19 17H21M19 17V4.19691C19 3.07899 19 2.5192 18.7822 2.0918C18.5905 1.71547 18.2837 1.40973 17.9074 1.21799C17.4796 1 16.9203 1 15.8002 1H9.2002C8.08009 1 7.51962 1 7.0918 1.21799C6.71547 1.40973 6.40973 1.71547 6.21799 2.0918C6 2.51962 6 3.08009 6 4.2002V7.0002" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        University
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>

                                                    <Typography style={{ color: '#ffffff' }} className='app-tab-title' variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" fill="none">
                                                            <path d="M2.75 5.74992H2.76759M2.76759 5.74992H19.2325M2.76759 5.74992C2.75 6.05119 2.75 6.42258 2.75 6.90011V16.1001C2.75 17.1735 2.75 17.7095 2.94982 18.1195C3.12559 18.4801 3.40585 18.7741 3.75081 18.9579C4.14261 19.1666 4.65575 19.1666 5.68053 19.1666L16.3195 19.1666C17.3443 19.1666 17.8567 19.1666 18.2484 18.9579C18.5934 18.7741 18.8746 18.4801 19.0504 18.1195C19.25 17.7099 19.25 17.1742 19.25 16.1028L19.25 6.89695C19.25 6.42095 19.25 6.05053 19.2325 5.74992M2.76759 5.74992C2.78954 5.37395 2.83889 5.10717 2.94982 4.87956C3.12559 4.51891 3.40585 4.22591 3.75081 4.04216C4.14299 3.83325 4.65675 3.83325 5.68351 3.83325H16.3168C17.3436 3.83325 17.8563 3.83325 18.2484 4.04216C18.5934 4.22591 18.8746 4.51891 19.0504 4.87956C19.1613 5.10717 19.2106 5.37395 19.2325 5.74992M19.2325 5.74992H19.25M13.75 10.5416L10.0833 14.3749L8.25 12.4583" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>  Subject Area
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography style={{ color: '#ffffff' }} className='app-tab-title' variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <path d="M12 9.7998V19.9998M12 9.7998C12 8.11965 12 7.27992 12.327 6.63818C12.6146 6.0737 13.0732 5.6146 13.6377 5.32698C14.2794 5 15.1196 5 16.7998 5H19.3998C19.9599 5 20.2401 5 20.454 5.10899C20.6422 5.20487 20.7948 5.35774 20.8906 5.5459C20.9996 5.75981 21 6.04004 21 6.6001V15.4001C21 15.9601 20.9996 16.2398 20.8906 16.4537C20.7948 16.6419 20.6425 16.7952 20.4543 16.8911C20.2406 17 19.961 17 19.402 17H16.5693C15.6301 17 15.1597 17 14.7334 17.1295C14.356 17.2441 14.0057 17.4317 13.701 17.6821C13.3568 17.965 13.096 18.3557 12.575 19.1372L12 19.9998M12 9.7998C12 8.11965 11.9998 7.27992 11.6729 6.63818C11.3852 6.0737 10.9263 5.6146 10.3618 5.32698C9.72004 5 8.87977 5 7.19961 5H4.59961C4.03956 5 3.75981 5 3.5459 5.10899C3.35774 5.20487 3.20487 5.35774 3.10899 5.5459C3 5.75981 3 6.04004 3 6.6001V15.4001C3 15.9601 3 16.2398 3.10899 16.4537C3.20487 16.6419 3.35774 16.7952 3.5459 16.8911C3.7596 17 4.03901 17 4.59797 17H7.43073C8.36994 17 8.83942 17 9.26569 17.1295C9.64306 17.2441 9.99512 17.4317 10.2998 17.6821C10.6426 17.9638 10.9017 18.3526 11.4185 19.1277L12 19.9998" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>    Course
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Typography style={{ color: '#ffffff' }} className='app-tab-title' variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                                                            <path d="M1 6.66667H17M1 6.66667V14.978C1 16.0358 1 16.5645 1.21799 16.9686C1.40973 17.324 1.71547 17.6132 2.0918 17.7943C2.5192 18 3.07899 18 4.19691 18H13.8031C14.921 18 15.48 18 15.9074 17.7943C16.2837 17.6132 16.5905 17.324 16.7822 16.9686C17 16.5649 17 16.037 17 14.9812V6.66667M1 6.66667V5.9113C1 4.85342 1 4.32409 1.21799 3.92003C1.40973 3.56461 1.71547 3.27586 2.0918 3.09477C2.51962 2.88889 3.08009 2.88889 4.2002 2.88889H5M17 6.66667V5.90819C17 4.85238 17 4.32369 16.7822 3.92003C16.5905 3.56461 16.2837 3.27586 15.9074 3.09477C15.4796 2.88889 14.9203 2.88889 13.8002 2.88889H13M13 1V2.88889M13 2.88889H5M5 1V2.88889" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>   Intake
                                                    </Typography>
                                                </TableCell>


                                                <TableCell>
                                                    <Typography style={{ color: '#ffffff' }} className='app-tab-title' variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                                                            <path d="M5 6.00008V13.9044C5 15.0386 5 15.6056 5.1701 15.9526C5.48537 16.5959 6.17631 16.9656 6.88639 16.8711C7.2695 16.8201 7.74136 16.5055 8.68508 15.8764L8.68735 15.8749C9.0614 15.6255 9.24846 15.5008 9.44413 15.4316C9.80351 15.3046 10.1956 15.3046 10.555 15.4316C10.7511 15.5009 10.9389 15.6261 11.3144 15.8765C12.2582 16.5057 12.7305 16.82 13.1137 16.871C13.8237 16.9654 14.5146 16.5959 14.8299 15.9526C15 15.6056 15 15.0384 15 13.9044V5.99734C15 5.06575 15 4.59925 14.8185 4.24308C14.6587 3.92948 14.4031 3.6747 14.0895 3.51491C13.733 3.33325 13.2669 3.33325 12.3335 3.33325H7.66683C6.73341 3.33325 6.26635 3.33325 5.90983 3.51491C5.59623 3.6747 5.34144 3.92948 5.18166 4.24308C5 4.5996 5 5.06666 5 6.00008Z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg> Stage
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Typography style={{ color: '#ffffff' }} className='app-tab-title' variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                            <path d="M11.4385 7.89563C11.3318 7.59301 11.1337 7.33097 10.8717 7.14567C10.6097 6.96036 10.2967 6.86091 9.97574 6.86104H8.77492C8.43234 6.85924 8.10126 6.98454 7.8457 7.21271C7.59015 7.44087 7.42828 7.7557 7.39139 8.09629C7.3545 8.43689 7.44521 8.77907 7.64599 9.05666C7.84677 9.33425 8.14335 9.52753 8.47837 9.59912L10.3069 9.99807C10.6807 10.0799 11.0112 10.297 11.2347 10.6077C11.4582 10.9184 11.5591 11.3007 11.5178 11.6812C11.4766 12.0618 11.2962 12.4136 11.0113 12.6692C10.7264 12.9248 10.3571 13.0661 9.97441 13.0659H8.94115C8.2656 13.0659 7.69112 12.6351 7.47835 12.0327M9.45845 6.86104V5.30914M9.45845 14.6178V13.0673M2.99023 18.7881V15.4636H6.31477" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M18.1379 8.55654C18.4909 10.4385 18.2091 12.3844 17.3366 14.0889C16.4641 15.7933 15.0503 17.1598 13.3172 17.9739C11.584 18.788 9.62966 19.0035 7.76077 18.5867C5.89189 18.1699 4.21431 17.1444 2.99132 15.671M1.14819 11.7375C0.795161 9.85549 1.07702 7.90957 1.94952 6.20511C2.82203 4.50066 4.2358 3.13416 5.96892 2.32009C7.70205 1.50602 9.65643 1.29047 11.5253 1.70727C13.3942 2.12407 15.0718 3.14962 16.2948 4.62296" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M16.2952 1.50587V4.83041H12.9707" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        Uni. Deposit
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>

                                                </TableCell>

                                            </TableRow>
                                        </TableHead>
                                        {
                                            list?.data?.length > 0 ?
                                                <TableBody>

                                                    {
                                                        list?.data?.map((obj, index) => (
                                                            <React.Fragment key={obj?.id}>
                                                                {/* sx={{ height: isRowExpanded(obj.id) ? 300 : null }} */}
                                                                <TableRow className='application-tr' >
                                                                    <TableCell>
                                                                        <div className='d-flex justify-between items-center '>
                                                                            <span style={{ cursor: 'pointer' }} onClick={() => handlUniInfoOpen(obj)} className='a_hover text-sky-600'> {obj?.university?.name}</span>
                                                                            {/* <HtmlTooltip
                                                                            title={
                                                                                <React.Fragment>
                                                                                    <Typography mb={1} color="inherit">University Info</Typography>
                                                                                    {obj?.university?.extra_university_info}
                                                                                    <Divider sx={{ mt: 1 }} />
                                                                                    <Typography mt={1} color="inherit">Scholorship Info</Typography>
                                                                                    {obj?.university?.extra_scholarship_info}
                                                                                </React.Fragment>
                                                                            }
                                                                        >
                                                                            <InfoOutlined fontSize='small' sx={{ color: '#689df6' }} />
                                                                        </HtmlTooltip> */}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>{obj?.subject_area?.name}</TableCell>
                                                                    <TableCell>{obj?.course}</TableCell>
                                                                    <TableCell><Tooltip title={obj?.differ_intake_note}>{obj?.intake?.name}</Tooltip></TableCell>
                                                                    <TableCell><Tooltip title={obj?.stage_note}>{obj?.stage?.name}</Tooltip></TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            obj?.deposit_amount_paid ?
                                                                                <>
                                                                                    <a> {obj?.deposit_amount_paid} </a>
                                                                                    <br />
                                                                                    {
                                                                                        obj?.deposit_paid_on &&
                                                                                        <a style={{ fontSize: '13px', color: 'grey' }}>Date :{moment(obj?.deposit_paid_on).format('DD-MM-YYYY')}</a>
                                                                                    }
                                                                                </>
                                                                                :
                                                                                'NA'
                                                                            // <Button onClick={() => handleDepositOpen(obj)}> <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                                                                            //     <path d="M6.33268 9.50008H9.49935M9.49935 9.50008H12.666M9.49935 9.50008V12.6667M9.49935 9.50008V6.33341M3.16602 13.3002V5.70024C3.16602 4.81349 3.16602 4.36978 3.33859 4.03109C3.49039 3.73316 3.73243 3.49112 4.03035 3.33932C4.36905 3.16675 4.81275 3.16675 5.6995 3.16675H13.2995C14.1863 3.16675 14.6294 3.16675 14.9681 3.33932C15.266 3.49112 15.5085 3.73316 15.6603 4.03109C15.8329 4.36978 15.8329 4.81316 15.8329 5.69991V13.2999C15.8329 14.1867 15.8329 14.6301 15.6603 14.9687C15.5085 15.2667 15.266 15.5092 14.9681 15.661C14.6297 15.8334 14.1872 15.8334 13.3022 15.8334H5.6969C4.81189 15.8334 4.36872 15.8334 4.03035 15.661C3.73243 15.5092 3.49039 15.2667 3.33859 14.9688C3.16602 14.6301 3.16602 14.187 3.16602 13.3002Z" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" />
                                                                            // </svg> Add</Button>
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>

                                                                    </TableCell>

                                                                </TableRow>

                                                                {
                                                                    obj?.withdrawn != 1 &&
                                                                    <TableCell colSpan={8} style={{ padding: 0, borderTop: 'none' }} >
                                                                        <div className='appl_act_cntr' >


                                                                            <div className='all_act_cntr application'>
                                                                                <div className='application-btn-left'>
                                                                                    <Button className='btn-svg-size application-btn change-stage' onClick={() => handleStageOpen(obj)}  ><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                                                        <path d="M5 6.00008V13.9044C5 15.0386 5 15.6056 5.1701 15.9526C5.48537 16.5959 6.17631 16.9656 6.88639 16.8711C7.2695 16.8201 7.74136 16.5055 8.68508 15.8764L8.68735 15.8749C9.0614 15.6255 9.24846 15.5008 9.44413 15.4316C9.80351 15.3046 10.1956 15.3046 10.555 15.4316C10.7511 15.5009 10.9389 15.6261 11.3144 15.8765C12.2582 16.5057 12.7305 16.82 13.1137 16.871C13.8237 16.9654 14.5146 16.5959 14.8299 15.9526C15 15.6056 15 15.0384 15 13.9044V5.99734C15 5.06575 15 4.59925 14.8185 4.24308C14.6587 3.92948 14.4031 3.6747 14.0895 3.51491C13.733 3.33325 13.2669 3.33325 12.3335 3.33325H7.66683C6.73341 3.33325 6.26635 3.33325 5.90983 3.51491C5.59623 3.6747 5.34144 3.92948 5.18166 4.24308C5 4.5996 5 5.06666 5 6.00008Z" stroke="#232648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                    </svg> Change Stage</Button>
                                                                                    <Button className='btn-svg-size application-btn Defer-Intake' onClick={() => handleDeferOpen(obj)}  > <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                                                                                        <path d="M1 5.66667H13M1 5.66667V12.5113C1 13.3825 1 13.8178 1.16349 14.1506C1.3073 14.4433 1.5366 14.6815 1.81885 14.8306C2.1394 15 2.55925 15 3.39768 15H10.6023C11.4408 15 11.86 15 12.1805 14.8306C12.4628 14.6815 12.6929 14.4433 12.8367 14.1506C13 13.8182 13 13.3834 13 12.5139V5.66667M1 5.66667V5.0446C1 4.1734 1 3.73748 1.16349 3.40473C1.3073 3.11203 1.5366 2.87424 1.81885 2.7251C2.13972 2.55556 2.56007 2.55556 3.40015 2.55556H4M13 5.66667V5.04204C13 4.17255 13 3.73716 12.8367 3.40473C12.6929 3.11203 12.4628 2.87424 12.1805 2.7251C11.8597 2.55556 11.4402 2.55556 10.6001 2.55556H10M10 1V2.55556M10 2.55556H4M4 1V2.55556" stroke="#232648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                    </svg> Defer Intake</Button>

                                                                                    <Button className='btn-svg-size application-btn Mail-University' onClick={() => handleMailOpen(obj)}  > <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
                                                                                        <path d="M1 3.57143L7.91849 8.01903C8.5773 8.44255 9.4227 8.44255 10.0815 8.01903L17 3.57143M3 13H15C16.1046 13 17 12.1046 17 11V3C17 1.89543 16.1046 1 15 1H3C1.89543 1 1 1.89543 1 3V11C1 12.1046 1.89543 13 3 13Z" stroke="#232648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                    </svg> Mail to University</Button>
                                                                                    {/* <Button className='application-btn Mail-University' onClick={() => handlelSendMailOpen(obj)}  > <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
                                                                                        <path d="M1 3.57143L7.91849 8.01903C8.5773 8.44255 9.4227 8.44255 10.0815 8.01903L17 3.57143M3 13H15C16.1046 13 17 12.1046 17 11V3C17 1.89543 16.1046 1 15 1H3C1.89543 1 1 1.89543 1 3V11C1 12.1046 1.89543 13 3 13Z" stroke="#232648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                    </svg> Send Mail</Button> */}
                                                                                    <Button className='btn-svg-size application-btn documents' onClick={() => handleDocOpen(obj)}  > <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M4.1582 10.5093L10.478 4.18953C12.3574 2.31013 15.4045 2.31013 17.2839 4.18953C19.1633 6.06893 19.1631 9.1162 17.2837 10.9956L9.99166 18.2876C8.73873 19.5406 6.70767 19.5404 5.45473 18.2875C4.2018 17.0345 4.2015 15.0033 5.45443 13.7504L12.7465 6.45837C13.3729 5.83191 14.3892 5.83191 15.0156 6.45837C15.6421 7.08484 15.6417 8.1003 15.0152 8.72676L8.69543 15.0465" stroke="#0B0D23" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                    </svg> Documents</Button>
                                                                                </div>
                                                                                <div className='application-btn-right'>
                                                                                    {
                                                                                        obj?.app_coordinator &&
                                                                                        <span style={{ fontSize: '14px' }} className='mr-3'> <span style={{ color: 'grey' }}>Submitted to :</span> {obj?.app_coordinator?.name}</span>
                                                                                    }

                                                                                    {
                                                                                        obj?.app_coordinator_status == null &&
                                                                                        <Button className='edit-btn-outline' onClick={() => handleSubmitOpen(obj?.id)} variant='outlined' size='small'>Submit</Button>
                                                                                    }
                                                                                    {
                                                                                        obj?.app_coordinator_status == 'Returned' &&
                                                                                        // <div className='d-flex align-center'>
                                                                                        <>
                                                                                            <Button style={{ backgroundColor: blue[500] }} className='blue-btn edit-btn-outline' onClick={() => handleSubmitOpen(obj?.id)} size='small'>Resubmit</Button>
                                                                                            {
                                                                                                obj?.app_coordinator_retun_status_note &&
                                                                                                <Tooltip title={obj?.app_coordinator_retun_status_note}><InfoOutlined fontSize='small' sx={{ color: '#689df6', fontSize: '15px', mr: 1, ml: -2 }} /></Tooltip>
                                                                                            }
                                                                                        </>
                                                                                        // </div>
                                                                                    }

                                                                                    {/* edit application */}

                                                                                    {session?.data?.user?.role?.id != 6 && data?.closed != 1 && data?.withdrawn != 1 &&
                                                                                        <Button className='edit-btn-outline' onClick={() => handleEditDocument(obj?.id)}  > <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                            <path d="M8.50065 2.83333H4.83398C3.72941 2.83333 2.83398 3.72876 2.83398 4.83333V12.1667C2.83398 13.2712 3.72941 14.1667 4.83398 14.1667H12.1673C13.2719 14.1667 14.1673 13.2712 14.1673 12.1667V8.5M6.37565 10.625V8.85416L12.5736 2.65625C13.0626 2.16724 13.8554 2.16724 14.3444 2.65624V2.65624C14.8334 3.14525 14.8334 3.93808 14.3444 4.42708L10.9798 7.79166L8.14648 10.625H6.37565Z" stroke="black" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                                                                        </svg>
                                                                                            Edit</Button>
                                                                                    }
                                                                                </div>

                                                                            </div>
                                                                        </div>

                                                                    </TableCell>
                                                                }

                                                            </React.Fragment>
                                                        ))
                                                    }


                                                </TableBody>
                                                :
                                                (
                                                    <TableBody>
                                                        <TableRow sx={{ height: 250, color: 'transparent' }}>
                                                            <TableCell colSpan={8} style={{ textAlign: 'center' }}>
                                                                No Data Available
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                )}
                                    </Table>
                                    {/* <TablePagination
                                            rowsPerPageOptions={[10, 15, 25]}
                                            component="div"
                                            count={list?.meta?.total || 0}
                                            rowsPerPage={list?.meta?.per_page || 0}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        /> */}

                                </TableContainer>



                                {
                                    list?.data?.length > 0 &&
                                    <div className='table-pagination d-flex justify-content-end align-items-center'>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <div className='select-row-box'>
                                                <Select value={limit} onChange={handleChangeRowsPerPage} inputprops={{ 'aria-label': 'Rows per page' }}>
                                                    <MenuItem value={10}>10</MenuItem>
                                                    <MenuItem value={15}>15</MenuItem>
                                                    <MenuItem value={25}>25</MenuItem>
                                                </Select>
                                                <label>Rows per page</label>
                                            </div>
                                            <div>
                                                <Stack spacing={2}>
                                                    <Pagination count={list?.meta?.last_page} variant="outlined" shape="rounded" page={page} onChange={handleChangePage} />
                                                </Stack>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        : ''
                }

            </div >

            {/* print table */}
            <div style={{ display: "none" }} >
                <div ref={contentRef}>
                    <div className='mb-2'>
                        <PrintDetails leadData={data} />
                    </div>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow style={{ backgroundColor: '#232648' }} className=' text-white' >
                                    <TableCell>
                                        {/* #0B0D23 svg white color */}
                                        <Typography style={{ color: '#ffffff' }} className='app-tab-title ' variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">

                                            University
                                        </Typography>
                                    </TableCell>

                                    <TableCell>

                                        <Typography style={{ color: '#ffffff' }} className='app-tab-title' variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                            Subject Area
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography style={{ color: '#ffffff' }} className='app-tab-title' variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                            Course
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Typography style={{ color: '#ffffff' }} className='app-tab-title' variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                            Intake
                                        </Typography>
                                    </TableCell>


                                    <TableCell>
                                        <Typography style={{ color: '#ffffff' }} className='app-tab-title' variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                            Stage
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Typography style={{ color: '#ffffff' }} className='app-tab-title' variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                            Uni. Deposit
                                        </Typography>
                                    </TableCell>

                                    <TableCell>

                                    </TableCell>

                                </TableRow>
                            </TableHead>
                            {
                                printList?.data?.length > 0 ?
                                    <TableBody>

                                        {
                                            list?.data?.map((obj, index) => (
                                                <React.Fragment key={obj?.id}>
                                                    {/* sx={{ height: isRowExpanded(obj.id) ? 300 : null }} */}
                                                    <TableRow className='application-tr' >
                                                        <TableCell>
                                                            <div className='d-flex justify-between items-center '>
                                                                <span style={{ cursor: 'pointer' }} onClick={() => handlUniInfoOpen(obj)} className='a_hover text-sky-600'> {obj?.university?.name}</span>

                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{obj?.subject_area?.name}</TableCell>
                                                        <TableCell>{obj?.course}</TableCell>
                                                        <TableCell><Tooltip title={obj?.differ_intake_note}>{obj?.intake?.name}</Tooltip></TableCell>
                                                        <TableCell><Tooltip title={obj?.stage_note}>{obj?.stage?.name}</Tooltip></TableCell>
                                                        <TableCell>
                                                            {
                                                                obj?.deposit_amount_paid ?
                                                                    <>
                                                                        <a> {obj?.deposit_amount_paid} </a>
                                                                        <br />
                                                                        {
                                                                            obj?.deposit_paid_on &&
                                                                            <a style={{ fontSize: '13px', color: 'grey' }}>Date :{moment(obj?.deposit_paid_on).format('DD-MM-YYYY')}</a>
                                                                        }
                                                                    </>
                                                                    :
                                                                    'NA'

                                                            }
                                                        </TableCell>
                                                        <TableCell>

                                                        </TableCell>

                                                    </TableRow>

                                                    {
                                                        obj?.withdrawn != 1 &&
                                                        <TableCell colSpan={8} style={{ padding: 0, borderTop: 'none' }} >
                                                            <div className='appl_act_cntr' >


                                                                <div className='all_act_cntr application'>

                                                                    <div className='application-btn-right m-auto mr-0'>
                                                                        {
                                                                            obj?.app_coordinator &&
                                                                            <span style={{ fontSize: '14px' }} className='mr-3'> <span style={{ color: 'grey' }}>Submitted to :</span> {obj?.app_coordinator?.name}</span>
                                                                        }

                                                                        {
                                                                            (session?.data?.user?.role?.id != 6 && obj?.submitted_to_university != 1) && obj?.app_coordinator_status == null &&
                                                                            <Button className='edit-btn-outline' onClick={() => handleSubmitOpen(obj?.id)} variant='outlined' size='small'>Submit</Button>
                                                                        }
                                                                        {
                                                                            session?.data?.user?.role?.id != 6 && obj?.app_coordinator_status == 'Returned' &&
                                                                            // <div className='d-flex align-center'>
                                                                            <>
                                                                                <Button style={{ backgroundColor: blue[500] }} className='blue-btn edit-btn-outline' onClick={() => handleSubmitOpen(obj?.id)} size='small'>Resubmit</Button>
                                                                                {
                                                                                    obj?.app_coordinator_retun_status_note &&
                                                                                    <Tooltip title={obj?.app_coordinator_retun_status_note}><InfoOutlined fontSize='small' sx={{ color: '#689df6', fontSize: '15px', mr: 1, ml: -2 }} /></Tooltip>
                                                                                }
                                                                            </>
                                                                            // </div>
                                                                        }

                                                                        {/* edit application */}


                                                                    </div>

                                                                </div>
                                                            </div>

                                                        </TableCell>
                                                    }

                                                </React.Fragment>
                                            ))
                                        }


                                    </TableBody>
                                    :
                                    (
                                        <TableBody>
                                            <TableRow sx={{ height: 250, color: 'transparent' }}>
                                                <TableCell colSpan={8} style={{ textAlign: 'center' }}>
                                                    No Data Available
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    )}
                        </Table>
                    </TableContainer>
                </div>
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
