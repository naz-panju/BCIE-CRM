import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import {  Close } from '@mui/icons-material';
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
            end_date:end_date,
            venue:data?.venue,
            office_id:data?.branch?.id,
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
                    <Grid p={1} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <a style={{ fontWeight: 500, fontSize: '19px' }}>{editId > 0 ? "Edit Event" : 'Add Event'}</a>
                        <IconButton
                            onClick={handleClose}
                        >
                            <Close />
                        </IconButton>
                    </Grid>
                    <hr />
                    <div>

                        <form onSubmit={handleSubmit(onSubmit)}>

                            {/* <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                <Grid item md={4}>
                                    <Typography sx={{ fontWeight: '500' }}>Select Lead</Typography>
                                </Grid>
                                <Grid item md={8}>
                                    <SelectX
                                        options={fetchLead}
                                        control={control}
                                        // error={errors?.assigned_to?.id ? errors?.assigned_to?.message : false}
                                        // error2={errors?.assigned_to?.message ? errors?.assigned_to?.message : false}
                                        name={'lead'}
                                        defaultValue={watch('lead')}
                                    />
                                </Grid>
                            </Grid> */}

                            {
                                dataLoading ?
                                    <LoadingEdit item={items} />
                                    :
                                    <>

                                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={3}>
                                                <Typography sx={{ fontWeight: '500' }}>Name</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={9}>
                                                <TextInput control={control} name="name"
                                                    value={watch('name')} />
                                                {errors.name && <span className='form-validation'>{errors.name.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={3}>
                                                <Typography sx={{ fontWeight: '500' }}>Start Date</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={9}>
                                                <DateInput
                                                    control={control}
                                                    name="start_date"
                                                    value={watch('start_date')}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={3}>
                                                <Typography sx={{ fontWeight: '500' }}>End Date</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={9}>
                                                <DateInput
                                                    control={control}
                                                    name="end_date"
                                                    value={watch('end_date')}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                            <Grid item md={3}>
                                                <Typography sx={{ fontWeight: '500' }}>Select Branch</Typography>
                                            </Grid>
                                            <Grid item md={9}>
                                                <SelectX
                                                    loadOptions={fetchBranches}
                                                    control={control}
                                                    name={'branch'}
                                                    defaultValue={watch('branch')}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={3}>
                                                <Typography sx={{ fontWeight: '500' }}>Venue</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={9}>
                                                <TextInput control={control} name="venue"
                                                    value={watch('venue')} />
                                                {errors.venue && <span className='form-validation'>{errors.venue.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid display={'flex'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={3}>
                                                <Typography sx={{ fontWeight: '500' }}>Description</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={9}>
                                                <TextField
                                                    {...register('description')}
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    sx={{ width: '100%', }}
                                                />
                                                {errors.description && <span className='form-validation'>{errors.description.message}</span>}

                                                {/* <Editor emoji={false} val={watch('description')}
                                            onValueChange={e => setValue('description', e)}
                                        /> */}
                                            </Grid>
                                        </Grid>

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
        </div>
    );
}
