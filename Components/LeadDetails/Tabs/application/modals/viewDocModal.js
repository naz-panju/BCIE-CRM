import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, IconButton, Paper, Skeleton, TextField, Typography } from '@mui/material';
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

export default function ViewDocumentModal({ details, editId, setEditId, refresh, setRefresh ,handleDeleteOpen}) {

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
                onClose={handleDrawerClose}
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

                        <Grid sx={{ width: '100%', m: 1, }}>
                            <Grid mb={1}>
                                Student Document
                            </Grid>
                            {
                                details?.documents?.map((obj, index) => (

                                    <Grid key={index} container spacing={1} justifyContent="center">
                                        <Grid item p={1} xs={12}>
                                            <Paper elevation={3} sx={{ p: 1, ml: 1 }}>
                                                <Grid key={index} display={'flex'} justifyContent={'space-between'} alignItems={'center'} sx={{ mt: index !== 0 ? 1 : '' }}>
                                                    <a target='_blank' href={obj?.document} key={index} >{trimUrlAndNumbers(obj?.title || obj?.document_template?.name)}</a>


                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                                                        <path d="M2.5 3.16667V11.6889C2.5 12.4979 2.5 12.9021 2.66349 13.211C2.8073 13.4828 3.0366 13.7042 3.31885 13.8427C3.6394 14 4.05925 14 4.89768 14H9.10232C9.94075 14 10.36 14 10.6805 13.8427C10.9628 13.7042 11.1929 13.4828 11.3367 13.211C11.5 12.9024 11.5 12.4985 11.5 11.6911V3.16667M2.5 3.16667H4M2.5 3.16667H1M4 3.16667H10M4 3.16667C4 2.49364 4 2.15729 4.11418 1.89185C4.26642 1.53792 4.55824 1.25655 4.92578 1.10995C5.20144 1 5.55109 1 6.25 1H7.75C8.44891 1 8.79837 1 9.07402 1.10995C9.44157 1.25655 9.7335 1.53792 9.88574 1.89185C9.99992 2.15729 10 2.49364 10 3.16667M10 3.16667H11.5M11.5 3.16667H13" stroke="#0B0D23" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>
                                                </Grid>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                ))
                            }
                        </Grid>


                        <Grid sx={{ width: '100%', m: 1, }}>
                            <Grid display={'flex'} justifyContent={'space-between'}>
                                University Document
                                <Button>Add </Button>
                            </Grid>

                            {
                                details?.university_documents?.map((obj, index) => (
                                    <Grid key={index} container spacing={1} justifyContent="center">
                                        <Grid item xs={12}>
                                            <Paper elevation={3} sx={{ p: 1, ml: 1 }}>
                                                <Grid key={index} display={'flex'} justifyContent={'space-between'} alignItems={'center'} sx={{ mt: index !== 0 ? 1 : '' }}>
                                                    <a target='_blank' href={obj?.document} key={index} >{trimUrlAndNumbers(obj?.title || obj?.document_template?.name)}</a>


                                                    <svg onClick={()=>handleDeleteOpen(obj?.id)} xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                                                        <path d="M2.5 3.16667V11.6889C2.5 12.4979 2.5 12.9021 2.66349 13.211C2.8073 13.4828 3.0366 13.7042 3.31885 13.8427C3.6394 14 4.05925 14 4.89768 14H9.10232C9.94075 14 10.36 14 10.6805 13.8427C10.9628 13.7042 11.1929 13.4828 11.3367 13.211C11.5 12.9024 11.5 12.4985 11.5 11.6911V3.16667M2.5 3.16667H4M2.5 3.16667H1M4 3.16667H10M4 3.16667C4 2.49364 4 2.15729 4.11418 1.89185C4.26642 1.53792 4.55824 1.25655 4.92578 1.10995C5.20144 1 5.55109 1 6.25 1H7.75C8.44891 1 8.79837 1 9.07402 1.10995C9.44157 1.25655 9.7335 1.53792 9.88574 1.89185C9.99992 2.15729 10 2.49364 10 3.16667M10 3.16667H11.5M11.5 3.16667H13" stroke="#0B0D23" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>
                                                </Grid>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                ))
                            }
                        </Grid>


                        {/* <form onSubmit={handleSubmit(onSubmit)}>

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

                            <Grid p={1} pb={3} display={'flex'} justifyContent={'end'}>
                                <Button onClick={handleClose} size='small' sx={{ textTransform: 'none', mr: 2 }} variant='outlined'>Cancel</Button>
                                <LoadingButton loading={loading} disabled={loading || dataLoading} size='small' type='submit' sx={{ textTransform: 'none', height: 30 }} variant='contained'>Save</LoadingButton>
                            </Grid>

                        </form> */}
                    </div>
                </Grid>
            </Drawer>
        </div >
    );
}
