import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Archive, Close, Refresh } from '@mui/icons-material';
import { ListingApi } from '@/data/Endpoints/Listing';
import DateInput from '@/Form/DateInput';
import SelectX from '@/Form/SelectX';
import TextInput from '@/Form/TextInput';
import DynamicChip from '@/utils/DynamicChip';
import { useState } from 'react';
import moment from 'moment';
import { TaskApi } from '@/data/Endpoints/Task';
import toast from 'react-hot-toast';
import { LeadApi } from '@/data/Endpoints/Lead';

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab';
import LoadingEdit from '@/Components/Common/Loading/LoadingEdit';


const scheme = yup.object().shape({
    title: yup.string().required("Title is Required"),
    description: yup.string().required("Description is Required"),
})

export default function CreateTask({ editId, setEditId, refresh, setRefresh, lead_id, handleRefresh, from, app_id,detailRefresh }) {
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

    const priority = [
        { id: 1, name: "Critical" },
        { id: 2, name: "High" },
        { id: 3, name: "Medium" },
        { id: 4, name: "Low" },
    ]

    const fetchUser = (e) => {
        return ListingApi.users({ keyword: e }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }

    const fetchLead = (e) => {
        return LeadApi.list({ keyword: e }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }

    const handlePriorityChange = (id) => {
        // console.log(id);
        setSelectedPriority(id);
    }


    const onSubmit = async (data) => {

        setLoading(true)
        let dueDate = ''
        if (data?.date) {
            dueDate = moment(data?.date).format('YYYY-MM-DD')
        }

        let dataToSubmit = {
            // lead_id: data?.lead?.id,
            title: data?.title,
            description: data?.description,
            due_date: dueDate,
            assigned_to_user_id: data?.assigned_to?.id,
            // reviewer_id: data?.reviewer?.id,
            // priority: selectedPriority,
        }

        // console.log(dataToSubmit);

        if (lead_id) {
            dataToSubmit['lead_id'] = lead_id
            if (from == 'app') {
                dataToSubmit['application_id'] = app_id
            }
        }


        let action;

        if (editId > 0) {
            dataToSubmit['id'] = editId
            action = TaskApi.update(dataToSubmit)
        } else {
            action = TaskApi.add(dataToSubmit)
        }

        action.then((response) => {
            if (response?.data) {
                toast.success(editId > 0 ? 'Task Has Been Successfully Updated' : 'Task Has Been Successfully Created')
                if(detailRefresh){
                    detailRefresh()
                }
                reset()
                handleClose()
                handleRefresh()
                setLoading(false)
            }

            setLoading(false)
        }).catch((error) => {
            console.log(error);
            toast.error(error?.message)
            setLoading(false)
        })

        // try {
        //     const response = await TaskApi.add(dataToSubmit)
        //     console.log(response);

        //     if (response?.data) {
        //         toast.success('Task Has Been Successfully Created ')
        //         setRefresh(!refresh)
        //         reset()
        //         setOpen(false)
        //     }

        // } catch (error) {
        //     console.log(error);
        //     toast.error(error?.message)

        // }
    }


    const handleConfirmArchive = () => {
        setArchiveId(editId)
    }


    const handleClose = () => {
        setEditId()
        reset()
        setValue('title', '')
        setValue('date', '')
        setValue('assigned_to', '')
        // setValue('reviewer', '')
        setOpen(false)
        // setSelectedPriority('Medium')
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
            const response = await TaskApi.view({ id: editId })
            if (response?.data?.data) {
                let data = response?.data?.data
                // console.log(data);

                setValue('title', data?.title)
                setValue('date', data?.due_date)
                setValue('assigned_to', data?.assignedToUser)
                // setValue('reviewer', data?.reviewer)
                // setSelectedPriority(data?.priority)
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


    return (
        <div>

            <Drawer
                anchor={anchor}
                open={open}
                onClose={handleClose}
            >
                <Grid width={650}>


                    <Grid className='modal_title d-flex align-items-center  '>
                        <a className='back_modal' onClick={handleClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                                <path d="M21.9582 15.5H9.0415M9.0415 15.5L14.2082 20.6666M9.0415 15.5L14.2082 10.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                            </svg>
                        </a>
                        <a className='back_modal_head'>{editId > 0 ? "Edit Task" : 'Add Task'}</a>

                    </Grid>


                    <div className='form-data-cntr'>

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
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                                            <div className='application-input'>
                                                <a className='form-text'>Title</a>
                                                <Grid className='mb-5 forms-data'>
                                                    <TextInput control={control} name="title"
                                                        value={watch('title')} />
                                                    {errors.title && <span className='form-validation'>{errors.title.message}</span>}
                                                </Grid>
                                            </div>
                                        </div>



                                        {/* date */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-0">
                                            <div className='application-input'>

                                                <a className='form-text'>Due Date</a>
                                                <Grid className='mb-5 forms-data  '>
                                                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
                                                    <DateInput
                                                        control={control}
                                                        name="date"
                                                        value={watch('date')}
                                                    // placeholder='Due Date'
                                                    />
                                                    {/* </LocalizationProvider> */}

                                                </Grid>
                                            </div>


                                            {/* assigned to */}

                                            <div className='application-input'>
                                                <a className='form-text'>Assigned To</a>
                                                <Grid className='mb-5 forms-data  '>
                                                    <SelectX
                                                        // placeholder='Assigned To'
                                                        loadOptions={fetchUser}
                                                        control={control}
                                                        // error={errors?.assigned_to?.id ? errors?.assigned_to?.message : false}
                                                        // error2={errors?.assigned_to?.message ? errors?.assigned_to?.message : false}
                                                        name={'assigned_to'}
                                                        defaultValue={watch('assigned_to')}
                                                    />
                                                </Grid>
                                            </div>
                                        </div>


                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                                            <div className='application-input'>
                                                <a className='form-text'>Description</a>
                                                {/* frm-text-conn-stl */}
                                                <Grid className='mb-5 forms-data  '>
                                                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V12M9 15V12.5L17.75 3.75C18.4404 3.05964 19.5596 3.05964 20.25 3.75V3.75C20.9404 4.44036 20.9404 5.55964 20.25 6.25L15.5 11L11.5 15H9Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round"></path></svg> */}
                                                    <TextField
                                                        {...register('description')}
                                                        variant="outlined"
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        sx={{ width: '100%', }}
                                                    />
                                                    {errors.description && <span className='form-validation'>{errors.description.message}</span>}

                                                 
                                                </Grid>
                                            </div>
                                        </div>

                                    </>
                            }

                            <Grid pb={3} display={'flex'} >

                                <LoadingButton loading={loading} disabled={loading || dataLoading} size='small' type='submit' sx={{ textTransform: 'none', height: 30 }} variant='contained' className='save-btn'>{
                                    loading ?
                                        <Grid display={'flex'} justifyContent={'center'}><div className="spinner"></div></Grid>
                                        :
                                        <>
                                            Save  <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                                                <path d="M7.875 13.5H19.125M19.125 13.5L14.625 9M19.125 13.5L14.625 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </>
                                } <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                                        <path d="M7.875 13.5H19.125M19.125 13.5L14.625 9M19.125 13.5L14.625 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                                    </svg></LoadingButton>
                                <Button className='cancel-btn' onClick={handleClose} size='small' sx={{ textTransform: 'none', mr: 2 }} variant='outlined'>Cancel <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 9L11.9999 11.9999M11.9999 11.9999L14.9999 14.9999M11.9999 11.9999L9 14.9999M11.9999 11.9999L14.9999 9M4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4801 4 18.9079 4.21799C19.2842 4.40973 19.5905 4.71547 19.7822 5.0918C20.0002 5.51962 20.0002 6.07967 20.0002 7.19978V16.7998C20.0002 17.9199 20.0002 18.48 19.7822 18.9078C19.5905 19.2841 19.2842 19.5905 18.9079 19.7822C18.4805 20 17.9215 20 16.8036 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                                </svg> </Button>

                            </Grid>

                        </form>
                    </div>
                </Grid>
            </Drawer>
        </div>
    );
}
