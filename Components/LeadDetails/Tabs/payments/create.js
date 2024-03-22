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


const scheme = yup.object().shape({
    amount: yup.string().required("Amount is Required"),
    payment_mode: yup.string().required("Payment Mode is Required"),
  
})

export default function LeadPaymentModal({ lead_id, editId, setEditId, handleRefresh }) {
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

    const handleFileUpload = (event) => {
        setFileInputKey(prevKey => prevKey + 1);
        const file = event.target.files[0];
        if (file) {
            setAttachment(file);
        }
    };

    const handleDelete = () => {
        setAttachment(null); // Clear selected file
    };


    const onSubmit = async (data) => {
        // console.log(data);

        setLoading(true)

        let dataToSubmit = {
            lead_id: lead_id,
            amount: data?.amount,
            payment_mode: data?.payment_mode,
            details: data?.details,
        }

        console.log(dataToSubmit);

        let action;

        if (editId > 0) {
            dataToSubmit['id'] = editId
            action = PaymentApi.update(dataToSubmit)
        } else {
            action = PaymentApi.add(dataToSubmit)
        }

        action.then((response) => {
            console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                toast.success(editId > 0 ? 'Payment has been Updated Successfully' : 'Payment has been Added Successfully')
                reset()
                handleClose()
                handleRefresh()
                setLoading(false)
            }else{
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


    const getDetails = async () => {
        setDataLoading(true)
        const response = await PaymentApi.view({ id: editId })
        if (response?.data?.data) {
            let data = response?.data?.data

            setValue('amount', data?.amount)
            // setValue('date', data?.university)
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
                onClose={handleDrawerClose}
            >
                <Grid width={500}>
                    <Grid p={1} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <a style={{ fontWeight: 500, fontSize: '19px' }}>{editId > 0 ? 'Edit Payment' : 'Add Payment'}</a>
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

                                        <Grid p={1} container >
                                            <Grid item pr={1} display={'flex'} alignItems={'center'} xs={4} md={4}>
                                                <a className='form-text'>Amount</a>
                                            </Grid>

                                            <Grid item pr={1} xs={8} md={8}>
                                                <TextInput type='number' control={control} name="amount"
                                                    value={watch('amount')} />
                                                {errors.amount && <span className='form-validation'>{errors.amount.message}</span>}
                                            </Grid>
                                        </Grid>


                                        <Grid p={1} container >
                                            <Grid item pr={1} display={'flex'} alignItems={'center'} xs={4} md={4}>
                                                <a className='form-text'>Date</a>
                                            </Grid>

                                            <Grid item pr={1} xs={8} md={8}>
                                                <DateInput
                                                    control={control}
                                                    name="date"
                                                    value={watch('date')}
                                                // placeholder='Due Date'
                                                />

                                                {errors.date && <span className='form-validation'>{errors.date.message}</span>}
                                            </Grid>
                                        </Grid>



                                        <Grid p={1} container >
                                            <Grid item pr={1} display={'flex'} alignItems={'center'} xs={4} md={4}>
                                                <a className='form-text'>Mode of Payment</a>
                                            </Grid>

                                            <Grid item pr={1} xs={8} md={8}>
                                                <TextInput control={control} name="payment_mode"
                                                    value={watch('payment_mode')} />
                                                {errors.payment_mode && <span className='form-validation'>{errors.payment_mode.message}</span>}
                                            </Grid>
                                        </Grid>


                                        <Grid p={1} container >
                                            <Grid item pr={1} xs={4} md={4}>
                                                <a className='form-text'> Details </a>
                                            </Grid>

                                            <Grid item pr={1} xs={8} md={8}>
                                                <TextField
                                                    {...register('details')}
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    sx={{ width: '100%', }}
                                                />
                                                {errors.details && <span className='form-validation'>{errors.details.message}</span>}

                                            </Grid>

                                        </Grid>

                                        {/* <Grid p={1} mt={1} mb={1} display={'flex'} alignItems={'center'} container className='bg-sky-100' height={80} >
                                            <Grid item pr={1} alignItems={'center'} xs={4} md={4}>
                                                <Button
                                                    onClick={handleClick}
                                                    sx={{ textTransform: 'none', height: 30 }}
                                                    variant='contained'
                                                    className='bg-sky-800'
                                                >
                                                    Upload Receipt
                                                </Button>
                                                <input
                                                    type="file"
                                                    id="upload-button"
                                                    style={{ display: 'none' }}
                                                    onChange={handleFileUpload}
                                                    key={fileInputKey}
                                                />
                                            </Grid>

                                            {
                                                attachment &&
                                                <Grid display={'flex'} justifyContent={'space-between'} item pr={1} xs={8} md={8}>

                                                    {
                                                        attachment?.name?.length > 30 ?
                                                            <Tooltip title={attachment?.name}>
                                                                <p>{attachment?.name?.substring(0, 30) + '...'}</p>
                                                            </Tooltip>
                                                            :
                                                            <p>{attachment?.name}</p>
                                                    }
                                                    <Delete onClick={handleDelete} fontSize='small' sx={{ color: 'red', cursor: 'pointer' }} />
                                                </Grid>
                                            }
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
