import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import LeadDocumentModal from './create'
import { useEffect } from 'react'
import { LeadApi } from '@/data/Endpoints/Lead'
import moment from 'moment'
import LeadDocumentRequest from './request'
import { DeleteOutline, DownloadOutlined, Edit, Upload, UploadOutlined } from '@mui/icons-material'
import { blue } from '@mui/material/colors'
import LeadDocumentDetailModal from './Modal'
import DocumentConfirmPopup from './confirmPopup'
import DocumentRejectPopup from './rejectPopup'
import toast from 'react-hot-toast';
import TimelineOppositeContent, {
    timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import ApplicationDocumentUpload from './applicationDocUpload'
import LeadRequestUploadDocumentModal from './UploadRequestedDoc'
import Doc from '@/img/doc.png';
import DocPreview from '@/img/doc-preview.jpg';
import Image from 'next/image'

function LeadDocuments({ lead_id, from, app_id, app_details, appRefresh }) {

    const [editId, setEditId] = useState()
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const [reqId, setReqId] = useState()
    const [reqUploadId, setreqUploadId] = useState()
    const [refresh, setRefresh] = useState(false)

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);

    const [detailId, setDetailId] = useState()

    const [confirmId, setconfirmId] = useState()
    const [confirmLoading, setconfirmLoading] = useState(false)

    const [rejectId, setrejectId] = useState()

    const [appDocId, setAppDocId] = useState()


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setLimit(parseInt(event.target.value));
        setPage(0);
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

    const handleDetailOpen = (id) => {
        setDetailId(id)
    }

    const handleAccept = (id) => {
        setconfirmId(id)
    }

    const handleReject = (id) => {
        setrejectId(id)
    }

    const handleUploadRejectedDoc = (id) => {
        setreqUploadId(id)
    }

 
    const handleOpenAppDoc = (doc) => {
        app_details['from_doc'] = doc
        setAppDocId(0)
    }

    const handleRefresh = () => {
        if (page != 0) {
            setPage(0)
        }
        setRefresh(!refresh)
    }

    const fetchList = async () => {
        setLoading(true)
        let params = {
            lead_id: lead_id,
            limit: limit,
            page: page + 1
        }
        if (from == 'app') {
            params['application_id'] = app_id
        }
        try {
            const response = await LeadApi.listDocuments(params)
            if (response?.status == 200 || response?.status == 201) {
                setList(response?.data)
                setLoading(false)
            } else {
                toast.error(response?.response?.data?.message)
                setLoading(false)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
            setLoading(false)
        }

    }

    async function downloadFile(url, fileName) {
        try {
            // Fetch the file content
            const response = await fetch(url);
            const blob = await response.blob();
    
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', fileName);
    
            // Append the link to the body
            document.body.appendChild(link);
    
            // Trigger the click event on the link
            link.click();
    
            // Remove the link from the body
            document.body.removeChild(link);
    
            // Release the object URL
            window.URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    }
    

    // console.log(list?.data);

    function trimUrlAndNumbers(url) {
        const lastSlashIndex = url?.lastIndexOf('/');
        let trimmedString = url?.substring(lastSlashIndex + 1);
        trimmedString = trimmedString?.replace(/[0-9]/g, ''); // Replace all numeric characters with an empty string
        return trimmedString?.replace(/_/g, ''); // Replace all underscores with an empty string
    }

    useEffect(() => {
        fetchList()
    }, [refresh, page])

    return (
        <>
            <LeadDocumentModal lead_id={lead_id} from={from} app_id={app_id} editId={editId} setEditId={setEditId} handleRefresh={handleRefresh} />
            <LeadDocumentRequest id={lead_id} reqId={reqId} setReqId={setReqId} fetchList={fetchList} />
            <LeadRequestUploadDocumentModal datas={reqUploadId} lead_id={lead_id} from={from} app_id={app_id} editId={reqUploadId?.id} setEditId={setreqUploadId} handleRefresh={handleRefresh} />

            <ApplicationDocumentUpload appRefresh={appRefresh} datas={app_details} lead_id={lead_id} from={from} app_id={app_id} editId={appDocId} setEditId={setAppDocId} handleRefresh={handleRefresh} />

            <LeadDocumentDetailModal id={detailId} setId={setDetailId} />

            <DocumentConfirmPopup ID={confirmId} setID={setconfirmId} loading={confirmLoading} setLoading={setconfirmLoading} title={'Are your want to Approve this Document?'} getDetails={handleRefresh} />
            <DocumentRejectPopup ID={rejectId} setID={setrejectId} loading={confirmLoading} setLoading={setconfirmLoading} title={'Are your want to Reject this Document?'} getDetails={handleRefresh} />

            <div className='lead-tabpanel-content-block timeline'>
                <div className='lead-tabpanel-content-block-title'>
                    <div className='lead-detail-title'>
                        Download & Upload Documents
                    </div>

                    {
                        from != 'app' &&
                        <Grid display={'flex'} alignItems={'end'}>
                            {/* <Button onClick={handleCreate} className='bg-sky-500 mr-4' sx={{ color: 'white', '&:hover': { backgroundColor: '#0c8ac2' } }}>Add</Button> */}
                            <Button  onClick={handleRequest} className='bg-sky-400 Request-Document-btn' sx={{ color: 'white', '&:hover': { backgroundColor: '#0c8ac2' } }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">  <path d="M19 19L16 16M10.0002 20H7.19692C6.07901 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4796 4 18.9074 4.21799C19.2837 4.40973 19.5905 4.71547 19.7822 5.0918C20 5.5192 20 6.07899 20 7.19691V10.0002M13.5 17C11.567 17 10 15.433 10 13.5C10 11.567 11.567 10 13.5 10C15.433 10 17 11.567 17 13.5C17 15.433 15.433 17 13.5 17Z" stroke="#232648" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg> Request Document</Button>
                        </Grid>
                    }
                </div>
                {
                    loading ?
                        loadTable()
                        :
                        <div className='no-follw-up-block document-block'>
                            
                            <div className='flex mar-25'>
                                <div className='md:w-5/12 lg:w-5/12 pad-25'>
                                    <div className='search-document-block'>
                                        <div className='search-document-block-input'>
                                            <input placeholder='Search Documents' />
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">  <path d="M12.5 12.5L17.5 17.5M8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667Z" stroke="#0B0D23" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                        </div>

                                        <ul className='search-document-block-pred'>
                                            <li><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 13.5V9M9 9L6.75 10.5M9 9L11.25 10.5M9.75 2.25065C9.67838 2.25 9.59796 2.25 9.50604 2.25H6.15015C5.31007 2.25 4.88972 2.25 4.56885 2.41349C4.2866 2.5573 4.0573 2.7866 3.91349 3.06885C3.75 3.38972 3.75 3.81007 3.75 4.65015V13.3501C3.75 14.1902 3.75 14.61 3.91349 14.9309C4.0573 15.2132 4.2866 15.4429 4.56885 15.5867C4.8894 15.75 5.30925 15.75 6.14771 15.75L11.8523 15.75C12.6908 15.75 13.11 15.75 13.4305 15.5867C13.7128 15.4429 13.9429 15.2132 14.0867 14.9309C14.25 14.6104 14.25 14.1911 14.25 13.3527V6.99426C14.25 6.90222 14.25 6.82171 14.2493 6.75M9.75 2.25065C9.96423 2.2526 10.0998 2.26038 10.2291 2.29145C10.3822 2.32819 10.5284 2.38895 10.6626 2.47119C10.8139 2.56392 10.9439 2.69386 11.2031 2.95312L13.5472 5.29724C13.8067 5.55667 13.9357 5.68602 14.0284 5.8374C14.1107 5.9716 14.1715 6.11794 14.2083 6.271C14.2393 6.40032 14.2473 6.53588 14.2493 6.75M9.75 2.25065V4.35C9.75 5.19008 9.75 5.60983 9.91349 5.93069C10.0573 6.21294 10.2866 6.44286 10.5688 6.58667C10.8894 6.75 11.3092 6.75 12.1477 6.75H14.2493M14.2493 6.75H14.2501" stroke="#232648" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg> Degree Certificate</li>

                                            <li><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 13.5V9M9 9L6.75 10.5M9 9L11.25 10.5M9.75 2.25065C9.67838 2.25 9.59796 2.25 9.50604 2.25H6.15015C5.31007 2.25 4.88972 2.25 4.56885 2.41349C4.2866 2.5573 4.0573 2.7866 3.91349 3.06885C3.75 3.38972 3.75 3.81007 3.75 4.65015V13.3501C3.75 14.1902 3.75 14.61 3.91349 14.9309C4.0573 15.2132 4.2866 15.4429 4.56885 15.5867C4.8894 15.75 5.30925 15.75 6.14771 15.75L11.8523 15.75C12.6908 15.75 13.11 15.75 13.4305 15.5867C13.7128 15.4429 13.9429 15.2132 14.0867 14.9309C14.25 14.6104 14.25 14.1911 14.25 13.3527V6.99426C14.25 6.90222 14.25 6.82171 14.2493 6.75M9.75 2.25065C9.96423 2.2526 10.0998 2.26038 10.2291 2.29145C10.3822 2.32819 10.5284 2.38895 10.6626 2.47119C10.8139 2.56392 10.9439 2.69386 11.2031 2.95312L13.5472 5.29724C13.8067 5.55667 13.9357 5.68602 14.0284 5.8374C14.1107 5.9716 14.1715 6.11794 14.2083 6.271C14.2393 6.40032 14.2473 6.53588 14.2493 6.75M9.75 2.25065V4.35C9.75 5.19008 9.75 5.60983 9.91349 5.93069C10.0573 6.21294 10.2866 6.44286 10.5688 6.58667C10.8894 6.75 11.3092 6.75 12.1477 6.75H14.2493M14.2493 6.75H14.2501" stroke="#232648" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg> International Passport.pdf</li>

                                            <li><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 13.5V9M9 9L6.75 10.5M9 9L11.25 10.5M9.75 2.25065C9.67838 2.25 9.59796 2.25 9.50604 2.25H6.15015C5.31007 2.25 4.88972 2.25 4.56885 2.41349C4.2866 2.5573 4.0573 2.7866 3.91349 3.06885C3.75 3.38972 3.75 3.81007 3.75 4.65015V13.3501C3.75 14.1902 3.75 14.61 3.91349 14.9309C4.0573 15.2132 4.2866 15.4429 4.56885 15.5867C4.8894 15.75 5.30925 15.75 6.14771 15.75L11.8523 15.75C12.6908 15.75 13.11 15.75 13.4305 15.5867C13.7128 15.4429 13.9429 15.2132 14.0867 14.9309C14.25 14.6104 14.25 14.1911 14.25 13.3527V6.99426C14.25 6.90222 14.25 6.82171 14.2493 6.75M9.75 2.25065C9.96423 2.2526 10.0998 2.26038 10.2291 2.29145C10.3822 2.32819 10.5284 2.38895 10.6626 2.47119C10.8139 2.56392 10.9439 2.69386 11.2031 2.95312L13.5472 5.29724C13.8067 5.55667 13.9357 5.68602 14.0284 5.8374C14.1107 5.9716 14.1715 6.11794 14.2083 6.271C14.2393 6.40032 14.2473 6.53588 14.2493 6.75M9.75 2.25065V4.35C9.75 5.19008 9.75 5.60983 9.91349 5.93069C10.0573 6.21294 10.2866 6.44286 10.5688 6.58667C10.8894 6.75 11.3092 6.75 12.1477 6.75H14.2493M14.2493 6.75H14.2501" stroke="#232648" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg> BSC Transcript.pdf</li>

                                            <li><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 13.5V9M9 9L6.75 10.5M9 9L11.25 10.5M9.75 2.25065C9.67838 2.25 9.59796 2.25 9.50604 2.25H6.15015C5.31007 2.25 4.88972 2.25 4.56885 2.41349C4.2866 2.5573 4.0573 2.7866 3.91349 3.06885C3.75 3.38972 3.75 3.81007 3.75 4.65015V13.3501C3.75 14.1902 3.75 14.61 3.91349 14.9309C4.0573 15.2132 4.2866 15.4429 4.56885 15.5867C4.8894 15.75 5.30925 15.75 6.14771 15.75L11.8523 15.75C12.6908 15.75 13.11 15.75 13.4305 15.5867C13.7128 15.4429 13.9429 15.2132 14.0867 14.9309C14.25 14.6104 14.25 14.1911 14.25 13.3527V6.99426C14.25 6.90222 14.25 6.82171 14.2493 6.75M9.75 2.25065C9.96423 2.2526 10.0998 2.26038 10.2291 2.29145C10.3822 2.32819 10.5284 2.38895 10.6626 2.47119C10.8139 2.56392 10.9439 2.69386 11.2031 2.95312L13.5472 5.29724C13.8067 5.55667 13.9357 5.68602 14.0284 5.8374C14.1107 5.9716 14.1715 6.11794 14.2083 6.271C14.2393 6.40032 14.2473 6.53588 14.2493 6.75M9.75 2.25065V4.35C9.75 5.19008 9.75 5.60983 9.91349 5.93069C10.0573 6.21294 10.2866 6.44286 10.5688 6.58667C10.8894 6.75 11.3092 6.75 12.1477 6.75H14.2493M14.2493 6.75H14.2501" stroke="#232648" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg> Secondary School Certificate.pdf <div><span></span>Requested</div></li>

                                            <li><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 13.5V9M9 9L6.75 10.5M9 9L11.25 10.5M9.75 2.25065C9.67838 2.25 9.59796 2.25 9.50604 2.25H6.15015C5.31007 2.25 4.88972 2.25 4.56885 2.41349C4.2866 2.5573 4.0573 2.7866 3.91349 3.06885C3.75 3.38972 3.75 3.81007 3.75 4.65015V13.3501C3.75 14.1902 3.75 14.61 3.91349 14.9309C4.0573 15.2132 4.2866 15.4429 4.56885 15.5867C4.8894 15.75 5.30925 15.75 6.14771 15.75L11.8523 15.75C12.6908 15.75 13.11 15.75 13.4305 15.5867C13.7128 15.4429 13.9429 15.2132 14.0867 14.9309C14.25 14.6104 14.25 14.1911 14.25 13.3527V6.99426C14.25 6.90222 14.25 6.82171 14.2493 6.75M9.75 2.25065C9.96423 2.2526 10.0998 2.26038 10.2291 2.29145C10.3822 2.32819 10.5284 2.38895 10.6626 2.47119C10.8139 2.56392 10.9439 2.69386 11.2031 2.95312L13.5472 5.29724C13.8067 5.55667 13.9357 5.68602 14.0284 5.8374C14.1107 5.9716 14.1715 6.11794 14.2083 6.271C14.2393 6.40032 14.2473 6.53588 14.2493 6.75M9.75 2.25065V4.35C9.75 5.19008 9.75 5.60983 9.91349 5.93069C10.0573 6.21294 10.2866 6.44286 10.5688 6.58667C10.8894 6.75 11.3092 6.75 12.1477 6.75H14.2493M14.2493 6.75H14.2501" stroke="#232648" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg> Jishnu Ambadi Certificate.Pdf</li>

                                            <li><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 13.5V9M9 9L6.75 10.5M9 9L11.25 10.5M9.75 2.25065C9.67838 2.25 9.59796 2.25 9.50604 2.25H6.15015C5.31007 2.25 4.88972 2.25 4.56885 2.41349C4.2866 2.5573 4.0573 2.7866 3.91349 3.06885C3.75 3.38972 3.75 3.81007 3.75 4.65015V13.3501C3.75 14.1902 3.75 14.61 3.91349 14.9309C4.0573 15.2132 4.2866 15.4429 4.56885 15.5867C4.8894 15.75 5.30925 15.75 6.14771 15.75L11.8523 15.75C12.6908 15.75 13.11 15.75 13.4305 15.5867C13.7128 15.4429 13.9429 15.2132 14.0867 14.9309C14.25 14.6104 14.25 14.1911 14.25 13.3527V6.99426C14.25 6.90222 14.25 6.82171 14.2493 6.75M9.75 2.25065C9.96423 2.2526 10.0998 2.26038 10.2291 2.29145C10.3822 2.32819 10.5284 2.38895 10.6626 2.47119C10.8139 2.56392 10.9439 2.69386 11.2031 2.95312L13.5472 5.29724C13.8067 5.55667 13.9357 5.68602 14.0284 5.8374C14.1107 5.9716 14.1715 6.11794 14.2083 6.271C14.2393 6.40032 14.2473 6.53588 14.2493 6.75M9.75 2.25065V4.35C9.75 5.19008 9.75 5.60983 9.91349 5.93069C10.0573 6.21294 10.2866 6.44286 10.5688 6.58667C10.8894 6.75 11.3092 6.75 12.1477 6.75H14.2493M14.2493 6.75H14.2501" stroke="#232648" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg> BSC Transcript.pdf</li>

                                            <li><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 13.5V9M9 9L6.75 10.5M9 9L11.25 10.5M9.75 2.25065C9.67838 2.25 9.59796 2.25 9.50604 2.25H6.15015C5.31007 2.25 4.88972 2.25 4.56885 2.41349C4.2866 2.5573 4.0573 2.7866 3.91349 3.06885C3.75 3.38972 3.75 3.81007 3.75 4.65015V13.3501C3.75 14.1902 3.75 14.61 3.91349 14.9309C4.0573 15.2132 4.2866 15.4429 4.56885 15.5867C4.8894 15.75 5.30925 15.75 6.14771 15.75L11.8523 15.75C12.6908 15.75 13.11 15.75 13.4305 15.5867C13.7128 15.4429 13.9429 15.2132 14.0867 14.9309C14.25 14.6104 14.25 14.1911 14.25 13.3527V6.99426C14.25 6.90222 14.25 6.82171 14.2493 6.75M9.75 2.25065C9.96423 2.2526 10.0998 2.26038 10.2291 2.29145C10.3822 2.32819 10.5284 2.38895 10.6626 2.47119C10.8139 2.56392 10.9439 2.69386 11.2031 2.95312L13.5472 5.29724C13.8067 5.55667 13.9357 5.68602 14.0284 5.8374C14.1107 5.9716 14.1715 6.11794 14.2083 6.271C14.2393 6.40032 14.2473 6.53588 14.2493 6.75M9.75 2.25065V4.35C9.75 5.19008 9.75 5.60983 9.91349 5.93069C10.0573 6.21294 10.2866 6.44286 10.5688 6.58667C10.8894 6.75 11.3092 6.75 12.1477 6.75H14.2493M14.2493 6.75H14.2501" stroke="#232648" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg> Secondary School Certificate.pdf</li>

                                            <li><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 13.5V9M9 9L6.75 10.5M9 9L11.25 10.5M9.75 2.25065C9.67838 2.25 9.59796 2.25 9.50604 2.25H6.15015C5.31007 2.25 4.88972 2.25 4.56885 2.41349C4.2866 2.5573 4.0573 2.7866 3.91349 3.06885C3.75 3.38972 3.75 3.81007 3.75 4.65015V13.3501C3.75 14.1902 3.75 14.61 3.91349 14.9309C4.0573 15.2132 4.2866 15.4429 4.56885 15.5867C4.8894 15.75 5.30925 15.75 6.14771 15.75L11.8523 15.75C12.6908 15.75 13.11 15.75 13.4305 15.5867C13.7128 15.4429 13.9429 15.2132 14.0867 14.9309C14.25 14.6104 14.25 14.1911 14.25 13.3527V6.99426C14.25 6.90222 14.25 6.82171 14.2493 6.75M9.75 2.25065C9.96423 2.2526 10.0998 2.26038 10.2291 2.29145C10.3822 2.32819 10.5284 2.38895 10.6626 2.47119C10.8139 2.56392 10.9439 2.69386 11.2031 2.95312L13.5472 5.29724C13.8067 5.55667 13.9357 5.68602 14.0284 5.8374C14.1107 5.9716 14.1715 6.11794 14.2083 6.271C14.2393 6.40032 14.2473 6.53588 14.2493 6.75M9.75 2.25065V4.35C9.75 5.19008 9.75 5.60983 9.91349 5.93069C10.0573 6.21294 10.2866 6.44286 10.5688 6.58667C10.8894 6.75 11.3092 6.75 12.1477 6.75H14.2493M14.2493 6.75H14.2501" stroke="#232648" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg> Jishnu Ambadi Certificate.Pdf</li>

                                            <li><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 13.5V9M9 9L6.75 10.5M9 9L11.25 10.5M9.75 2.25065C9.67838 2.25 9.59796 2.25 9.50604 2.25H6.15015C5.31007 2.25 4.88972 2.25 4.56885 2.41349C4.2866 2.5573 4.0573 2.7866 3.91349 3.06885C3.75 3.38972 3.75 3.81007 3.75 4.65015V13.3501C3.75 14.1902 3.75 14.61 3.91349 14.9309C4.0573 15.2132 4.2866 15.4429 4.56885 15.5867C4.8894 15.75 5.30925 15.75 6.14771 15.75L11.8523 15.75C12.6908 15.75 13.11 15.75 13.4305 15.5867C13.7128 15.4429 13.9429 15.2132 14.0867 14.9309C14.25 14.6104 14.25 14.1911 14.25 13.3527V6.99426C14.25 6.90222 14.25 6.82171 14.2493 6.75M9.75 2.25065C9.96423 2.2526 10.0998 2.26038 10.2291 2.29145C10.3822 2.32819 10.5284 2.38895 10.6626 2.47119C10.8139 2.56392 10.9439 2.69386 11.2031 2.95312L13.5472 5.29724C13.8067 5.55667 13.9357 5.68602 14.0284 5.8374C14.1107 5.9716 14.1715 6.11794 14.2083 6.271C14.2393 6.40032 14.2473 6.53588 14.2493 6.75M9.75 2.25065V4.35C9.75 5.19008 9.75 5.60983 9.91349 5.93069C10.0573 6.21294 10.2866 6.44286 10.5688 6.58667C10.8894 6.75 11.3092 6.75 12.1477 6.75H14.2493M14.2493 6.75H14.2501" stroke="#232648" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg> BSC Transcript.pdf</li>

                                            <li><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 13.5V9M9 9L6.75 10.5M9 9L11.25 10.5M9.75 2.25065C9.67838 2.25 9.59796 2.25 9.50604 2.25H6.15015C5.31007 2.25 4.88972 2.25 4.56885 2.41349C4.2866 2.5573 4.0573 2.7866 3.91349 3.06885C3.75 3.38972 3.75 3.81007 3.75 4.65015V13.3501C3.75 14.1902 3.75 14.61 3.91349 14.9309C4.0573 15.2132 4.2866 15.4429 4.56885 15.5867C4.8894 15.75 5.30925 15.75 6.14771 15.75L11.8523 15.75C12.6908 15.75 13.11 15.75 13.4305 15.5867C13.7128 15.4429 13.9429 15.2132 14.0867 14.9309C14.25 14.6104 14.25 14.1911 14.25 13.3527V6.99426C14.25 6.90222 14.25 6.82171 14.2493 6.75M9.75 2.25065C9.96423 2.2526 10.0998 2.26038 10.2291 2.29145C10.3822 2.32819 10.5284 2.38895 10.6626 2.47119C10.8139 2.56392 10.9439 2.69386 11.2031 2.95312L13.5472 5.29724C13.8067 5.55667 13.9357 5.68602 14.0284 5.8374C14.1107 5.9716 14.1715 6.11794 14.2083 6.271C14.2393 6.40032 14.2473 6.53588 14.2493 6.75M9.75 2.25065V4.35C9.75 5.19008 9.75 5.60983 9.91349 5.93069C10.0573 6.21294 10.2866 6.44286 10.5688 6.58667C10.8894 6.75 11.3092 6.75 12.1477 6.75H14.2493M14.2493 6.75H14.2501" stroke="#232648" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg> Secondary School Certificate.pdf</li>

                                            <li><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 13.5V9M9 9L6.75 10.5M9 9L11.25 10.5M9.75 2.25065C9.67838 2.25 9.59796 2.25 9.50604 2.25H6.15015C5.31007 2.25 4.88972 2.25 4.56885 2.41349C4.2866 2.5573 4.0573 2.7866 3.91349 3.06885C3.75 3.38972 3.75 3.81007 3.75 4.65015V13.3501C3.75 14.1902 3.75 14.61 3.91349 14.9309C4.0573 15.2132 4.2866 15.4429 4.56885 15.5867C4.8894 15.75 5.30925 15.75 6.14771 15.75L11.8523 15.75C12.6908 15.75 13.11 15.75 13.4305 15.5867C13.7128 15.4429 13.9429 15.2132 14.0867 14.9309C14.25 14.6104 14.25 14.1911 14.25 13.3527V6.99426C14.25 6.90222 14.25 6.82171 14.2493 6.75M9.75 2.25065C9.96423 2.2526 10.0998 2.26038 10.2291 2.29145C10.3822 2.32819 10.5284 2.38895 10.6626 2.47119C10.8139 2.56392 10.9439 2.69386 11.2031 2.95312L13.5472 5.29724C13.8067 5.55667 13.9357 5.68602 14.0284 5.8374C14.1107 5.9716 14.1715 6.11794 14.2083 6.271C14.2393 6.40032 14.2473 6.53588 14.2493 6.75M9.75 2.25065V4.35C9.75 5.19008 9.75 5.60983 9.91349 5.93069C10.0573 6.21294 10.2866 6.44286 10.5688 6.58667C10.8894 6.75 11.3092 6.75 12.1477 6.75H14.2493M14.2493 6.75H14.2501" stroke="#232648" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg> Jishnu Ambadi Certificate.Pdf</li>
                                        </ul>

                                    </div>


                                    <div className='add-document-block'>
                                        <Image src={Doc} alt='Doc' width={200} height={200} />

                                        <h3>Add<span>Document</span></h3>
                                        <h4>Max 10 MB files are allowed</h4>

                                    </div>
                                </div>

                                <div className='md:w-7/12 lg:w-7/12 pad-25'>
                                    <div className='doc-preview-block'>
                                        <Image src={DocPreview} alt='DocPreview' width={340} height={300} />
                                    </div>

                                    <div className='degree-block'>
                                        <h2>Degree Certificate</h2>
                                        <div className='degree-btn-block'>
                                            <Button className='degree-btn'>Approve <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none"><path d="M7.875 13.5H19.125M19.125 13.5L14.625 9M19.125 13.5L14.625 18" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></Button>

                                            <Button className='Reject-btn'>Approve <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 9L11.9999 11.9999M11.9999 11.9999L14.9999 14.9999M11.9999 11.9999L9 14.9999M11.9999 11.9999L14.9999 9M4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4801 4 18.9079 4.21799C19.2842 4.40973 19.5905 4.71547 19.7822 5.0918C20.0002 5.51962 20.0002 6.07967 20.0002 7.19978V16.7998C20.0002 17.9199 20.0002 18.48 19.7822 18.9078C19.5905 19.2841 19.2842 19.5905 18.9079 19.7822C18.4805 20 17.9215 20 16.8036 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></Button>
                                        </div>
                                    </div>

                                </div>
                            </div>



                            {
                                list?.data?.length > 0 ?

                                    <>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>

                                                            <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                                Name
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                                Document
                                                            </Typography>
                                                        </TableCell>
                                                        {/* <TableCell>
                                                                <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                                    Created By
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                                    Created Date
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                                    Uploaded By
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                                    Uploaded Date
                                                                </Typography>
                                                            </TableCell> */}
                                                        <TableCell>
                                                            <Typography variant="subtitle1" sx={{ color: 'black' }} fontWeight="bold">
                                                                Status
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        list?.data?.map((obj, index) => (
                                                            <TableRow key={obj?.id}>
                                                                <TableCell sx={{ cursor: 'pointer' }} onClick={() => handleDetailOpen(obj?.id)}><Tooltip title={obj?.note}>{obj?.title || obj?.document_template?.name}</Tooltip></TableCell>
                                                                <TableCell><a href={obj?.file} target='_blank' style={{ color: blue[700], textDecoration: 'underLine' }} >{trimUrlAndNumbers(obj?.file)}</a></TableCell>
                                                                {/* <TableCell>{obj?.created_by?.name}</TableCell>
                                                                    <TableCell>{moment(obj?.created_at).format('DD-MM-YYYY')}</TableCell>
                                                                    <TableCell>{obj?.uploaded_by?.name}</TableCell>
                                                                    <TableCell>{moment(obj?.created_at).format('DD-MM-YYYY')}</TableCell> */}
                                                                <TableCell>{obj?.status}</TableCell>
                                                                <TableCell>
                                                                    {
                                                                        (from != 'app') &&
                                                                        obj?.status == 'Requested' &&
                                                                        <>
                                                                            <Upload onClick={() => handleUploadRejectedDoc(obj)} sx={{ color: blue[400], cursor: 'pointer' }} fontSize='small' />
                                                                        </>
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {
                                                                        (from != 'app') &&
                                                                        obj?.status != 'Requested' &&
                                                                        <>
                                                                            <Button onClick={() => handleAccept(obj?.id)} sx={{ textTransform: 'none', mr: 1 }} size='small' className='bg-lime-300 text-black hover:bg-lime-400'>Approve</Button>
                                                                            <Button onClick={() => handleReject(obj?.id)} sx={{ textTransform: 'none', mr: 5 }} size='small' className='bg-red-500 text-white hover:bg-red-600'>Reject</Button>
                                                                            <Edit onClick={() => handleEditDocument(obj?.id)} sx={{ color: blue[400], cursor: 'pointer' }} fontSize='small' />
                                                                        </>
                                                                    }
                                                                </TableCell>
                                                                {/* <TableCell><Edit onClick={() => handleEditDocument(obj?.id)} sx={{ color: blue[400], cursor: 'pointer' }} fontSize='small' /></TableCell> */}
                                                            </TableRow>
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
                                    </>

                                    :
                                    <h4>You have no Documents</h4>
                            }
                        </div>
                }

            </div>
            {
                (from == 'app' && !loading) &&
                <>
                    <Grid p={1} height={60} width={'100%'} style={{ border: '1px solid grey' }} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Grid>
                            <Grid><a style={{ fontWeight: 'bold' }}>Acceptance Letter</a></Grid>
                            <Grid>
                                {
                                    app_details?.acceptance_letter ?
                                        <a href={app_details?.acceptance_letter} target='_blank' style={{ color: blue[700], textDecoration: 'underLine', fontSize: '14px' }} >{trimUrlAndNumbers(app_details?.acceptance_letter)}</a>
                                        :
                                        <a style={{ fontSize: '14px', color: 'grey' }}>No Document</a>
                                }
                            </Grid>
                        </Grid>
                        <Grid display={'flex'}>
                            {
                                app_details?.acceptance_letter &&
                                <>
                                    <Tooltip title={'Download Document'}><DownloadOutlined onClick={() => downloadFile(app_details?.acceptance_letter, 'Acceptance Letter')} sx={{ color: 'grey', mr: 1, cursor: 'pointer' }} /></Tooltip>
                                    <Tooltip title={'Delete Document'}><DeleteOutline sx={{ color: 'grey', mr: 1, cursor: 'pointer' }} /></Tooltip>
                                </>
                            }
                            <Tooltip title={'Upload Document'}><UploadOutlined onClick={() => handleOpenAppDoc('acceptLetter')} sx={{ color: 'grey', mr: 1, cursor: 'pointer' }} /></Tooltip>
                        </Grid>

                    </Grid>
                </>
            }
            {
                (from == 'app' && !loading) &&
                <>
                    <Grid mt={1} p={1} height={60} width={'100%'} style={{ border: '1px solid grey' }} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Grid>
                            <Grid><a style={{ fontWeight: 'bold' }}>Fee Receipt</a></Grid>
                            <Grid>
                                {
                                    app_details?.fee_receipt ?
                                        <a href={app_details?.fee_receipt} target='_blank' style={{ color: blue[700], textDecoration: 'underLine', fontSize: '14px' }} >{trimUrlAndNumbers(app_details?.fee_receipt)}</a>
                                        :
                                        <a style={{ fontSize: '14px', color: 'grey' }}>No Document</a>
                                }
                            </Grid>
                        </Grid>
                        <Grid display={'flex'}>
                            {
                                app_details?.fee_receipt &&
                                <>
                                    <Tooltip title={'Download Document'}><DownloadOutlined onClick={() => downloadFile(app_details?.fee_receipt, 'Fee Receipt')} sx={{ color: 'grey', mr: 1, cursor: 'pointer' }} /></Tooltip>
                                    <Tooltip title={'Delete Document'}><DeleteOutline sx={{ color: 'grey', mr: 1, cursor: 'pointer' }} /></Tooltip>
                                </>
                            }
                            <Tooltip title={'Upload Document'}><UploadOutlined onClick={() => handleOpenAppDoc('feeReciept')} sx={{ color: 'grey', mr: 1, cursor: 'pointer' }} /></Tooltip>
                        </Grid>

                    </Grid>
                </>
            }
            {
                (from == 'app' && !loading) &&
                <>
                    <Grid mt={1} p={1} height={60} width={'100%'} style={{ border: '1px solid grey' }} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Grid>
                            <Grid><a style={{ fontWeight: 'bold' }}>CAS Document</a></Grid>
                            <Grid>
                                {
                                    app_details?.cas_document ?
                                        <a href={app_details?.cas_document} target='_blank' style={{ color: blue[700], textDecoration: 'underLine', fontSize: '14px' }} >{trimUrlAndNumbers(app_details?.cas_document)}</a>
                                        :
                                        <a style={{ fontSize: '14px', color: 'grey' }}>No Document</a>
                                }
                            </Grid>
                        </Grid>
                        <Grid display={'flex'}>
                            {
                                app_details?.cas_document &&
                                <>
                                    <Tooltip title={'Download Document'}><DownloadOutlined onClick={() => downloadFile(app_details?.cas_document, 'CAS Document')} sx={{ color: 'grey', mr: 1, cursor: 'pointer' }} /></Tooltip>
                                    <Tooltip title={'Delete Document'}><DeleteOutline sx={{ color: 'grey', mr: 1, cursor: 'pointer' }} /></Tooltip>
                                </>
                            }
                            <Tooltip title={'Upload Document'}><UploadOutlined onClick={() => handleOpenAppDoc('casDocument')} sx={{ color: 'grey', mr: 1, cursor: 'pointer' }} /></Tooltip>
                        </Grid>

                    </Grid>
                </>
            }

        </>
    )
}

export default LeadDocuments

const loadTable = () => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    {[...Array(5)].map((_, index) => (
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
                                [...Array(5)]?.map((_, colindex) => (
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
