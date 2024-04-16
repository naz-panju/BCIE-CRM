import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, IconButton, Skeleton, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Close, Refresh } from '@mui/icons-material';
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
import moment from 'moment';
import { FollowupApi } from '@/data/Endpoints/Followup';


const scheme = yup.object().shape({
    assigned_to: yup.object().required("Please Choose an User").typeError("Please choose an User"),
    date: yup.string().required('Date field is Required')
    // university: yup.object().required("Please Choose an University").typeError("Please choose an University"),
    // course: yup.object().required("Please Choose a Course").typeError("Please choose a Course"),
    // intake: yup.object().required("Please Choose an Intake").typeError("Please choose an Intake"),

})

export default function FollowUpModal({ lead_id, editId, setEditId, refresh, setRefresh, from, app_id }) {
    const [state, setState] = React.useState({
        right: false,
    });
    const [selectedPriority, setSelectedPriority] = useState('Medium');
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

    const [selectedCountryID, setselectedCountryID] = useState()
    const [selectedUniversityId, setselectedUniversityId] = useState()
    const [coursePopup, setcoursePopup] = useState(false)


    const fetchUser = (e) => {
        return ListingApi.users({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }

    const handleClose = () => {
        setEditId()
        reset()
        setOpen(false)

    }

    const onSubmit = async (data) => {
        // console.log(data);

        setLoading(true)

        let date = ''
        if (data?.date) {
            date = moment(data?.date).format('YYYY-MM-DD')
        }

        let  dataToSubmit = {
            lead_id: lead_id,
            follow_up_date: date,
            assigned_to: data?.assigned_to?.id,
            note: data?.note,
        }
        if (from == 'app') {
            dataToSubmit['application_id'] = app_id
        }

        // console.log(dataToSubmit);

        let action;

        if (editId > 0) {
            // dataToSubmit['id'] = editId
            // action = TaskApi.update(dataToSubmit)
        } else {
            action = FollowupApi.add(dataToSubmit)
        }

        action.then((response) => {
            console.log(response);
            if (response?.status == 200 || 201) {
                toast.success('Follow-up has been created successfully')
                handleClose()
                setRefresh(!refresh)
                setLoading(false)
            } else {
                toast.error(response?.response?.data?.message)
            }

            setLoading(false)
        }).catch((error) => {
            console.log(error);
            toast.error(error?.message)
            setLoading(false)
        })
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

    const handleAssignedToChange = (data) => {
        setValue('assigned_to', data || '')
    }


    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
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
                        <a style={{ fontWeight: 500, fontSize: '19px' }}>Add Follow Up</a>
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
                                                <a className='form-text'>Assigned To</a>
                                            </Grid>

                                            <Grid item pr={1} xs={8} md={8}>
                                                <AsyncSelect
                                                    name='assigned_to'
                                                    defaultValue={watch('assigned_to')}
                                                    // isClearable
                                                    defaultOptions
                                                    loadOptions={fetchUser}
                                                    getOptionLabel={(e) => e.name}
                                                    getOptionValue={(e) => e.id}
                                                    onChange={handleAssignedToChange}
                                                />
                                                {/* <SelectX
                                                    loadOptions={fetchCounty}
                                                    control={control}
                                                    name={'country'}
                                                    defaultValue={watch('country')}
                                                /> */}
                                                {errors.assigned_to && <span className='form-validation'>{errors.assigned_to.message}</span>}

                                            </Grid>

                                        </Grid>



                                        <Grid p={1} container >
                                            <Grid item pr={1} display={'flex'} alignItems={'center'} xs={4} md={4}>
                                                <a className='form-text'>Followup Date</a>
                                            </Grid>

                                            <Grid item pr={1} xs={8} md={8}>
                                                <DateInput
                                                    minDate={true}
                                                    control={control}
                                                    name="date"
                                                    value={watch('date')}
                                                />
                                                {errors.date && <span className='form-validation'>{errors.date.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid p={1} container >
                                            <Grid item pr={1} xs={4} md={4}>
                                                <a className='form-text'> Note </a>
                                            </Grid>

                                            <Grid item pr={1} xs={8} md={8}>
                                                <TextField
                                                    {...register('note')}
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    sx={{ width: '100%', }}
                                                />
                                                {errors.email && <span className='form-validation'>{errors.email.message}</span>}

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
        </div >
    );
}
