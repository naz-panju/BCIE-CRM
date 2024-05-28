import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, IconButton, Skeleton, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Close, Refresh } from '@mui/icons-material';
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


const scheme = yup.object().shape({
    amount: yup.string().required("Deposit Amount is Required"),
    date: yup.string().required("Deposit Paid Date is Required"),
    // phone: yup.string().required("Phone Number is Required"),
    // dob: yup.string().required("Date Of Birth is Required"),
    // zip: yup.string().required("Zip Code is Required"),
    // country: yup.object().required("Please Choose a Country").typeError("Please choose a Country"),
    // state: yup.string().required("State is Required"),
})

export default function UniversityDeposit({ details, editId, setEditId, refresh, setRefresh }) {

    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const [dataLoading, setDataLoading] = useState(false)

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


    const onSubmit = async (data) => {

        setLoading(true)
        let date = ''
        if (data?.date) {
            date = moment(data?.date).format('YYYY-MM-DD')
        }

        let dataToSubmit = {
            id: details.id,
            deposit_amount: data?.amount,
            deposit_paid_on: date
            // substage_id: data?.substage?.id,
        }


        let action;

        action = ApplicationApi.addDeposit(dataToSubmit)

        // if (editId > 0) {
        //     // dataToSubmit['id'] = editId
        //     // action = TaskApi.update(dataToSubmit)
        // } else {
        //     action = ApplicationApi.addDeposit(dataToSubmit)
        // }

        action.then((response) => {
            // console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                toast.success(response?.data?.message)
                reset()
                handleClose()
                setRefresh(!refresh)
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


    const setInitialValue=()=>{
        // console.log(details)
        setValue('amount',details?.deposit_amount_paid)
        setValue('date',details?.deposit_paid_on)
    }


    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
            setInitialValue()
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
                    <Grid p={1} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        {/* <a style={{ fontWeight: 500, fontSize: '19px' }}>{editId > 0 ? 'Edit Deposit' : 'Add Deposit'}</a> */}
                        <a style={{ fontWeight: 500, fontSize: '19px' }}>Deposit Amount</a>
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
                                            <Grid item pr={1} xs={4} md={4}>
                                                <a className='form-text'>Deposit Amount</a>
                                            </Grid>
                                            <Grid item pr={1} xs={8} md={8}>
                                                <TextInput type='number' control={control} name="amount"
                                                    value={watch('amount')} />
                                                {errors.amount && <span className='form-validation'>{errors.amount.message}</span>}
                                            </Grid>
                                        </Grid>
                                        <Grid p={1} container >
                                            <Grid item pr={1} xs={4} md={4}>
                                                <a className='form-text'>Deposit Paid Date</a>
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
                                    </>
                            }

                            {/* <Grid p={1} pb={3} display={'flex'} justifyContent={'end'}>
                                <Button onClick={handleClose} size='small' sx={{ textTransform: 'none', mr: 2 }} variant='outlined'>Cancel</Button>
                                <LoadingButton loading={loading} disabled={loading || dataLoading} size='small' type='submit' sx={{ textTransform: 'none', height: 30 }} variant='contained'>Save</LoadingButton>
                            </Grid> */}

                        </form>
                    </div>
                </Grid>
            </Drawer>
        </div >
    );
}
