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
import { useSession } from 'next-auth/react';
import { red } from '@mui/material/colors';
import DocDeleteConfirmPopup from './DocDeleteConfirm';



export default function ViewDocumentModal({ editId, setEditId, refresh, setRefresh, handleUniDocOpen, fetchTable, appSubmit, handleLeadRefresh }) {

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

    const session = useSession()

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
        setdetails()
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
            setValue('application_id', response?.data?.data?.application_number)
            setLoading(false)
        })
    }

    const NoLoadDetails = () => {
        setDataLoading(true)
        ApplicationApi.view({ id: editId }).then((response) => {
            setdetails(response?.data?.data)
            setValue('application_id', response?.data?.data?.application_number)
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

    const [changeStage, setChangeStage] = useState(details?.stage?.action_type == "Alumni" ? false : true);

    useEffect(() => {
        setChangeStage(details?.stage?.action_type == "Alumni" ? false : true);
    }, [details?.stage])
    
    

    const handleCheckboxChange = (event) => {
        setChangeStage(event.target.checked);
    };

    const [uploadLoading, setUploadLoading] = useState(false);
    const onSubmit = (data) => {
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

            formData.append('application_number', data?.application_id)

            if (data?.template?.stage?.action_type == 'Deposit Paid') {
                let date = ''
                if (data?.paid_date) {
                    date = moment(data?.paid_date).format('YYYY-MM-DD')
                }
                formData.append('deposit_paid_on', date)
                formData.append('deposit_amount_paid', data?.amount)
                formData.append('deposit_mode_of_payment', data?.payment_mode)
            }

            // for (const [key, value] of formData.entries()) {
            //     console.log(`${key}: ${value}`);
            // }

            let action;

            if (editId > 0) {
                action = ApplicationApi.uploadUniversityDocument(formData)
            } else {
                action = ApplicationApi.uploadUniversityDocument(formData)
            }

            action.then((response) => {
                if (response?.status == 200 || response?.status == 201) {
                    handleDocumentClose()
                    toast.success(response?.data?.message)
                    setChangeStage(details?.stage?.action_type == "Alumni" ? false : true)
                    if (fetchTable) {
                        fetchTable()
                    }
                    if (handleLeadRefresh) {
                        handleLeadRefresh()
                    }
                    getDetails()
                    setUploadLoading(false)
                } else {
                    toast.error(response?.response?.data?.message)
                    setUploadLoading(false)
                }
                setUploadLoading(false)
            }).catch((error) => {
                console.log(error);
                toast.error(error?.response?.data?.message)
                setUploadLoading(false)
            })
        }

    }

    const callFunc = () => {
        NoLoadDetails()
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
            <DocDeleteConfirmPopup details={details} loading={deleteLoading} ID={deleteId} setID={setdeleteId} clickFunc={handleDelete} title={`Confirm prompt`} callback={callFunc} fetchTable={fetchTable} />
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
                                <button disabled style={{ display: 'flex', alignItems: 'center', backgroundColor: '#A6E9A9', color: '#0B0D23', padding: '8px 15px', fontSize: '14px', borderRadius: 5 }}><svg style={{ marginRight: '10px' }} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.75 10.0834H7.33333M5.04167 12.3751V7.79175M13.2917 12.8334C16.694 12.8334 18.4644 14.0051 19.0377 16.3484C19.3002 17.4214 18.3546 18.3334 17.25 18.3334H9.33334C8.22877 18.3334 7.28316 17.4214 7.54565 16.3484C8.11894 14.0051 9.88932 12.8334 13.2917 12.8334ZM13.2917 9.16675C14.8194 9.16675 15.5833 8.38103 15.5833 6.41675C15.5833 4.45246 14.8194 3.66675 13.2917 3.66675C11.7639 3.66675 11 4.45246 11 6.41675C11 8.38103 11.7639 9.16675 13.2917 9.16675Z" stroke="#232648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> Student Document</button>
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
                                                            </Grid>
                                                        </Grid>
                                                    </Paper>
                                                </Grid>
                                            </Grid>

                                        ))
                                        :
                                        <Grid height={200} display={'flex'} justifyContent={'center'}>
                                            <a className='not-found' style={{ marginLeft: 10 }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2.20706L22 22.0011M6.562 2.51506C8.568 1.91306 14.316 1.79206 17.724 2.39706C18.549 2.54406 19.344 3.07606 19.778 3.78206C20.504 4.96506 20.465 6.34206 20.465 7.72406L20.345 16.1791M4 4.17206C3.368 6.43906 3.453 10.6001 3.494 16.7421C3.5 17.5321 3.537 18.3321 3.775 19.0871C4.144 20.2571 4.758 20.9671 6.107 21.5371C6.682 21.7811 7.313 21.8611 7.94 21.8611H11.983C15.779 21.7691 17.311 21.3731 18.989 19.1831M10.487 21.8611C12.868 20.6541 14.095 20.4861 13.783 17.4501C13.723 16.6641 14.173 15.7251 14.977 15.4731M20.405 12.0451C20.162 13.4811 19.999 14.0151 19.03 14.8461" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>No Document Found</a>

                                        </Grid>
                            }
                        </Grid>


                        <Grid className='document-details-block' m={1} mb={4}>
                            <Grid className='document-details-block-title' mb={2} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                <button disabled style={{ display: 'flex', alignItems: 'center', backgroundColor: '#A6E9A9', color: '#0B0D23', padding: '8px 15px', fontSize: '14px', borderRadius: 5 }}><svg style={{ marginRight: '10px' }} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.75 10.0834H7.33333M5.04167 12.3751V7.79175M13.2917 12.8334C16.694 12.8334 18.4644 14.0051 19.0377 16.3484C19.3002 17.4214 18.3546 18.3334 17.25 18.3334H9.33334C8.22877 18.3334 7.28316 17.4214 7.54565 16.3484C8.11894 14.0051 9.88932 12.8334 13.2917 12.8334ZM13.2917 9.16675C14.8194 9.16675 15.5833 8.38103 15.5833 6.41675C15.5833 4.45246 14.8194 3.66675 13.2917 3.66675C11.7639 3.66675 11 4.45246 11 6.41675C11 8.38103 11.7639 9.16675 13.2917 9.16675Z" stroke="#232648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>University Document</button>

                                {
                                    (details?.app_coordinator && details?.submitted_to_university == 1) &&
                                    <Button className='add-btn' sx={{ fontSize: '14px', height: '25px', mr: 2, display: 'flex', alignItems: 'center' }} size='small' variant='outlined' onClick={handleDocumentOpen}>
                                        Add </Button>
                                }
                            </Grid>

                            <Grid height={500} style={{ overflowY: 'auto' }} className={`border h-6/8 doc-details-add-block ${docId >= 0 ? 'Active' : ''}`}>

                                <div className='flex justify-between items-center'>
                                    <a>Add University Document</a>
                                    <svg style={{ cursor: 'pointer' }} onClick={handleDocumentClose} width="34" height="30" viewBox="0 0 34 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="34" height="30" rx="3" fill="#4A4D6E" />
                                        <g clip-path="url(#clip0_10_1715)">
                                            <path d="M23.125 21.125L17.5 15.5M17.5 15.5L11.875 9.875M17.5 15.5L23.125 9.875M17.5 15.5L11.875 21.125" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                                                control={<Checkbox disabled={details?.stage?.action_type == "Alumni"} checked={changeStage} onChange={handleCheckboxChange} />}
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
                                                                        {
                                                                            // session?.data?.user?.role?.id != 5 &&
                                                                            <Tooltip title={'Delete'}>
                                                                                <svg style={{ cursor: 'pointer' }} onClick={() => handleDeleteOpen(obj?.id)} xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                                                                                    <path d="M2.5 3.16667V11.6889C2.5 12.4979 2.5 12.9021 2.66349 13.211C2.8073 13.4828 3.0366 13.7042 3.31885 13.8427C3.6394 14 4.05925 14 4.89768 14H9.10232C9.94075 14 10.36 14 10.6805 13.8427C10.9628 13.7042 11.1929 13.4828 11.3367 13.211C11.5 12.9024 11.5 12.4985 11.5 11.6911V3.16667M2.5 3.16667H4M2.5 3.16667H1M4 3.16667H10M4 3.16667C4 2.49364 4 2.15729 4.11418 1.89185C4.26642 1.53792 4.55824 1.25655 4.92578 1.10995C5.20144 1 5.55109 1 6.25 1H7.75C8.44891 1 8.79837 1 9.07402 1.10995C9.44157 1.25655 9.7335 1.53792 9.88574 1.89185C9.99992 2.15729 10 2.49364 10 3.16667M10 3.16667H11.5M11.5 3.16667H13" stroke="#0B0D23" strokeLinecap="round" strokeLinejoin="round" />
                                                                                </svg>
                                                                            </Tooltip>
                                                                        }
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
                                            {
                                                details?.submitted_to_university == 1 ?

                                                    <a className='not-found' style={{ marginLeft: 10 }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2.20706L22 22.0011M6.562 2.51506C8.568 1.91306 14.316 1.79206 17.724 2.39706C18.549 2.54406 19.344 3.07606 19.778 3.78206C20.504 4.96506 20.465 6.34206 20.465 7.72406L20.345 16.1791M4 4.17206C3.368 6.43906 3.453 10.6001 3.494 16.7421C3.5 17.5321 3.537 18.3321 3.775 19.0871C4.144 20.2571 4.758 20.9671 6.107 21.5371C6.682 21.7811 7.313 21.8611 7.94 21.8611H11.983C15.779 21.7691 17.311 21.3731 18.989 19.1831M10.487 21.8611C12.868 20.6541 14.095 20.4861 13.783 17.4501C13.723 16.6641 14.173 15.7251 14.977 15.4731M20.405 12.0451C20.162 13.4811 19.999 14.0151 19.03 14.8461" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>No Document Found</a>
                                                    :
                                                    <a className='not-found' style={{ marginLeft: 10, fontWeight: '500', fontSize: '16px', color: '#d9534f' }}>
                                                        You have to submit an application to the university to add university documents.
                                                    </a>

                                            }

                                        </Grid>}
                        </Grid>
                        {/* } */}

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