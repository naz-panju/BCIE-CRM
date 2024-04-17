import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import LeadDocumentModal from './create'
import { useEffect } from 'react'
import { LeadApi } from '@/data/Endpoints/Lead'
import moment from 'moment'
import LeadDocumentRequest from './request'
import { DeleteOutline, DownloadOutlined, Edit, UploadOutlined } from '@mui/icons-material'
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

function LeadDocuments({ lead_id, from, app_id, app_details, appRefresh }) {

    console.log(app_details);

    const [editId, setEditId] = useState()
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const [reqId, setReqId] = useState()
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
        console.log(params);
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

    function downloadFile(url, fileName) {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', ''); // Force download by setting download attribute to empty string

        // Append the anchor to the body
        document.body.appendChild(link);

        // Trigger the click event on the anchor
        link.click();

        // Remove the anchor from the body
        document.body.removeChild(link);
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
            <LeadDocumentRequest id={lead_id} reqId={reqId} setReqId={setReqId} />

            <ApplicationDocumentUpload appRefresh={appRefresh} datas={app_details} lead_id={lead_id} from={from} app_id={app_id} editId={appDocId} setEditId={setAppDocId} handleRefresh={handleRefresh} />

            <LeadDocumentDetailModal id={detailId} setId={setDetailId} />

            <DocumentConfirmPopup ID={confirmId} setID={setconfirmId} loading={confirmLoading} setLoading={setconfirmLoading} title={'Are your want to Approve this Document?'} getDetails={handleRefresh} />
            <DocumentRejectPopup ID={rejectId} setID={setrejectId} loading={confirmLoading} setLoading={setconfirmLoading} title={'Are your want to Reject this Document?'} getDetails={handleRefresh} />

            <div className='lead-tabpanel-content-block timeline'>
                <div className='lead-tabpanel-content-block-title'>
                    <h2>Documents</h2>
                    {
                        from != 'app' &&
                        <Grid display={'flex'} alignItems={'end'}>
                            <Button onClick={handleCreate} className='bg-sky-500 mr-4' sx={{ color: 'white', '&:hover': { backgroundColor: '#0c8ac2' } }}>Add</Button>
                            <Button onClick={handleRequest} className='bg-sky-400 ' sx={{ color: 'white', '&:hover': { backgroundColor: '#0c8ac2' } }}>Request</Button>
                        </Grid>
                    }
                </div>
                {
                    loading ?
                        loadTable()
                        :
                        <div className='no-follw-up-block'>
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
                                                                        from != 'app' &&
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
