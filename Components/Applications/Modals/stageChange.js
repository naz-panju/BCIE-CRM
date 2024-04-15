import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Close, Delete, Refresh } from '@mui/icons-material';
import { ListingApi } from '@/data/Endpoints/Listing';
import SelectX from '@/Form/SelectX';
import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab';
import LoadingEdit from '@/Components/Common/Loading/LoadingEdit';
import toast from 'react-hot-toast';
import { LeadApi } from '@/data/Endpoints/Lead';
import ReactSelector from 'react-select';
import { id } from 'date-fns/locale';
import { ApplicationStagesApi } from '@/data/Endpoints/ApplicationStages';
import TextInput from '@/Form/TextInput';
import { ApplicationApi } from '@/data/Endpoints/Application';
import { useRef } from 'react';


const scheme = yup.object().shape({
    // first_name: yup.string().required("First Name is Required"),
    // email: yup.string().required("Email is Required"),
    // phone: yup.string().required("Phone Number is Required"),
    // dob: yup.string().required("Date Of Birth is Required"),
    // zip: yup.string().required("Zip Code is Required"),
    // country: yup.object().required("Please Choose a Country").typeError("Please choose a Country"),
    // state: yup.string().required("State is Required"),
})

export default function ApplicationStageChangeModal({ details, editId, setEditId, refresh, setRefresh, setDetails }) {

    const [state, setState] = React.useState({
        right: false,
    });
    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const [dataLoading, setDataLoading] = useState(false)

    const [acceptFile, setAcceptFile] = useState()
    const [casFile, setCasFile] = useState()
    const [feeFile, setFeeFile] = useState()
    const [fileInputKey, setFileInputKey] = useState(0);

    const anchor = 'right'; // Set anchor to 'right'

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })


    const Stages = [
        // { label: 'Created' },
        { label: 'Applied in University' },
        { label: 'University Rejected' },
        { label: 'University Accepted' },
        { label: 'CAS Approved' },
        { label: 'CAS Rejected' },
        { label: 'Visa Applied' },
        { label: 'Visa Approved' },
        { label: 'Visa Rejected' },
        { label: 'University Fee Paid' },
        { label: 'Admission Completed' }
    ]

    const handleAcceptClick = () => {
        // This will trigger a click event on the input element, opening the file dialog
        document.getElementById('acceptance-button').click();
    };

    const handleFileUpload = (event) => {
        setFileInputKey(prevKey => prevKey + 1);
        const file = event.target.files[0];
        if (file) {
            setAcceptFile(file);
        }
    };

    const handleCasClick = () => {
        document.getElementById('cas-button').click();
    };

    const handleCasFileUpload = (event) => {
        setFileInputKey(prevKey => prevKey + 1);
        const file = event.target.files[0];
        if (file) {
            setCasFile(file);
        }
    };

    const handleFeeClick = () => {
        document.getElementById('fee-button').click();
    };

    const handleFeeFileUpload = (event) => {
        setFileInputKey(prevKey => prevKey + 1);
        const file = event.target.files[0];
        if (file) {
            setFeeFile(file);
        }
    };


    const afterResponse = (message) => {
        toast.success(message)
        reset()
        handleClose()
        setRefresh(!refresh)
        setLoading(false)
    }

    const errorResponse = (message) => {
        toast.error(message)
        setLoading(false)
    }


    const onSubmit = async (data) => {

        setLoading(true)

        if (data?.stage == 'University Rejected') {
            universityRejected(data)
        } else if (data?.stage == 'University Accepted') {
            universityAccepted(data)
        } else if (data?.stage == 'Applied in University') {
            appliedInUniversity(data)
        } else if (data?.stage == 'CAS Approved') {
            casApproved(data)
        } else if (data?.stage == 'CAS Rejected') {
            casRejected(data)
        } else if (data?.stage == 'Visa Applied') {
            visaApplied(data)
        } else if (data?.stage == 'Visa Approved') {
            visaApproved(data)
        } else if (data?.stage == 'Visa Rejected') {
            visaRjected(data)
        } else if (data?.stage == 'University Fee Paid') {
            universityFeePaid(data)
        } else if (data?.stage == 'Admission Completed') {
            admissionCompleted(data)
        }


    }

    const appliedInUniversity = (data) => {

        if (data?.app_number) {
            let dataToSubmit = {
                id: details?.id,
                application_number: data?.app_number
            }

            ApplicationStagesApi.appliedInUniversity(dataToSubmit).then((response) => {
                console.log(response);
                if (response?.status == 200 || response?.status == 201) {
                    afterResponse(response?.data?.message)
                } else {
                    errorResponse(response?.response?.data?.message)
                }
                setLoading(false)
            }).catch((error) => {
                // console.log(error);
                errorResponse(error?.response?.data?.message)
            })
        } else {
            toast.error('Application number field is required')
            setLoading(false)
        }

    }
    const universityRejected = (data) => {

        let dataToSubmit = {
            id: details?.id,
        }

        ApplicationStagesApi.universityRejected(dataToSubmit).then((response) => {
            // console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                afterResponse(response?.data?.message)
            } else {
                errorResponse(response?.response?.data?.message)
            }
            setLoading(false)
        }).catch((error) => {
            // console.log(error);
            errorResponse(error?.response?.data?.message)
        })
    }
    const universityAccepted = (data) => {

        if (acceptFile) {
            const formData = new FormData();

            formData.append('id', details?.id)
            if (acceptFile) {
                formData.append('acceptance_letter', acceptFile)
            }
            ApplicationStagesApi.universityAccepted(formData).then((response) => {
                // console.log(response);
                if (response?.status == 200 || response?.status == 201) {
                    afterResponse(response?.data?.message)
                } else {
                    errorResponse(response?.response?.data?.message)
                }
                setLoading(false)
            }).catch((error) => {
                // console.log(error);
                errorResponse(error?.response?.data?.message)
            })
        } else {
            toast.error('Please Upload a File')
            setLoading(false)
        }

    }
    const casRejected = (data) => {

        let dataToSubmit = {
            id: details?.id,
        }

        ApplicationStagesApi.casRejected(dataToSubmit).then((response) => {
            console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                afterResponse(response?.data?.message)
            } else {
                errorResponse(response?.response?.data?.message)
            }
            setLoading(false)
        }).catch((error) => {
            // console.log(error);
            errorResponse(error?.response?.data?.message)
        })


    }
    const visaApplied = (data) => {

        let dataToSubmit = {
            id: details?.id,
        }

        ApplicationStagesApi.visaApplied(dataToSubmit).then((response) => {
            console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                afterResponse(response?.data?.message)
            } else {
                errorResponse(response?.response?.data?.message)
            }
            setLoading(false)
        }).catch((error) => {
            // console.log(error);
            errorResponse(error?.response?.data?.message)
        })


    }
    const visaApproved = (data) => {

        let dataToSubmit = {
            id: details?.id,
        }

        ApplicationStagesApi.visaApproved(dataToSubmit).then((response) => {
            console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                afterResponse(response?.data?.message)
            } else {
                errorResponse(response?.response?.data?.message)
            }
            setLoading(false)
        }).catch((error) => {
            // console.log(error);
            errorResponse(error?.response?.data?.message)
        })


    }
    const visaRjected = (data) => {


        let dataToSubmit = {
            id: details?.id,
        }

        ApplicationStagesApi.visaRejected(dataToSubmit).then((response) => {
            console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                afterResponse(response?.data?.message)
            } else {
                errorResponse(response?.response?.data?.message)
            }
            setLoading(false)
        }).catch((error) => {
            // console.log(error);
            errorResponse(error?.response?.data?.message)
        })


    }
    const casApproved = (data) => {

        if (casFile) {
            const formData = new FormData();

            formData.append('id', details?.id)
            if (acceptFile) {
                formData.append('cas_document', casFile)
            }
            ApplicationStagesApi.casApproved(formData).then((response) => {
                // console.log(response);
                if (response?.status == 200 || response?.status == 201) {
                    afterResponse(response?.data?.message)
                } else {
                    errorResponse(response?.response?.data?.message)
                }
                setLoading(false)
            }).catch((error) => {
                // console.log(error);
                errorResponse(error?.response?.data?.message)
            })
        } else {
            toast.error('Please Upload a File')
            setLoading(false)
        }

    }
    const universityFeePaid = (data) => {

       
            const formData = new FormData();

            formData.append('id', details?.id)
            if (acceptFile) {
                formData.append('feeFile', acceptFile)
            }
            ApplicationStagesApi.universityFeePaid(formData).then((response) => {
                // console.log(response);
                if (response?.status == 200 || response?.status == 201) {
                    afterResponse(response?.data?.message)
                } else {
                    errorResponse(response?.response?.data?.message)
                }
                setLoading(false)
            }).catch((error) => {
                // console.log(error);
                errorResponse(error?.response?.data?.message)
            })
       

    }

    // console.log(details?.id);

    const admissionCompleted = (data) => {

        let dataToSubmit = {
            id: details?.id,
        }

        ApplicationStagesApi.admissionCompleted(dataToSubmit).then((response) => {
            console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                afterResponse(response?.data?.message)
            } else {
                errorResponse(response?.response?.data?.message)
            }
            setLoading(false)
        }).catch((error) => {
            // console.log(error);
            errorResponse(error?.response?.data?.message)
        })
    }



    const handleClose = () => {
        setEditId()
        reset()
        setValue('stage', '')
        setDetails()
        setAcceptFile()
        setCasFile()
        setFeeFile()
        setOpen(false)
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


    const initialValues = () => {
        setValue('stage', details?.status)
    }



    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
            initialValues()
            // ApplicationApi.view({ id: details?.id }).then((response) => {
            //     console.log(response);
            // })
        } else if (editId == 0) {
            setOpen(true)
            initialValues()

        }
    }, [editId])


    return (
        <div>
            <Drawer
                anchor={anchor}
                open={open}
                onClose={handleDrawerClose}
            >
                <Grid width={550}>
                    <Grid p={1} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <a style={{ fontWeight: 500, fontSize: '19px' }}>Change Application Stage</a>
                        <IconButton
                            onClick={handleClose}
                        >
                            <Close />
                        </IconButton>
                    </Grid>
                    <hr />
                    <div>

                        <form onSubmit={handleSubmit(onSubmit)}>

                            {
                                dataLoading ?
                                    <LoadingEdit item={items} />
                                    :
                                    <>

                                        <Grid p={1} container display={'flex'} alignItems={'center'}>
                                            <Grid item pr={1} xs={4} md={4}>
                                                <a className='form-text'>Application Stage </a>
                                            </Grid>
                                            <Grid item pr={1} xs={8} md={8}>
                                                <ReactSelector
                                                    // placeholder={'Status'}
                                                    onInputChange={Stages}
                                                    styles={{ menu: provided => ({ ...provided, zIndex: 9999 }) }}
                                                    options={Stages}
                                                    getOptionLabel={option => option.label}
                                                    getOptionValue={option => option.label}
                                                    value={
                                                        Stages.filter(options =>
                                                            options?.label == watch('stage')
                                                        )
                                                    }
                                                    name='stage'
                                                    isClearable
                                                    defaultValue={(watch('stage'))}
                                                    onChange={(selectedOption) => setValue('stage', selectedOption?.label) || ''}
                                                />
                                                {errors.stage && <span className='form-validation'>{errors.stage.message}</span>}
                                            </Grid>
                                        </Grid>

                                        {
                                            watch('stage') == 'Applied in University' &&

                                            <Grid p={1} container display={'flex'} alignItems={'center'}>
                                                <Grid item pr={1} xs={4} md={4}>
                                                    <a className='form-text'>Application Number</a>
                                                </Grid>
                                                <Grid item pr={1} xs={8} md={8}>
                                                    <TextInput control={control} {...register('app_number')}
                                                        value={watch('app_number')} />
                                                </Grid>
                                            </Grid>
                                        }

                                        {
                                            watch('stage') == 'University Accepted' &&
                                            <Grid p={1} container display={'flex'} alignItems={'center'}>
                                                <Grid item pr={1} xs={4} md={4}>
                                                    <a className='form-text'>Acceptance Letter</a>
                                                </Grid>
                                                <Grid item pr={1} xs={8} md={8} display={'flex'}>
                                                    <Grid item md={2.5}>
                                                        <Button
                                                            onClick={handleAcceptClick}
                                                            sx={{ textTransform: 'none', height: 30 }}
                                                            variant='contained'
                                                            className='bg-sky-800'
                                                        >
                                                            Upload
                                                        </Button>
                                                        <input
                                                            type="file"
                                                            id="acceptance-button"
                                                            style={{ display: 'none' }}
                                                            onChange={handleFileUpload}
                                                            key={fileInputKey}
                                                        />
                                                    </Grid>
                                                    {
                                                        acceptFile &&
                                                        <Grid item md={9.5} ml={2} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                                                            {
                                                                acceptFile?.name?.length > 25 ?
                                                                    <Tooltip title={acceptFile?.name}>
                                                                        {acceptFile?.name?.slice(0, 25)} ...
                                                                    </Tooltip>
                                                                    :
                                                                    acceptFile?.name
                                                            }
                                                            <Delete onClick={() => setAcceptFile()} fontSize='small' sx={{ color: 'red', cursor: 'pointer' }} />
                                                        </Grid>
                                                    }
                                                </Grid>
                                            </Grid>
                                        }

                                        {
                                            watch('stage') == 'CAS Approved' &&
                                            <Grid p={1} container display={'flex'} alignItems={'center'}>
                                                <Grid item pr={1} xs={4} md={4}>
                                                    <a className='form-text'>CAS Document</a>
                                                </Grid>
                                                <Grid item pr={1} xs={8} md={8} display={'flex'}>
                                                    <Grid item md={2.5}>
                                                        <Button
                                                            onClick={handleCasClick}
                                                            sx={{ textTransform: 'none', height: 30 }}
                                                            variant='contained'
                                                            className='bg-sky-800'
                                                        >
                                                            Upload
                                                        </Button>
                                                        <input
                                                            type="file"
                                                            id="cas-button"
                                                            style={{ display: 'none' }}
                                                            onChange={handleCasFileUpload}
                                                            key={fileInputKey}
                                                        />
                                                    </Grid>
                                                    {
                                                        casFile &&
                                                        <Grid item md={9.5} ml={2} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                                                            {
                                                                casFile?.name?.length > 25 ?
                                                                    <Tooltip title={casFile?.name}>
                                                                        {casFile?.name?.slice(0, 25)} ...
                                                                    </Tooltip>
                                                                    :
                                                                    casFile?.name
                                                            }
                                                            <Delete onClick={() => setCasFile()} fontSize='small' sx={{ color: 'red', cursor: 'pointer' }} />
                                                        </Grid>
                                                    }
                                                </Grid>
                                            </Grid>
                                        }

                                        {
                                            watch('stage') == 'University Fee Paid' &&
                                            <Grid p={1} container display={'flex'} alignItems={'center'}>
                                                <Grid item pr={1} xs={4} md={4}>
                                                    <a className='form-text'>Fee Reciept</a>
                                                </Grid>
                                                <Grid item pr={1} xs={8} md={8} display={'flex'}>
                                                    <Grid item md={2.5}>
                                                        <Button
                                                            onClick={handleFeeClick}
                                                            sx={{ textTransform: 'none', height: 30 }}
                                                            variant='contained'
                                                            className='bg-sky-800'
                                                        >
                                                            Upload
                                                        </Button>
                                                        <input
                                                            type="file"
                                                            id="fee-button"
                                                            style={{ display: 'none' }}
                                                            onChange={handleFeeFileUpload}
                                                            key={fileInputKey}
                                                        />
                                                    </Grid>
                                                    {
                                                        feeFile &&
                                                        <Grid item md={9.5} ml={2} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                                                            {
                                                                feeFile?.name?.length > 25 ?
                                                                    <Tooltip title={feeFile?.name}>
                                                                        {feeFile?.name?.slice(0, 25)} ...
                                                                    </Tooltip>
                                                                    :
                                                                    feeFile?.name
                                                            }
                                                            <Delete onClick={() => setFeeFile()} fontSize='small' sx={{ color: 'red', cursor: 'pointer' }} />
                                                        </Grid>
                                                    }
                                                </Grid>
                                            </Grid>
                                        }

                                        {/* <Grid p={1} container >
                                            <Grid item pr={1} xs={4} md={4}>
                                                <a className='form-text'>Lead Sub Stage </a>
                                            </Grid>
                                            <Grid item pr={1} xs={8} md={8}>
                                                <SelectX
                                                    menuPlacement='top'
                                                    loadOptions={fetchSubStages}
                                                    control={control}
                                                    name={'substage'}
                                                    defaultValue={watch('substage')}
                                                />
                                                {errors.substage && <span className='form-validation'>{errors.substage.message}</span>}
                                            </Grid>
                                        </Grid> */}
                                    </>
                            }

                            <Grid p={1} pb={3} display={'flex'} justifyContent={'end'}>
                                <Button onClick={handleClose} size='small' sx={{ textTransform: 'none', mr: 2 }} variant='outlined'>Cancel</Button>
                                <LoadingButton loading={loading} disabled={loading || dataLoading} size='small' type='submit' sx={{ textTransform: 'none', height: 30 }} variant='contained'>Save</LoadingButton>
                            </Grid>

                        </form>
                    </div>
                </Grid>
            </Drawer>
        </div >
    );
}
