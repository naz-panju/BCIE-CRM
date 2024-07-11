import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Checkbox, FormControlLabel, Grid, IconButton, Paper, Skeleton, TextField, Tooltip, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Close, CloseOutlined, Delete, Download, Refresh, Visibility } from '@mui/icons-material';
import { ListingApi } from '@/data/Endpoints/Listing';
import SelectX from '@/Form/SelectX';
import { useState } from 'react';
import AsyncSelect from "react-select/async";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab';
import LoadingEdit from '@/Components/Common/Loading/LoadingEdit';
import toast from 'react-hot-toast';
import { LeadApi } from '@/data/Endpoints/Lead';
import ReactSelector from 'react-select';
import { ApplicationApi } from '@/data/Endpoints/Application';
import TextInput from '@/Form/TextInput';
import DateInput from '@/Form/DateInput';
import moment from 'moment';
import UniversityDocumentModal from './universityDocument';
import ConfirmPopup from '@/Components/Common/Popup/confirm';
import DownloadDocumentModal from '@/Components/Applications/Modals/downloadDocument';
import Doc from '@/img/doc.png';
import Image from 'next/image';



export default function ViewDocumentModal({ editId, setEditId, refresh, setRefresh, handleUniDocOpen, fetchTable }) {

    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const [dataLoading, setDataLoading] = useState(false)

    const [docId, setdocId] = useState()
    const [applicationId, setapplicationId] = useState()

    const [deleteId, setdeleteId] = useState()
    const [deleteLoading, setdeleteLoading] = useState(false)

    const handleDeleteOpen = (id) => {
        setdeleteId(id)
    }


    const handleDocumentOpen = () => {
        if (details?.id) {
            setValue('application_id', details?.application_number || '')
            setdocId(0)
            setapplicationId(details?.id)
        }
    }

    const handleDocumentClose = () => {
        settemplate()
        // setapp_id()
        setValue('template', '')
        setValue('application_id', '')
        setValue('amount', '')
        setValue('paid_date', '')
        setSelectedFile(null)
        setUploadLoading(false)
        setdocId()
        setapplicationId()

    }


    const items = [
        { label: 'Title' },
        { label: 'Due Date' },
        { label: 'Assigned To' },
        { label: 'Reviewer' },
        { label: 'Priority' },
        { label: 'Description', multi: true },

    ]

    const anchor = 'right'; // Set anchor to 'right'

    const [template, settemplate] = useState()
    let scheme = yup.object().shape({

        template: yup.object().required("Please Choose a Template").typeError("Please choose a Template"),
    })

    if (template?.stage?.action_type == 'Deposit Paid') {
        scheme = yup.object().shape({
            // template: yup.object().required("Please Choose a Template").typeError("Please choose a Template"),
            paid_date: yup.string().required("Please select Date").typeError("Please select Date"),
            amount: yup.string().required("Please enter Amount").typeError("Please enter Amount"),
        })
    }

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })

    const [details, setdetails] = useState()

    const [downloadId, setDownloadId] = useState()

    const handleDownlaodOpen = () => {
        if (details?.id) {
            setDownloadId(details?.id)
        }
    }


    const handleClose = () => {
        handleDocumentClose()
        setEditId()
        reset()
        setValue('amount', '')
        setValue('date', '')
        setOpen(false)
        setLoading(false)
    }

    const handleDrawerClose = (event) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        // Check if the close icon was clicked
        if (event.target.tagName === 'svg') {
            setOpen(false);
        }
    };


    const setInitialValue = () => {
        // console.log(details)
        setValue('amount', details?.deposit_amount_paid)
        setValue('date', details?.deposit_paid_on)
    }

    function trimUrlAndNumbers(url) {
        const lastSlashIndex = url?.lastIndexOf('/');
        let trimmedString = url?.substring(lastSlashIndex + 1);
        trimmedString = trimmedString?.replace(/[0-9]/g, ''); // Replace all numeric characters with an empty string
        return trimmedString?.replace(/_/g, ''); // Replace all underscores with an empty string
    }

    const getDetails = () => {
        setLoading(true)
        ApplicationApi.view({ id: editId }).then((response) => {
            setdetails(response?.data?.data)

            setLoading(false)
        })
    }

    const NoLoadDetails = () => {
        setDataLoading(true)
        ApplicationApi.view({ id: editId }).then((response) => {
            setdetails(response?.data?.data)
            setDataLoading(false)
        })
    }

    const handleDelete = () => {
        setdeleteLoading(true)
        ApplicationApi.deleteUniversityDocument({ id: deleteId }).then((response) => {
            if (response?.status == 200 || response?.status == 201) {
                toast.success(response?.data?.message)
                setdeleteLoading(false)
                setdeleteId()
                NoLoadDetails()
            } else {
                toast.error(response?.response?.data?.message)
                setdeleteLoading(false)
            }
        }).catch((error) => {
            toast.error(error?.response?.data?.message)
            setdeleteLoading(false)
        })
    }

    function handleDownload(fileUrl, filename) {
        fetch(fileUrl)
            .then(response => response.blob())
            .then(blob => {
                // Create a temporary anchor element
                const anchor = document.createElement('a');
                const url = window.URL.createObjectURL(blob);
                anchor.href = url;
                anchor.download = filename;

                // Programmatically trigger a click event on the anchor
                // This will initiate the download
                anchor.click();

                // Clean up
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('Error downloading the file:', error);
            });
    }



    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
            getDetails()
        } else if (editId == 0) {
            setOpen(true)
        }
    }, [editId])

    // console.log(details);


    const [selectedFile, setSelectedFile] = useState(null);
    const [fileInputKey, setFileInputKey] = useState(0);


    const handleFileChange = (event) => {
        setFileInputKey(prevKey => prevKey + 1);

        const file = event.target.files[0]
        const maxSize = watch('template')?.max_upload_size || size
        console.log(maxSize)
        if (file?.size > maxSize * 1024 * 1024) {
            toast.error(`File size exceeds ${maxSize}MB`)
        } else {
            setSelectedFile(file);
        }
    };


    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        const maxSize = watch('template')?.max_upload_size || size
        console.log(maxSize)
        if (file?.size > maxSize * 1024 * 1024) {
            toast.error(`File size exceeds ${maxSize}MB`)
        } else {
            setSelectedFile(file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDeleteFile = () => {
        setSelectedFile(null); // Clear selected file
    };

    const fetchTemplates = (e) => {
        return ListingApi.documentTemplate({ keyword: e, type: 'university' }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data;
            } else {
                return [];
            }
        })
    }


    const handleTemplateSelect = (e) => {
        settemplate(e || '')
        setValue('template', e || '');
    }

    function trimUrlAndNumbers(url) {
        const lastSlashIndex = url?.lastIndexOf('/');
        let trimmedString = url?.substring(lastSlashIndex + 1);
        trimmedString = trimmedString?.replace(/[0-9]/g, ''); // Replace all numeric characters with an empty string
        return trimmedString?.replace(/_/g, ''); // Replace all underscores with an empty string
    }

    const [changeStage, setChangeStage] = useState(true);
    const handleCheckboxChange = (event) => {
        setChangeStage(event.target.checked);
    };

    const [uploadLoading, setUploadLoading] = useState(false);
    const onSubmit = (data) => {
        // console.log(selectedFile);
        if (!selectedFile) {
            toast.error('Please select a File')
        } else {
            setUploadLoading(true)
            // console.log(data);

            const formData = new FormData()

            // application:id
            formData.append('id', applicationId)
            formData.append('document_template_id', data?.template?.id)
            if (selectedFile) {
                formData.append('document', selectedFile)
            }

            if (changeStage) {
                formData.append('stage', data?.template?.stage?.id)
            }

            // if (data?.template?.stage?.action_type == 'Get Application Id') {
            formData.append('application_number', data?.application_id)
            // }

            if (data?.template?.stage?.action_type == 'Deposit Paid') {
                let date = ''
                if (data?.paid_date) {
                    date = moment(data?.paid_date).format('YYYY-MM-DD')
                }
                formData.append('deposit_paid_on', date)
                formData.append('deposit_amount', data?.amount)
            }

            // for (const [key, value] of formData.entries()) {
            //     console.log(`${key}: ${value}`);
            // }

            let action;

            if (editId > 0) {
                // formData.append('id', editId)
                action = ApplicationApi.uploadUniversityDocument(formData)
            } else {
                action = ApplicationApi.uploadUniversityDocument(formData)
            }

            action.then((response) => {
                // console.log(response);
                if (response?.status == 200 || response?.status == 201) {
                    handleDocumentClose()
                    toast.success(response?.data?.message)
                    // handleRefresh()
                    // handleDocumentClose()
                    if (fetchTable) {
                        fetchTable()
                    }
                    getDetails()
                    setUploadLoading(false)
                } else {
                    toast.error(response?.response?.data?.message)
                    setUploadLoading(false)
                }
                setLoading(false)
            }).catch((error) => {
                console.log(error);
                toast.error(error?.response?.data?.message)
                setUploadLoading(false)
            })
        }

    }

    const [size, setsize] = useState()
    useEffect(() => {
        const session = sessionStorage.getItem('size')
        if (session) {
            setsize(session)
        }
    }, [])


    return (
        <div>
            {/* <UniversityDocumentModal app_id={applicationId} setapp_id={setapplicationId} editId={docId} setEditId={setdocId} handleRefresh={NoLoadDetails} fetchTable={fetchTable} details={details} /> */}
            <ConfirmPopup loading={deleteLoading} ID={deleteId} setID={setdeleteId} clickFunc={handleDelete} title={`Do you want to Delete this Document?`} />
            <DownloadDocumentModal editId={downloadId} setEditId={setDownloadId} />

            <Drawer
                anchor={anchor}
                open={open}
                onClose={handleClose}
            >
                <Grid width={650}>
                    <Grid p={1} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <a style={{ fontWeight: 500, fontSize: '19px' }}>Document Details</a>
                        <IconButton
                            onClick={handleClose}
                        >
                            <Close />
                        </IconButton>
                    </Grid>
                    <hr />
                    <div>

                        <Grid className='document-details-block' m={1} mb={4}>
                            <Grid className='document-details-block-title' mb={2} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                <button disabled style={{ display: 'flex', alignItems: 'center', backgroundColor: '#A6E9A9', color: '#0B0D23', padding: '8px 15px', fontSize: '14px', borderRadius: 5 }}><svg style={{ marginRight: '10px' }} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.75 10.0834H7.33333M5.04167 12.3751V7.79175M13.2917 12.8334C16.694 12.8334 18.4644 14.0051 19.0377 16.3484C19.3002 17.4214 18.3546 18.3334 17.25 18.3334H9.33334C8.22877 18.3334 7.28316 17.4214 7.54565 16.3484C8.11894 14.0051 9.88932 12.8334 13.2917 12.8334ZM13.2917 9.16675C14.8194 9.16675 15.5833 8.38103 15.5833 6.41675C15.5833 4.45246 14.8194 3.66675 13.2917 3.66675C11.7639 3.66675 11 4.45246 11 6.41675C11 8.38103 11.7639 9.16675 13.2917 9.16675Z" stroke="#232648" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg> Student Document</button>
                                {
                                    // details?.stage?.name !== 'CONDITIONAL OFFER' &&
                                    details?.documents?.length > 0 &&
                                    <Tooltip className='dw-btn' title={'Download'}><Download onClick={handleDownlaodOpen} fontSize='small' sx={{ mr: 2, color: '#689df6', cursor: 'pointer' }} /></Tooltip>
                                }
                            </Grid>
                            {
                                loading ?
                                    loadingDiv()
                                    :
                                    details?.documents?.length > 0 ?
                                        details?.documents?.map((obj, index) => (


                                            <Grid mb={1} key={index} container spacing={1} justifyContent="center">
                                                <Grid item p={1} xs={11.5}>
                                                    <Paper className='document-details-block-item' elevation={3} sx={{ p: 1 }}>
                                                        <Grid key={index} display={'flex'} justifyContent={'space-between'} alignItems={'center'} sx={{ mt: index !== 0 ? 1 : '' }}>
                                                            <a style={{ fontSize: '14px' }} target='_blank' href={obj?.file} key={index} >{trimUrlAndNumbers(obj?.title || obj?.document_template?.name)}</a>
                                                            <Grid className='document-details-block-item-icons' display={'flex'} alignItems={'center'}>

                                                                <Tooltip title={'Preview'}>
                                                                    <a target='_blank' href={obj?.file}>
                                                                        <Visibility fontSize='small' sx={{ color: '#689df6', }} />
                                                                    </a>
                                                                </Tooltip>

                                                                {/* <Tooltip title={'Preview'}><a target='_blank' href={obj?.file}><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.4229 8.28484C16.3997 8.23238 15.8372 6.98461 14.5868 5.73418C12.9207 4.06805 10.8162 3.1875 8.49999 3.1875C6.18374 3.1875 4.07933 4.06805 2.4132 5.73418C1.16277 6.98461 0.59765 8.23438 0.577064 8.28484C0.546858 8.35279 0.53125 8.42631 0.53125 8.50066C0.53125 8.57502 0.546858 8.64854 0.577064 8.71648C0.600306 8.76894 1.16277 10.0161 2.4132 11.2665C4.07933 12.932 6.18374 13.8125 8.49999 13.8125C10.8162 13.8125 12.9207 12.932 14.5868 11.2665C15.8372 10.0161 16.3997 8.76894 16.4229 8.71648C16.4531 8.64854 16.4687 8.57502 16.4687 8.50066C16.4687 8.42631 16.4531 8.35279 16.4229 8.28484ZM8.49999 12.75C6.45601 12.75 4.67035 12.0069 3.19214 10.542C2.58564 9.9388 2.06963 9.25101 1.66015 8.5C2.06947 7.74889 2.5855 7.06108 3.19214 6.45801C4.67035 4.99309 6.45601 4.25 8.49999 4.25C10.544 4.25 12.3296 4.99309 13.8078 6.45801C14.4155 7.06097 14.9327 7.74878 15.3432 8.5C14.8644 9.39383 12.7785 12.75 8.49999 12.75ZM8.49999 5.3125C7.86957 5.3125 7.2533 5.49944 6.72911 5.84969C6.20493 6.19994 5.79638 6.69776 5.55513 7.2802C5.31387 7.86264 5.25075 8.50354 5.37374 9.12185C5.49673 9.74016 5.80031 10.3081 6.24609 10.7539C6.69187 11.1997 7.25983 11.5033 7.87814 11.6263C8.49646 11.7492 9.13736 11.6861 9.7198 11.4449C10.3022 11.2036 10.8001 10.7951 11.1503 10.2709C11.5006 9.7467 11.6875 9.13043 11.6875 8.5C11.6866 7.65489 11.3505 6.84465 10.7529 6.24707C10.1553 5.64949 9.3451 5.31338 8.49999 5.3125ZM8.49999 10.625C8.07971 10.625 7.66886 10.5004 7.31941 10.2669C6.96995 10.0334 6.69759 9.7015 6.53675 9.3132C6.37591 8.92491 6.33383 8.49764 6.41582 8.08543C6.49782 7.67322 6.7002 7.29458 6.99739 6.9974C7.29458 6.70021 7.67322 6.49782 8.08543 6.41583C8.49764 6.33384 8.9249 6.37592 9.3132 6.53676C9.70149 6.69759 10.0334 6.96996 10.2669 7.31941C10.5004 7.66887 10.625 8.07971 10.625 8.5C10.625 9.06359 10.4011 9.60409 10.0026 10.0026C9.60408 10.4011 9.06358 10.625 8.49999 10.625Z" fill="#0B0D23" /></svg></a></Tooltip> */}


                                                                {/* <Tooltip title={'Preview'}><a target='_blank' href={obj?.file}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 18V12M12 12L9 14M12 12L15 14M13 3.00087C12.9045 3 12.7973 3 12.6747 3H8.2002C7.08009 3 6.51962 3 6.0918 3.21799C5.71547 3.40973 5.40973 3.71547 5.21799 4.0918C5 4.51962 5 5.08009 5 6.2002V17.8002C5 18.9203 5 19.4801 5.21799 19.9079C5.40973 20.2842 5.71547 20.5905 6.0918 20.7822C6.51921 21 7.079 21 8.19694 21L15.8031 21C16.921 21 17.48 21 17.9074 20.7822C18.2837 20.5905 18.5905 20.2842 18.7822 19.9079C19 19.4805 19 18.9215 19 17.8036V9.32568C19 9.20296 19 9.09561 18.9991 9M13 3.00087C13.2856 3.00347 13.4663 3.01385 13.6388 3.05526C13.8429 3.10425 14.0379 3.18526 14.2168 3.29492C14.4186 3.41857 14.5918 3.59182 14.9375 3.9375L18.063 7.06298C18.4089 7.40889 18.5809 7.58136 18.7046 7.78319C18.8142 7.96214 18.8953 8.15726 18.9443 8.36133C18.9857 8.53376 18.9963 8.71451 18.9991 9M13 3.00087V5.8C13 6.9201 13 7.47977 13.218 7.90759C13.4097 8.28392 13.7155 8.59048 14.0918 8.78223C14.5192 9 15.079 9 16.1969 9H18.9991M18.9991 9H19.0002" stroke="#232648" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" /></svg></a></Tooltip>

                                                                <Tooltip title={'Preview'}><a target='_blank' href={obj?.file}>  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.75 6.25V10.625M6.25 6.25V10.625M3.75 3.75V11.125C3.75 11.8251 3.75 12.1749 3.88624 12.4422C4.00608 12.6774 4.19717 12.8691 4.43237 12.9889C4.6995 13.125 5.04937 13.125 5.74807 13.125H9.25193C9.95063 13.125 10.3 13.125 10.5671 12.9889C10.8023 12.8691 10.994 12.6774 11.1139 12.4422C11.25 12.1751 11.25 11.8256 11.25 11.1269V3.75M3.75 3.75H5M3.75 3.75H2.5M5 3.75H10M5 3.75C5 3.16757 5 2.8765 5.09515 2.64679C5.22202 2.3405 5.4652 2.09702 5.77148 1.97015C6.0012 1.875 6.29257 1.875 6.875 1.875H8.125C8.70743 1.875 8.99864 1.875 9.22835 1.97015C9.53464 2.09702 9.77792 2.3405 9.90479 2.64679C9.99994 2.8765 10 3.16757 10 3.75M10 3.75H11.25M11.25 3.75H12.5" stroke="#0B0D23" stroke-linecap="round" stroke-linejoin="round" /></svg></a></Tooltip> */}

                                                            </Grid>
                                                        </Grid>
                                                    </Paper>
                                                </Grid>
                                            </Grid>

                                        ))
                                        :
                                        <Grid height={200} display={'flex'} justifyContent={'center'}>
                                            <a className='not-found' style={{ marginLeft: 10 }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2.20706L22 22.0011M6.562 2.51506C8.568 1.91306 14.316 1.79206 17.724 2.39706C18.549 2.54406 19.344 3.07606 19.778 3.78206C20.504 4.96506 20.465 6.34206 20.465 7.72406L20.345 16.1791M4 4.17206C3.368 6.43906 3.453 10.6001 3.494 16.7421C3.5 17.5321 3.537 18.3321 3.775 19.0871C4.144 20.2571 4.758 20.9671 6.107 21.5371C6.682 21.7811 7.313 21.8611 7.94 21.8611H11.983C15.779 21.7691 17.311 21.3731 18.989 19.1831M10.487 21.8611C12.868 20.6541 14.095 20.4861 13.783 17.4501C13.723 16.6641 14.173 15.7251 14.977 15.4731M20.405 12.0451C20.162 13.4811 19.999 14.0151 19.03 14.8461" stroke="#525252" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>No Document Found</a>

                                        </Grid>
                            }
                        </Grid>


                        <Grid className='document-details-block' m={1} mb={4}>
                            <Grid className='document-details-block-title' mb={2} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                <button disabled style={{ display: 'flex', alignItems: 'center', backgroundColor: '#A6E9A9', color: '#0B0D23', padding: '8px 15px', fontSize: '14px', borderRadius: 5 }}><svg style={{ marginRight: '10px' }} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.75 10.0834H7.33333M5.04167 12.3751V7.79175M13.2917 12.8334C16.694 12.8334 18.4644 14.0051 19.0377 16.3484C19.3002 17.4214 18.3546 18.3334 17.25 18.3334H9.33334C8.22877 18.3334 7.28316 17.4214 7.54565 16.3484C8.11894 14.0051 9.88932 12.8334 13.2917 12.8334ZM13.2917 9.16675C14.8194 9.16675 15.5833 8.38103 15.5833 6.41675C15.5833 4.45246 14.8194 3.66675 13.2917 3.66675C11.7639 3.66675 11 4.45246 11 6.41675C11 8.38103 11.7639 9.16675 13.2917 9.16675Z" stroke="#232648" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>University Document</button>

                                {
                                    details &&
                                    //    details?.stage?.name !== 'CONDITIONAL OFFER' &&
                                    <Button className='add-btn' sx={{ fontSize: '14px', height: '25px', mr: 2, display: 'flex', alignItems: 'center' }} size='small' variant='outlined' onClick={handleDocumentOpen}> <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.09961 7.73337H8.19961M8.19961 7.73337H12.2996M8.19961 7.73337V11.6M8.19961 7.73337V3.8667" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                        Add </Button>
                                }
                            </Grid>

                            <Grid height={500} className={`border h-6/8 doc-details-add-block ${docId >= 0 ? 'Active' : ''}`}>

                                <div className='flex justify-between items-center'>
                                    <a>Add University Document</a>
                                    <svg style={{ cursor: 'pointer' }} onClick={handleDocumentClose} width="34" height="30" viewBox="0 0 34 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="34" height="30" rx="3" fill="#4A4D6E" />
                                        <g clip-path="url(#clip0_10_1715)">
                                            <path d="M23.125 21.125L17.5 15.5M17.5 15.5L11.875 9.875M17.5 15.5L23.125 9.875M17.5 15.5L11.875 21.125" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_10_1715">
                                                <rect width="15" height="15" fill="white" transform="translate(10 8)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Grid container>
                                        <Grid pr={1} mt={2} md={12}>
                                            {/* <a>Select Template</a> */}
                                            <AsyncSelect
                                                placeholder={'Select Template'}
                                                key={watch('template')}
                                                name={'template'}
                                                defaultValue={watch('template')}
                                                isClearable
                                                defaultOptions
                                                loadOptions={fetchTemplates}
                                                getOptionLabel={(e) => e.name}
                                                getOptionValue={(e) => e.id}
                                                onChange={handleTemplateSelect}
                                            />
                                            {errors.template && <span className='form-validation'>{errors.template.message}</span>}

                                        </Grid>
                                    </Grid>

                                    <Grid container>
                                        <Grid pr={1} mt={2} md={12}>
                                            {/* <a>UNI ID</a> */}
                                            <TextInput placeholder={'UNI ID'} control={control} name="application_id"
                                                value={watch('application_id')} />
                                            {errors.application_id && <span className='form-validation'>{errors.application_id.message}</span>}

                                        </Grid>
                                    </Grid>

                                    <Grid container>
                                        <Grid pr={1} mt={2} md={12}>
                                            <FormControlLabel
                                                control={<Checkbox checked={changeStage} onChange={handleCheckboxChange} />}
                                                label="Change Stage"
                                            />

                                        </Grid>
                                    </Grid>

                                    {
                                        watch('template')?.stage?.action_type == "Deposit Paid" &&
                                        <Grid container>
                                            <Grid pr={1} mt={2} md={6}>
                                                {/* <a>Deposit Amount</a> */}
                                                <TextInput placeholder={'Deposit Amount'} type={'number'} control={control} name="amount"
                                                    value={watch('amount')} />
                                                {errors.amount && <span className='form-validation'>{errors.amount.message}</span>}
                                            </Grid>
                                            <Grid pr={1} mt={2} md={6}>
                                                {/* <a>Deposit Paid Date</a> */}
                                                <DateInput
                                                    placeholder={'Deposit Paid Date'}
                                                    control={control}
                                                    name="paid_date"
                                                    value={watch('paid_date')}
                                                />
                                                {errors.paid_date && <span className='form-validation'>{errors.paid_date.message}</span>}
                                            </Grid>
                                            <Grid pr={1} mt={2} md={6}>
                                                {/* <a>Deposit Amount</a> */}
                                                <TextInput placeholder={'Payment Mode'} control={control} name="payment_mode"
                                                    value={watch('payment_mode')} />
                                                {errors?.payment_mode && <span className='form-validation'>{errors?.payment_mode?.message}</span>}
                                            </Grid>
                                        </Grid>
                                    }
                                    
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                    >
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="file-upload"
                                            key={fileInputKey}
                                        />
                                        <label htmlFor="file-upload" style={{ cursor: 'pointer' }} className='add-document-block'>
                                            <Image src={Doc} alt='Doc' width={200} height={200} />

                                            <h3>Add<span>Document</span></h3>
                                            <h4>Max {watch('template')?.max_upload_size || size} MB files are allowed</h4>
                                        </label>

                                        {(selectedFile || details?.file) && (
                                            <Grid display={'flex'} justifyContent={'space-between'} className="mt-4">
                                                <Grid mr={1}>
                                                    {
                                                        selectedFile &&
                                                        <Tooltip title={selectedFile?.name}>
                                                            <p className="text-gray-700">
                                                                {
                                                                    selectedFile?.name?.length > 20
                                                                        ? selectedFile?.name?.slice(0, 20) + '....'
                                                                        : selectedFile?.name
                                                                }
                                                            </p>
                                                        </Tooltip>
                                                    }
                                                    {
                                                        !selectedFile &&
                                                        <Tooltip title={details?.file}>
                                                            <p className="text-gray-700">
                                                                {trimUrlAndNumbers(details?.file)}
                                                            </p>
                                                        </Tooltip>
                                                    }
                                                </Grid>
                                                {
                                                    selectedFile &&
                                                    <Grid>
                                                        <Delete sx={{ cursor: 'pointer' }} color='error' fontSize='small' onClick={handleDeleteFile} />
                                                    </Grid>
                                                }
                                            </Grid>
                                        )}
                                    </div>
                                    <Grid mt={2} display={'flex'} justifyContent={'end'}>

                                        <LoadingButton
                                            type='submit'
                                            variant='contained'
                                            // disabled={loading || reqLoading || dataLoading}
                                            loading={uploadLoading}
                                            size='small'
                                            sx={{ textTransform: 'none', height: 30 }}
                                            className="mt-2 bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Upload
                                        </LoadingButton>
                                    </Grid>
                                </form>

                            </Grid>

                            {

                                loading || dataLoading ?
                                    loadingDiv()
                                    :
                                    details?.university_documents?.length > 0 ?
                                        details?.university_documents?.map((obj, index) => (
                                            <Grid mb={1} key={index} container spacing={1} justifyContent="center">
                                                <Grid item xs={11.5}>
                                                    <Paper elevation={3} sx={{ p: 1, }}>
                                                        <Grid key={index} display={'flex'} justifyContent={'space-between'} alignItems={'center'} sx={{ mt: index !== 0 ? 1 : '' }}>
                                                            <a style={{ fontSize: '14px' }} key={index} >{trimUrlAndNumbers(obj?.title || obj?.document_template?.name)}</a>


                                                            <Grid display={'flex'} alignItems={'center'}>
                                                                <Tooltip title={'Preview'}><a target='_blank' href={obj?.document}><Visibility fontSize='small' sx={{ color: '#689df6', mr: 2 }} /></a></Tooltip>
                                                                {
                                                                    // details?.stage?.name !== 'CONDITIONAL OFFER' &&
                                                                    <>
                                                                        <Tooltip title={'Download'}><a onClick={() => handleDownload(obj?.document, obj?.document_template?.name)} ><Download fontSize='small' sx={{ color: '#689df6', mr: 2 }} /></a></Tooltip>
                                                                        <Tooltip title={'Delete'}>
                                                                            <svg style={{ cursor: 'pointer' }} onClick={() => handleDeleteOpen(obj?.id)} xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                                                                                <path d="M2.5 3.16667V11.6889C2.5 12.4979 2.5 12.9021 2.66349 13.211C2.8073 13.4828 3.0366 13.7042 3.31885 13.8427C3.6394 14 4.05925 14 4.89768 14H9.10232C9.94075 14 10.36 14 10.6805 13.8427C10.9628 13.7042 11.1929 13.4828 11.3367 13.211C11.5 12.9024 11.5 12.4985 11.5 11.6911V3.16667M2.5 3.16667H4M2.5 3.16667H1M4 3.16667H10M4 3.16667C4 2.49364 4 2.15729 4.11418 1.89185C4.26642 1.53792 4.55824 1.25655 4.92578 1.10995C5.20144 1 5.55109 1 6.25 1H7.75C8.44891 1 8.79837 1 9.07402 1.10995C9.44157 1.25655 9.7335 1.53792 9.88574 1.89185C9.99992 2.15729 10 2.49364 10 3.16667M10 3.16667H11.5M11.5 3.16667H13" stroke="#0B0D23" strokeLinecap="round" stroke-linejoin="round" />
                                                                            </svg>
                                                                        </Tooltip>
                                                                    </>
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                    </Paper>
                                                </Grid>
                                            </Grid>
                                        ))
                                        :
                                        <Grid height={200} display={'flex'} justifyContent={'center'}>
                                            <a className='not-found' style={{ marginLeft: 10 }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2.20706L22 22.0011M6.562 2.51506C8.568 1.91306 14.316 1.79206 17.724 2.39706C18.549 2.54406 19.344 3.07606 19.778 3.78206C20.504 4.96506 20.465 6.34206 20.465 7.72406L20.345 16.1791M4 4.17206C3.368 6.43906 3.453 10.6001 3.494 16.7421C3.5 17.5321 3.537 18.3321 3.775 19.0871C4.144 20.2571 4.758 20.9671 6.107 21.5371C6.682 21.7811 7.313 21.8611 7.94 21.8611H11.983C15.779 21.7691 17.311 21.3731 18.989 19.1831M10.487 21.8611C12.868 20.6541 14.095 20.4861 13.783 17.4501C13.723 16.6641 14.173 15.7251 14.977 15.4731M20.405 12.0451C20.162 13.4811 19.999 14.0151 19.03 14.8461" stroke="#525252" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>No Document Found</a>

                                        </Grid>}
                        </Grid>

                    </div>
                </Grid>
            </Drawer>
        </div >
    );
}


const loadingDiv = () => (
    <>
        {[...Array(5)].map((_, index) => (
            <Grid mb={1} key={index} container spacing={1} justifyContent="center">
                <Grid item xs={12}>
                    {/* <Paper elevation={3} sx={{ p: 1 }}>
                        <Grid
                            key={index}
                            container
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ mt: index !== 0 ? 1 : 0 }}
                        > */}
                    <Skeleton variant='rounded' width={'100%'} height={30} />

                    {/* </Grid>
                    </Paper> */}
                </Grid>
            </Grid>
        ))}
    </>
);