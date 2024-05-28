import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, IconButton, Paper, Skeleton, TextField, Tooltip, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Close, Download, Refresh, Visibility } from '@mui/icons-material';
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


const scheme = yup.object().shape({
    amount: yup.string().required("Deposit Amount is Required"),
    date: yup.string().required("Deposit Paid Date is Required"),
    // phone: yup.string().required("Phone Number is Required"),
    // dob: yup.string().required("Date Of Birth is Required"),
    // zip: yup.string().required("Zip Code is Required"),
    // country: yup.object().required("Please Choose a Country").typeError("Please choose a Country"),
    // state: yup.string().required("State is Required"),
})

export default function ViewDocumentModal({ editId, setEditId, refresh, setRefresh, handleUniDocOpen ,fetchTable}) {

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
            setdocId(0)
            setapplicationId(details?.id)
        }
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

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })

    const [details, setdetails] = useState()

    const [downloadId, setDownloadId] = useState()

    const handleDownlaodOpen = () => {
        if (details?.id) {
            setDownloadId(details?.id)
        }
    }


    const handleClose = () => {
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


    return (
        <div>
            <UniversityDocumentModal app_id={applicationId} setapp_id={setapplicationId} editId={docId} setEditId={setdocId} handleRefresh={NoLoadDetails} fetchTable={fetchTable} />
            <ConfirmPopup loading={deleteLoading} ID={deleteId} setID={setdeleteId} clickFunc={handleDelete} title={`Do you want to Delete this Document?`} />
            <DownloadDocumentModal editId={downloadId} setEditId={setDownloadId} />

            <Drawer
                anchor={anchor}
                open={open}
                onClose={handleClose}
            >
                <Grid width={550}>
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

                        <Grid m={1} mb={4}>
                            <Grid mb={2} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                <button disabled style={{ backgroundColor: '#689df6', color: 'white', height: '25px', width: '180px', fontSize: '14px', borderRadius: 5 }}> Student Document</button>
                                <Tooltip title={'Download'}><Download onClick={handleDownlaodOpen} fontSize='small' sx={{ mr: 2, color: '#689df6', cursor: 'pointer' }} /></Tooltip>
                            </Grid>
                            {
                                loading ?
                                    loadingDiv()
                                    :
                                    details?.documents?.length > 0 ?
                                        details?.documents?.map((obj, index) => (

                                            <Grid mb={1} key={index} container spacing={1} justifyContent="center">
                                                <Grid item p={1} xs={11.5}>
                                                    <Paper elevation={3} sx={{ p: 1 }}>
                                                        <Grid key={index} display={'flex'} justifyContent={'space-between'} alignItems={'center'} sx={{ mt: index !== 0 ? 1 : '' }}>
                                                            <a style={{ fontSize: '14px' }} target='_blank' href={obj?.document} key={index} >{trimUrlAndNumbers(obj?.title || obj?.document_template?.name)}</a>
                                                            <Grid display={'flex'} alignItems={'center'}>
                                                                <Tooltip title={'Preview'}><a target='_blank' href={obj?.document}><Visibility fontSize='small' sx={{ color: '#689df6' }} /></a></Tooltip>

                                                            </Grid>
                                                        </Grid>
                                                    </Paper>
                                                </Grid>
                                            </Grid>

                                        ))
                                        :
                                        <a style={{ marginLeft: 10 }}>No Document Found</a>
                            }
                        </Grid>


                        <Grid m={1}>
                            <Grid mb={2} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                <button disabled style={{ backgroundColor: '#689df6', color: 'white', height: '25px', width: '180px', fontSize: '14px', borderRadius: 5 }}>University Document</button>

                                <Button sx={{ fontSize: '14px', height: '25px', mr: 2, display: 'flex', alignItems: 'center' }} size='small' variant='outlined' onClick={handleDocumentOpen}> <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                                    <path d="M6.33268 9.50008H9.49935M9.49935 9.50008H12.666M9.49935 9.50008V12.6667M9.49935 9.50008V6.33341M3.16602 13.3002V5.70024C3.16602 4.81349 3.16602 4.36978 3.33859 4.03109C3.49039 3.73316 3.73243 3.49112 4.03035 3.33932C4.36905 3.16675 4.81275 3.16675 5.6995 3.16675H13.2995C14.1863 3.16675 14.6294 3.16675 14.9681 3.33932C15.266 3.49112 15.5085 3.73316 15.6603 4.03109C15.8329 4.36978 15.8329 4.81316 15.8329 5.69991V13.2999C15.8329 14.1867 15.8329 14.6301 15.6603 14.9687C15.5085 15.2667 15.266 15.5092 14.9681 15.661C14.6297 15.8334 14.1872 15.8334 13.3022 15.8334H5.6969C4.81189 15.8334 4.36872 15.8334 4.03035 15.661C3.73243 15.5092 3.49039 15.2667 3.33859 14.9688C3.16602 14.6301 3.16602 14.187 3.16602 13.3002Z" stroke="#0B0D23" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>Add </Button>
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
                                                                <Tooltip title={'Download'}><a onClick={() => handleDownload(obj?.document, obj?.document_template?.name)} ><Download fontSize='small' sx={{ color: '#689df6', mr: 2 }} /></a></Tooltip>
                                                                <Tooltip title={'Delete'}>
                                                                    <svg style={{ cursor: 'pointer' }} onClick={() => handleDeleteOpen(obj?.id)} xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                                                                        <path d="M2.5 3.16667V11.6889C2.5 12.4979 2.5 12.9021 2.66349 13.211C2.8073 13.4828 3.0366 13.7042 3.31885 13.8427C3.6394 14 4.05925 14 4.89768 14H9.10232C9.94075 14 10.36 14 10.6805 13.8427C10.9628 13.7042 11.1929 13.4828 11.3367 13.211C11.5 12.9024 11.5 12.4985 11.5 11.6911V3.16667M2.5 3.16667H4M2.5 3.16667H1M4 3.16667H10M4 3.16667C4 2.49364 4 2.15729 4.11418 1.89185C4.26642 1.53792 4.55824 1.25655 4.92578 1.10995C5.20144 1 5.55109 1 6.25 1H7.75C8.44891 1 8.79837 1 9.07402 1.10995C9.44157 1.25655 9.7335 1.53792 9.88574 1.89185C9.99992 2.15729 10 2.49364 10 3.16667M10 3.16667H11.5M11.5 3.16667H13" stroke="#0B0D23" stroke-linecap="round" stroke-linejoin="round" />
                                                                    </svg>
                                                                </Tooltip>
                                                            </Grid>
                                                        </Grid>
                                                    </Paper>
                                                </Grid>
                                            </Grid>
                                        ))
                                        :
                                        <a style={{ marginLeft: 10 }}>No Document Found</a>
                            }
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
