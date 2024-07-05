import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Close } from '@mui/icons-material';
import { ListingApi } from '@/data/Endpoints/Listing';
import DateInput from '@/Form/DateInput';
import SelectX from '@/Form/SelectX';
import TextInput from '@/Form/TextInput';
import { useState } from 'react';
import moment from 'moment';
import toast from 'react-hot-toast';

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab';
import LoadingEdit from '@/Components/Common/Loading/LoadingEdit';
import { EventsApi } from '@/data/Endpoints/Events';

const scheme = yup.object().shape({

})

export default function CreateEvent({ editId, setEditId, refresh, setRefresh, lead_id, handleRefresh }) {
    const [state, setState] = React.useState({
        right: false,
    });

    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const [dataLoading, setDataLoading] = useState(false)

    const items = [
        { label: 'Template Name' },
        { label: 'Subject' },
        { label: 'Body Footer' },
        { label: 'Default CC' },
        { label: 'Default CC' },
        { label: 'Body', multi: true },
        // { label: 'Description' },

    ]

    const anchor = 'right'; // Set anchor to 'right'

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })


    const fetchBranches = (e) => {
        return ListingApi.office({ keyword: e }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }


    const onSubmit = async (data) => {

        setLoading(true)

        let start_date;
        if (data?.start_date) {
            start_date = moment(data?.start_date).format('YYYY-MM-DD')
        }
        let end_date;
        if (data?.end_date) {
            end_date = moment(data?.end_date).format('YYYY-MM-DD')
        }

        const formData = new FormData();

        let dataToSubmit = {
            name: data?.name,
            start_date: start_date,
            end_date: end_date,
            venue: data?.venue,
            office_id: data?.branch?.id,
            description: data?.description,
        }

        console.log(dataToSubmit);

        // formData.append('name', data?.name)
        // formData.append('start_date', data?.subject)
        // formData.append('end_date', data?.body)
        // formData.append('location', data?.body_footer)
        // formData.append('description', data?.default_cc)


        // for (var pair of formData.entries()) {
        //     console.log(pair[0] + ': ' + pair[1]); // Iterate through form data and log key-value pairs
        // }

        let action;

        if (editId > 0) {
            dataToSubmit['id'] = editId
            // formData.append('id', editId)
            action = EventsApi.update(dataToSubmit)
        } else {
            action = EventsApi.add(dataToSubmit)
        }

        action.then((response) => {
            // console.log(response?.data);
            if (response?.status == 200 || response?.status == 201) {
                toast.success(editId > 0 ? 'Event Has Been Successfully Updated' : 'Event Has Been Successfully Created')
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
            toast.error(error?.response?.data?.message)
            setLoading(false)
        })
    }


    const handleClose = () => {
        setEditId()
        reset()
        setValue('name', '')
        setValue('subject', '')
        setValue('body', '')
        setValue('default_cc', '')
        setValue('body_footer', '')
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

    const getDetails = async () => {
        setDataLoading(true)
        try {
            const response = await EventsApi.view({ id: editId })
            if (response?.data?.data) {
                let data = response?.data?.data
                setValue('name', data?.name)
                setValue('start_date', data?.start_date)
                setValue('end_date', data?.end_date)
                setValue('venue', data?.venue)
                setValue('branch', data?.office)
                setValue('description', data?.description)
                setDataLoading(false)
            }
            setDataLoading(false)
        } catch (error) {
            setDataLoading(false)
        }
    }



    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
            getDetails()
        } else if (editId == 0) {
            setOpen(true)
        }
    }, [editId])

    // console.log(watch('body'));


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

                        <a className='back_modal_head'> {editId > 0 ? "Edit Event" : 'Create Event'} </a>

                    </Grid>

                    <div className='form-data-cntr'>

                        <form onSubmit={handleSubmit(onSubmit)}>


                            {
                                dataLoading ?
                                    <LoadingEdit item={items} />
                                    :
                                    <>

                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                                            <div className='application-input'>
                                                <a className='form-text'>Name</a>
                                                <Grid className='mb-5 forms-data' >
                                                    <TextInput control={control} name="name"
                                                        value={watch('name')} />
                                                    {errors.name && <span className='form-validation'>{errors.name.message}</span>}
                                                </Grid>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-0">

                                            <div className='application-input'>
                                                <a className='form-text'>Start Date</a>
                                                <Grid className='mb-5 forms-data' >
                                                    <DateInput
                                                        control={control}
                                                        name="start_date"
                                                        value={watch('start_date')}
                                                    />
                                                </Grid>
                                            </div>

                                            <div className='application-input'>
                                                <a className='form-text'>End Date</a>
                                                <Grid className='mb-5 forms-data' >
                                                    <DateInput
                                                        control={control}
                                                        name="end_date"
                                                        value={watch('end_date')}
                                                    />
                                                </Grid>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">

                                            <div className='application-input'>
                                                <a className='form-text'>Select Branch</a>
                                                <Grid className='mb-5 forms-data' >
                                                    <SelectX
                                                        loadOptions={fetchBranches}
                                                        control={control}
                                                        name={'branch'}
                                                        defaultValue={watch('branch')}
                                                    />
                                                </Grid>
                                            </div>

                                            <div className='application-input'>
                                                <a className='form-text'>Venue</a>
                                                <Grid className='mb-5 forms-data' >
                                                    <TextField
                                                        {...register('venue')}
                                                        variant="outlined"
                                                        fullWidth
                                                        multiline
                                                        rows={2}
                                                        sx={{ width: '100%', }}
                                                    />
                                                    {/* <TextInput control={control} name="venue"
                                                        value={watch('venue')} /> */}
                                                    {errors.venue && <span className='form-validation'>{errors.venue.message}</span>}
                                                </Grid>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">

                                            <div className='application-input'>
                                                <a className='form-text'>Description</a>
                                                <Grid className='mb-5 forms-data' >
                                                    <TextField
                                                        {...register('description')}
                                                        variant="outlined"
                                                        fullWidth
                                                        multiline
                                                        rows={2}
                                                        sx={{ width: '100%', }}
                                                    />
                                                    {errors.description && <span className='form-validation'>{errors.description.message}</span>}
                                                </Grid>
                                            </div>
                                        </div>

                                    </>
                            }

                            <Grid pb={3}  >
                                <LoadingButton className='save-btn' loading={loading} disabled={loading || dataLoading} type='submit'  >
                                    {
                                        loading ?
                                            <Grid display={'flex'} justifyContent={'center'}><div className="spinner"></div></Grid>
                                            :
                                            <>
                                                Submit <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                                                    <path d="M7.875 13.5H19.125M19.125 13.5L14.625 9M19.125 13.5L14.625 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                                                </svg>
                                            </>
                                    }
                                </LoadingButton>
                                <Button className='cancel-btn' onClick={handleClose}>Cancel <svg svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 9L11.9999 11.9999M11.9999 11.9999L14.9999 14.9999M11.9999 11.9999L9 14.9999M11.9999 11.9999L14.9999 9M4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4801 4 18.9079 4.21799C19.2842 4.40973 19.5905 4.71547 19.7822 5.0918C20.0002 5.51962 20.0002 6.07967 20.0002 7.19978V16.7998C20.0002 17.9199 20.0002 18.48 19.7822 18.9078C19.5905 19.2841 19.2842 19.5905 18.9079 19.7822C18.4805 20 17.9215 20 16.8036 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                                </svg></Button>

                            </Grid>


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
