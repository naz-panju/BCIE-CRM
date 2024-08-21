import { Box, Button, Grid, Tooltip, tooltipClasses, styled, Skeleton } from '@mui/material'
import React, { useState } from 'react'
import LeadDocumentModal from './create'
import { useEffect } from 'react'
import { LeadApi } from '@/data/Endpoints/Lead'
import moment from 'moment'
import LeadDocumentRequest from './request'
import { CheckCircle, Edit, VisibilityOutlined, ZoomInOutlined } from '@mui/icons-material'
import { blue, red } from '@mui/material/colors'
import LeadDocumentDetailModal from './Modal'
import DocumentConfirmPopup from './confirmPopup'
import DocumentRejectPopup from './rejectPopup'
import toast from 'react-hot-toast';
import ApplicationDocumentUpload from './applicationDocUpload'
import LeadRequestUploadDocumentModal from './UploadRequestedDoc'
import Doc from '@/img/doc.png';
import Image from 'next/image'
import PdfViewer from '@/Form/PdfViewer'
import { useSession } from 'next-auth/react'
import { ListingApi } from '@/data/Endpoints/Listing'
import DocViewer from '@/Form/DocViewer'
import DocView from '@/Form/DocViewer'
import IframeComponent from '@/Form/Iframe'

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

function LeadDocuments({ lead_id, from, app_id, app_details, appRefresh, leadData }) {

    const session = useSession()


    const [editId, setEditId] = useState()
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const [reqId, setReqId] = useState()
    const [reqUploadId, setreqUploadId] = useState()
    const [refresh, setRefresh] = useState(false)

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(100);

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
        fetchList(true)
    }

    const [first, setfirst] = useState(0)
    const [imageLoading, setimageLoading] = useState(0)

    const fetchList = async (select) => {
        setLoading(true)

        // if (first == 0) {
        //     setimageLoading(true)
        // }

        let params = {
            lead_id: lead_id,
            limit: limit,
            keyword: searchKey,
            page: page + 1
        }
        if (from == 'app') {
            params['application_id'] = app_id
        }
        try {
            const response = await LeadApi.listDocuments(params)
            if (response?.status == 200 || response?.status == 201) {
                setList(response?.data)
                if (select) {
                    setdocumentSelected(response?.data?.data[0])
                }
                // setfirst(first + 1)
                setLoading(false)
                setimageLoading(false)

            } else {
                toast.error(response?.response?.data?.message)
                setimageLoading(false)
                setLoading(false)

            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
            setimageLoading(false)
            setLoading(false)

        }

    }

    // console.log(leadData);
    const [mandatoryDocuments, setmandatoryDocuments] = useState([])
    const mandatoryTemplate = () => {
        ListingApi.documentTemplate().then((response) => {
            if (leadData?.lead_source?.id == 10) {
                const carryoverDoc = response?.data?.data?.find(obj => obj?.id == 19)
                setmandatoryDocuments([carryoverDoc])
            } else {
                const mandatoryDocs = response?.data?.data?.filter(obj => obj?.is_mandatory === 1);
                setmandatoryDocuments(mandatoryDocs);
            }
        })
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



    function trimUrlAndNumbers(url) {
        const lastSlashIndex = url?.lastIndexOf('/');
        let trimmedString = url?.substring(lastSlashIndex + 1);
        trimmedString = trimmedString?.replace(/[0-9]/g, ''); // Replace all numeric characters with an empty string
        return trimmedString?.replace(/_/g, ''); // Replace all underscores with an empty string
    }

    const [documentSelected, setdocumentSelected] = useState()
    const handleSelectDocument = (obj) => {
        setdocumentSelected(obj)
    }

    const handleDeselectDocument = () => {
        setdocumentSelected()
    }


    const [searchKey, setsearchKey] = useState()

    useEffect(() => {
        mandatoryTemplate()
    }, [])

    useEffect(() => {
        fetchList()
    }, [refresh, page, searchKey])

    return (
        <>
            <LeadDocumentModal lead_id={lead_id} from={from} app_id={app_id} editId={editId} setEditId={setEditId} handleRefresh={handleRefresh} />
            <LeadDocumentRequest id={lead_id} reqId={reqId} setReqId={setReqId} fetchList={fetchList} handleDeselectDocument={handleDeselectDocument} />
            <LeadRequestUploadDocumentModal datas={reqUploadId} lead_id={lead_id} from={from} app_id={app_id} editId={reqUploadId?.id} setEditId={setreqUploadId} handleRefresh={handleRefresh} setdocumentSelected={setdocumentSelected} />

            <ApplicationDocumentUpload appRefresh={appRefresh} datas={app_details} lead_id={lead_id} from={from} app_id={app_id} editId={appDocId} setEditId={setAppDocId} handleRefresh={handleRefresh} />

            <LeadDocumentDetailModal id={detailId} setId={setDetailId} />

            <DocumentConfirmPopup ID={confirmId} setID={setconfirmId} loading={confirmLoading} setLoading={setconfirmLoading} title={'Do you want to Approve this Document?'} getDetails={handleRefresh} />
            <DocumentRejectPopup lead_id={lead_id} details={documentSelected} ID={rejectId} setID={setrejectId} loading={confirmLoading} setLoading={setconfirmLoading} title={'Do you want to Reject this Document?'} getDetails={handleRefresh} />

            <div className='lead-tabpanel-content-block timeline'>
                <div className='lead-tabpanel-content-block-title'>
                    <div className='lead-detail-title'>
                        Download & Upload Documents
                    </div>

                    {
                        session?.data?.user?.role?.id != 6 && leadData?.closed != 1 && leadData?.withdrawn != 1 && leadData?.completed != 1 &&
                        <Grid display={'flex'} alignItems={'end'}>
                            {/* <Button onClick={handleCreate} className='bg-sky-500 mr-4' sx={{ color: 'white', '&:hover': { backgroundColor: '#0c8ac2' } }}>Add</Button> */}
                            <Button onClick={handleRequest} className='bg-sky-400 Request-Document-btn' ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">  <path d="M19 19L16 16M10.0002 20H7.19692C6.07901 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4796 4 18.9074 4.21799C19.2837 4.40973 19.5905 4.71547 19.7822 5.0918C20 5.5192 20 6.07899 20 7.19691V10.0002M13.5 17C11.567 17 10 15.433 10 13.5C10 11.567 11.567 10 13.5 10C15.433 10 17 11.567 17 13.5C17 15.433 15.433 17 13.5 17Z" stroke="#232648" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg> Request Document</Button>
                        </Grid>
                    }

                </div>

                <div className='no-follw-up-block document-block'>

                    <div className='flex mar-25'>
                        <div className='md:w-5/12 lg:w-5/12 pad-25'>
                            <div className='search-document-block'>
                                <div className='flex mb-1'>
                                    <HtmlTooltip
                                        title={
                                            <React.Fragment>
                                                <table style={{ borderCollapse: 'collapse', width: '100%', padding: 0 }}>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Mandatory Documents</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {mandatoryDocuments?.map((docs, ind) => {
                                                            const selectedDocuments = list?.data || [];
                                                            return (<tr key={ind}>
                                                                <td className='flex justify-between' style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                                    <span style={{ cursor: 'pointer' }} > {docs?.name}</span>
                                                                    <CheckCircle fontSize='small'
                                                                        color={
                                                                            selectedDocuments?.some(doc => doc?.document_template?.id === docs?.id && doc?.status === 'Accepted') ? 'success' : 'disabled'
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>)
                                                        })}
                                                    </tbody>
                                                </table>
                                            </React.Fragment>
                                        }
                                    >
                                        <VisibilityOutlined fontSize='small' sx={{ color: '#689df6', cursor: 'pointer', ml: 'auto' }} />
                                    </HtmlTooltip>
                                </div>
                                <div className='search-document-block-input'>
                                    <input onChange={(e) => setsearchKey(e.target.value)} placeholder='Search Documents' />
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">  <path d="M12.5 12.5L17.5 17.5M8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667Z" stroke="#0B0D23" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>

                                <ul className='search-document-block-pred'>
                                    {
                                        loading ?
                                            loadTable()
                                            :
                                            list?.data?.length > 0 ?
                                                list?.data?.map((obj, index) => (
                                                    <li className={documentSelected?.id == obj?.id ? 'Active' : ''} onClick={() => handleSelectDocument(obj)} key={index}>
                                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 13.5V9M9 9L6.75 10.5M9 9L11.25 10.5M9.75 2.25065C9.67838 2.25 9.59796 2.25 9.50604 2.25H6.15015C5.31007 2.25 4.88972 2.25 4.56885 2.41349C4.2866 2.5573 4.0573 2.7866 3.91349 3.06885C3.75 3.38972 3.75 3.81007 3.75 4.65015V13.3501C3.75 14.1902 3.75 14.61 3.91349 14.9309C4.0573 15.2132 4.2866 15.4429 4.56885 15.5867C4.8894 15.75 5.30925 15.75 6.14771 15.75L11.8523 15.75C12.6908 15.75 13.11 15.75 13.4305 15.5867C13.7128 15.4429 13.9429 15.2132 14.0867 14.9309C14.25 14.6104 14.25 14.1911 14.25 13.3527V6.99426C14.25 6.90222 14.25 6.82171 14.2493 6.75M9.75 2.25065C9.96423 2.2526 10.0998 2.26038 10.2291 2.29145C10.3822 2.32819 10.5284 2.38895 10.6626 2.47119C10.8139 2.56392 10.9439 2.69386 11.2031 2.95312L13.5472 5.29724C13.8067 5.55667 13.9357 5.68602 14.0284 5.8374C14.1107 5.9716 14.1715 6.11794 14.2083 6.271C14.2393 6.40032 14.2473 6.53588 14.2493 6.75M9.75 2.25065V4.35C9.75 5.19008 9.75 5.60983 9.91349 5.93069C10.0573 6.21294 10.2866 6.44286 10.5688 6.58667C10.8894 6.75 11.3092 6.75 12.1477 6.75H14.2493M14.2493 6.75H14.2501" stroke="#232648" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg> */}
                                                        {obj?.title || obj?.document_template?.name}


                                                        <div style={{ textAlign: 'end', color: '#898989' }}>
                                                            {obj?.status !== 'Uploaded' &&
                                                                <span></span>
                                                            }
                                                            {obj?.status !== 'Uploaded' && obj?.status}
                                                        </div>

                                                    </li>
                                                ))
                                                :
                                                <div style={{ height: '100%', width: '100%' }} className='flex justify-center items-center'> No Documents Found</div>
                                    }
                                </ul>

                            </div>

                            {
                                session?.data?.user?.role?.id != 6 && leadData?.closed != 1 && leadData?.withdrawn != 1 && leadData?.completed != 1 &&
                                <div onClick={handleCreate} style={{ cursor: 'pointer' }} className='add-document-block'>
                                    <Image src={Doc} alt='Doc' width={200} height={200} />

                                    <h3>Add<span>Document</span></h3>
                                    {/* <h4>Max 10 MB files are allowed</h4> */}

                                </div>
                            }
                        </div>

                        <div className='md:w-7/12 lg:w-7/12 pad-25'>

                            {
                                !documentSelected ?
                                    <div className='doc-preview-block'>
                                        <div className='doc-preview-block'>
                                            <div className='doc-req-icon doc-request'>
                                                <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15.3748 29.0417H25.6248M15.3748 23.9167H25.6248M22.2088 5.12649C22.0456 5.125 21.862 5.125 21.6525 5.125H14.0085C12.095 5.125 11.1375 5.125 10.4067 5.4974C9.76377 5.82496 9.24147 6.34727 8.9139 6.99015C8.5415 7.72102 8.5415 8.67849 8.5415 10.592V30.4087C8.5415 32.3222 8.5415 33.2784 8.9139 34.0093C9.24147 34.6522 9.76377 35.1754 10.4067 35.503C11.1368 35.875 12.0931 35.875 14.0029 35.875L26.9968 35.875C28.9066 35.875 29.8615 35.875 30.5916 35.503C31.2345 35.1754 31.7586 34.6522 32.0861 34.0093C32.4582 33.2791 32.4582 32.3242 32.4582 30.4144V15.9314C32.4582 15.7218 32.458 15.5382 32.4565 15.375M22.2088 5.12649C22.6965 5.13094 23.0038 5.14903 23.2984 5.21976C23.647 5.30346 23.9812 5.44149 24.2869 5.62882C24.6316 5.84005 24.9275 6.13601 25.5181 6.72656L30.8574 12.0659C31.4484 12.6568 31.7422 12.9515 31.9534 13.2963C32.1408 13.602 32.2794 13.9353 32.3631 14.2839C32.4338 14.5786 32.4521 14.8873 32.4565 15.375M22.2088 5.12649L22.2082 9.90869C22.2082 11.8222 22.2082 12.7786 22.5806 13.5095C22.9081 14.1523 23.4304 14.6754 24.0733 15.003C24.8035 15.375 25.7598 15.375 27.6696 15.375H32.4565" stroke="#74BF77" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <h2>Select Document to <br />Preview It.</h2>
                                        </div>

                                    </div>
                                    :
                                    <>
                                        {
                                            (documentSelected?.file && documentSelected?.status !== "Requested") &&
                                            <div className='doc-preview-block'>
                                                <div className='flex justify-end mb-5'>
                                                    <a style={{ cursor: 'pointer' }} target='_blank' href={documentSelected?.file} > <ZoomInOutlined sx={{ color: '#858585' }} /> </a>
                                                </div>

                                                {(
                                                    documentSelected.file.endsWith('.pdf') ? (
                                                        <PdfViewer fileUrl={documentSelected?.file} />
                                                    ) :
                                                        <DocView doc={documentSelected?.file} />
                                                    // <Image src={documentSelected?.file} alt='DocPreview' width={340} height={300} />
                                                )}
                                            </div>
                                        }

                                        {
                                            (!documentSelected?.file && documentSelected?.status == "Requested") &&
                                            <div className='doc-preview-block'>
                                                <div className='doc-req-icon doc-request'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41" fill="none"><path d="M20.5 11.9583V20.5H29.0417M20.5 35.875C12.0086 35.875 5.125 28.9914 5.125 20.5C5.125 12.0086 12.0086 5.125 20.5 5.125C28.9914 5.125 35.875 12.0086 35.875 20.5C35.875 28.9914 28.9914 35.875 20.5 35.875Z" stroke="#FEA878" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </div>
                                                <h2>This Document has been <br /> Requested</h2>
                                                <span onClick={() => handleUploadRejectedDoc(documentSelected)} style={{ textDecoration: 'underLine', cursor: 'pointer', color: '#1849D6' }}>Click here to upload the Document</span>
                                            </div>
                                        }
                                    </>
                            }







                            <div className='degree-block'>
                                {
                                    documentSelected &&
                                    <div className='d-flex justify-between align-center'>
                                        <h2>{documentSelected?.title || documentSelected?.document_template?.name}</h2>
                                        {
                                            session?.data?.user?.role?.id != 6 && leadData?.closed != 1 && leadData?.withdrawn != 1 && leadData?.completed != 1 &&
                                            (documentSelected?.status == 'Uploaded') && 
                                            <Edit onClick={() => handleEditDocument(documentSelected?.id)} sx={{ color: blue[400], cursor: 'pointer' }} fontSize='small' />
                                        }
                                    </div>
                                }

                                {
                                    documentSelected && documentSelected?.note &&
                                    <div className='d-flex justify-between align-center'>
                                        <div className='flex bh-lime-50 align-center'>
                                            <span style={{ fontSize: '13px', color: 'grey' }}><span style={{ fontWeight: 'bold' }}>Remarks:</span> {documentSelected?.note}</span>
                                        </div>
                                    </div>
                                }

                                {
                                    documentSelected && documentSelected?.reject_reason &&
                                    <div className='d-flex justify-between align-center'>
                                        <div className='flex bh-lime-50 align-center mt-2'>
                                            <span style={{ fontSize: '13px', color: red[300] }}><span style={{ fontWeight: 'bold' }}>Rejection Note:</span> {documentSelected?.reject_reason}</span>
                                        </div>
                                    </div>
                                }

                                {
                                    session?.data?.user?.role?.id != 6 && leadData?.closed != 1 && leadData?.withdrawn != 1 && leadData?.completed != 1 && documentSelected &&
                                    <div className='degree-btn-block'>
                                        <Button disabled={!documentSelected || (!documentSelected?.file && documentSelected?.status == "Requested") || documentSelected?.status == "Accepted" || documentSelected?.status == "Rejected"} onClick={() => handleAccept(documentSelected?.id)} className={`degree-btn ${!documentSelected || (!documentSelected?.file && documentSelected?.status == "Requested") || documentSelected?.status == "Accepted" || documentSelected?.status == "Rejected" ? 'Doc-Button-disabled' : ''} `}>Accept <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none"><path d="M7.875 13.5H19.125M19.125 13.5L14.625 9M19.125 13.5L14.625 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></Button>
                                        <Button disabled={!documentSelected || (!documentSelected?.file && documentSelected?.status == "Requested") || documentSelected?.status == "Accepted" || documentSelected?.status == "Rejected"} onClick={() => handleReject(documentSelected?.id)} className={`Reject-btn ${!documentSelected || (!documentSelected?.file && documentSelected?.status == "Requested") || documentSelected?.status == "Accepted" || documentSelected?.status == "Rejected" ? 'Doc-Button-disabled' : ''} `}>Reject <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 9L11.9999 11.9999M11.9999 11.9999L14.9999 14.9999M11.9999 11.9999L9 14.9999M11.9999 11.9999L14.9999 9M4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4801 4 18.9079 4.21799C19.2842 4.40973 19.5905 4.71547 19.7822 5.0918C20.0002 5.51962 20.0002 6.07967 20.0002 7.19978V16.7998C20.0002 17.9199 20.0002 18.48 19.7822 18.9078C19.5905 19.2841 19.2842 19.5905 18.9079 19.7822C18.4805 20 17.9215 20 16.8036 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></Button>
                                    </div>
                                }

                            </div>

                        </div>
                    </div>


                </div>


            </div>

        </>
    )
}

export default LeadDocuments

const loadTable = () => {
    return (

        <>
            {
                [...Array(4)]?.map((_, index) => (
                    <li key={index}>
                        <Skeleton variant='rounded' width={'90%'} height={20} />
                    </li>
                ))
            }

        </>

    )

}
