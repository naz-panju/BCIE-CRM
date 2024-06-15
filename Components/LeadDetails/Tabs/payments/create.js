import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, IconButton, Skeleton, TextField, Tooltip, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Close, Delete, Refresh } from '@mui/icons-material';
import { ListingApi } from '@/data/Endpoints/Listing';
import { useState } from 'react';

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab';
import LoadingEdit from '@/Components/Common/Loading/LoadingEdit';
import AsyncSelect from "react-select/async";
import { ApplicationApi } from '@/data/Endpoints/Application';
import toast from 'react-hot-toast';
import TextInput from '@/Form/TextInput';
import DateInput from '@/Form/DateInput';
import { PaymentApi } from '@/data/Endpoints/Payments';
import moment from 'moment';
import Image from 'next/image';
import Doc from '@/img/doc.png';


// amount: yup
// .string()
// .required('Amount is Required')
// .matches(/^[\d\s,.₹€£¥₿$]*$/, 'Amount must be a valid number or currency symbol'),
const scheme = yup.object().shape({
    amount: yup.string().required("Amount is Required"),
    payment_mode: yup.string().required("Payment Mode is Required"),

})

export default function LeadPaymentModal({ lead_id, editId, setEditId, handleRefresh, from, app_id }) {
    const [state, setState] = React.useState({
        right: false,
    });
    const [selectedPriority, setSelectedPriority] = useState('Medium');
    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)


    const items = [
        { label: 'Amount' },
        { label: 'Date' },
        { label: 'Mode of Payment' },
        { label: 'Details', multi: true },

    ]

    const anchor = 'right'; // Set anchor to 'right'

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })

    const [dataLoading, setDataLoading] = useState(false)
    const [attachment, setAttachment] = useState(null);
    const [fileInputKey, setFileInputKey] = useState(0);
    const [details, setdetails] = useState()

    const handleFileUpload = (event) => {
        setFileInputKey(prevKey => prevKey + 1);
        const file = event.target.files[0];
        if (file) {
            setAttachment(file);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setAttachment(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDelete = () => {
        setAttachment(null); // Clear selected file
    };


    const onSubmit = async (data) => {

        let date;

        if (data?.date) {
            date = moment(data?.date).format('YYYY-MM-DD')
        }

        setLoading(true)


        const formData = new FormData()
        formData.append('lead_id', lead_id)
        if (from == 'app') {
            formData.append('application_id', app_id)
        }
        formData.append('amount', data?.amount)
        formData.append('payment_mode', data?.payment_mode)
        formData.append('payment_date', date)
        formData.append('details', data?.details)

        if (attachment) {
            formData.append('receipt', attachment)
        }

        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });

        // Log the form data
        console.log('Form Data:', formDataObject);

        // let dataToSubmit = {
        //     lead_id: lead_id,
        //     amount: data?.amount,
        //     payment_mode: data?.payment_mode,
        //     payment_date: date,
        //     details: data?.details,

        // }

        // console.log(formData);

        let action;

        if (editId > 0) {
            formData.append('id', editId)
            action = PaymentApi.update(formData)
        } else {
            action = PaymentApi.add(formData)
        }

        action.then((response) => {
            // console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                toast.success(editId > 0 ? 'Payment has been Updated Successfully' : 'Payment has been Added Successfully')
                reset()
                handleClose()
                handleRefresh()
                setLoading(false)
            } else {
                toast.error(response?.response?.data?.message)
                setLoading(false)
            }

            setLoading(false)
        }).catch((error) => {
            console.log(error);
            toast.error(error?.message)
            setLoading(false)
        })
    }


    const handleClose = () => {
        setEditId()
        reset()
        setOpen(false)
        setLoading(false)
        setAttachment()
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

    function trimUrlAndNumbers(url) {
        const lastSlashIndex = url?.lastIndexOf('/');
        let trimmedString = url?.substring(lastSlashIndex + 1);
        trimmedString = trimmedString?.replace(/[0-9]/g, ''); // Replace all numeric characters with an empty string
        return trimmedString?.replace(/_/g, ''); // Replace all underscores with an empty string
    }


    const getDetails = async () => {
        setDataLoading(true)
        const response = await PaymentApi.view({ id: editId })
        if (response?.data?.data) {
            let data = response?.data?.data

            setdetails(data)
            setValue('amount', data?.amount)
            setValue('date', data?.payment_date)
            setValue('payment_mode', data?.payment_mode)
            setValue('details', data?.details)


        }
        setDataLoading(false)
    }

    const handleClick = () => {
        // This will trigger a click event on the input element, opening the file dialog
        document.getElementById('upload-button').click();
    };

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

            <Drawer
                anchor={anchor}
                open={open}
                onClose={handleClose}
            >
                <Grid width={550}>

                    <Grid className='modal_title d-flex align-items-center'>

                        <a className='back_modal' onClick={handleClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                                <path d="M21.9582 15.5H9.0415M9.0415 15.5L14.2082 20.6666M9.0415 15.5L14.2082 10.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                            </svg>
                        </a>

                        <a className='back_modal_head'> {editId > 0 ? 'Edit Payment' : 'Add Payment'} </a>

                    </Grid>
                    <hr />
                    <div className='form-data-cntr'>

                        <form onSubmit={handleSubmit(onSubmit)}>

                            {
                                dataLoading ?
                                    <LoadingEdit item={items} />
                                    :
                                    <>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-0">
                                            <div className='application-input'>
                                                <a className='form-text'>Amount</a>
                                                <Grid className='mb-5 forms-data' >
                                                    <TextInput type='text' control={control} name="amount"
                                                        value={watch('amount')} />
                                                    {errors.amount && <span className='form-validation'>{errors.amount.message}</span>}
                                                </Grid>
                                            </div>

                                            <div className='application-input'>
                                                <a className='form-text'>Date</a>

                                                <Grid className='mb-5 forms-data' >
                                                    <DateInput
                                                        control={control}
                                                        name="date"
                                                        value={watch('date')}
                                                    // placeholder='Date'
                                                    />
                                                    {errors.date && <span className='form-validation'>{errors.date.message}</span>}
                                                </Grid>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                                            <div className='application-input'>
                                                <a className='form-text'>Mode of Payment</a>
                                                <Grid className='mb-5 forms-data' >
                                                    <TextInput control={control} name="payment_mode"
                                                        value={watch('payment_mode')} />
                                                    {errors.payment_mode && <span className='form-validation'>{errors.payment_mode.message}</span>}
                                                </Grid>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                                            <div className='application-input'>
                                                <a className='form-text'>Details</a>
                                                <Grid className='mb-5 forms-data' >
                                                    <TextField
                                                        // placeholder='Details'
                                                        {...register('details')}
                                                        variant="outlined"
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        sx={{ width: '100%', }}
                                                    />
                                                    {errors.details && <span className='form-validation'>{errors.details.message}</span>}
                                                </Grid>
                                            </div>
                                        </div>

                                        <div onDrop={handleDrop}
                                            onDragOver={handleDragOver} >
                                            {/* <Button
                                                    onClick={handleClick}
                                                    sx={{ textTransform: 'none', height: 30 }}
                                                    variant='contained'
                                                    className='bg-sky-800'
                                                >
                                                    Upload Receipt
                                                </Button> */}
                                            {/* <input
                                                    type="file"
                                                    id="upload-button"
                                                    style={{ display: 'none' }}
                                                    onChange={handleFileUpload}
                                                    key={fileInputKey}
                                                /> */}
                                            <input
                                                type="file"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                id="file-upload"
                                                key={fileInputKey}
                                            />
                                            <label htmlFor="file-upload" style={{ cursor: 'pointer' }} className='add-document-block'>
                                                <Image src={Doc} alt='Doc' width={200} height={200} />

                                                <h3><span>Select File</span>  or Drag and Drop Here</h3>
                                            </label>



                                            {
                                                (attachment || details?.receipt_file) &&
                                                <Grid display={'flex'} justifyContent={'space-between'} item pr={1} xs={8} md={8}>

                                                    {
                                                        attachment &&
                                                            attachment?.name?.length > 30 ?
                                                            <Tooltip title={attachment?.name}>
                                                                <p>{attachment?.name?.substring(0, 30) + '...'}</p>
                                                            </Tooltip>
                                                            :
                                                            <p>{attachment?.name}</p>
                                                    }
                                                    {
                                                        !attachment &&
                                                        <Tooltip title={details?.receipt_file}>
                                                            <p className="text-gray-700 text-start">
                                                                {trimUrlAndNumbers(details?.receipt_file)}
                                                            </p>
                                                        </Tooltip>
                                                    }
                                                    {
                                                        attachment &&
                                                        <Delete onClick={handleDelete} fontSize='small' sx={{ color: 'red', cursor: 'pointer' }} />
                                                    }
                                                </Grid>
                                            }
                                        </div>
                                    </>
                            }

                            <Grid mt={2}  pb={3} >

                                <LoadingButton className='save-btn' loading={loading} disabled={loading || dataLoading} size='small' type='submit' sx={{ textTransform: 'none', height: 30 }} variant='contained'>{
                                    loading ?
                                        <Grid display={'flex'} justifyContent={'center'}><div className="spinner"></div></Grid>
                                        :
                                        <>
                                            Save <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                                                <path d="M7.875 13.5H19.125M19.125 13.5L14.625 9M19.125 13.5L14.625 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </>
                                }</LoadingButton>
                                <Button className='cancel-btn' onClick={handleClose} size='small' sx={{ textTransform: 'none', mr: 2 }} variant='outlined'> Cancel <svg svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 9L11.9999 11.9999M11.9999 11.9999L14.9999 14.9999M11.9999 11.9999L9 14.9999M11.9999 11.9999L14.9999 9M4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4801 4 18.9079 4.21799C19.2842 4.40973 19.5905 4.71547 19.7822 5.0918C20.0002 5.51962 20.0002 6.07967 20.0002 7.19978V16.7998C20.0002 17.9199 20.0002 18.48 19.7822 18.9078C19.5905 19.2841 19.2842 19.5905 18.9079 19.7822C18.4805 20 17.9215 20 16.8036 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                                </svg>
                                </Button>

                            </Grid>

                        </form>
                    </div>
                </Grid>
            </Drawer>
        </div >
    );
}
