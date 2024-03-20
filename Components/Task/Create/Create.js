import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, IconButton, Skeleton, TextField, Typography } from '@mui/material';
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
import ConfirmPopup from '@/Components/Common/Popup/confirm';
import Editor from '@/Form/Editor';

const scheme = yup.object().shape({
    title: yup.string().required("Title is Required"),
    description: yup.string().required("Description is Required"),
})

export default function CreateTask({ editId, setEditId, refresh, setRefresh, lead_id, handleRefresh }) {
    const [state, setState] = React.useState({
        right: false,
    });
    const [selectedPriority, setSelectedPriority] = useState('Medium');
    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const [dataLoading, setDataLoading] = useState(false)

    const [archiveId, setArchiveId] = useState()
    const [archiveLoading, setArchiveLoading] = useState(false)

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
        console.log(id);
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
            reviewer_id: data?.reviewer?.id,
            priority: selectedPriority,
        }

        console.log(dataToSubmit);

        if (lead_id) {
            dataToSubmit['lead_id'] = lead_id
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


    const archiveTask = () => {
        setArchiveLoading(true)
        let dataToSubmit = {
            id: archiveId
        }

        TaskApi.archive(dataToSubmit).then((response) => {
            if (response?.status === 200 || response?.status === 201) {
                toast.success('Task has been Archived')
                setArchiveId()
                setRefresh(!refresh)
                setArchiveLoading(false)
                handleClose()
            } else {
                toast.error(response?.response?.data?.message)
                setArchiveId()
                setArchiveLoading(false)
            }
        }).catch((error) => {
            console.log(error);
            toast.error(error?.response?.data?.message)
            setArchiveLoading(false)
        })

    }


    const handleClose = () => {
        setEditId()
        reset()
        setValue('title', '')
        setValue('date', '')
        setValue('assigned_to', '')
        setValue('reviewer', '')
        setOpen(false)
        setSelectedPriority('Medium')
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
                setValue('reviewer', data?.reviewer)
                setSelectedPriority(data?.priority)
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

            <ConfirmPopup loading={archiveLoading} ID={archiveId} setID={setArchiveId} clickFunc={archiveTask} title={'Do you want to Archive this Task?'} />


            <Drawer
                anchor={anchor}
                open={open}
                onClose={handleDrawerClose}
            >
                <Grid width={650}>
                    <Grid p={1} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <a style={{ fontWeight: 500, fontSize: '19px' }}>{editId > 0 ? "Edit Task" : 'Add Task'}</a>
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

                            <Grid display={'flex'} alignItems={'center'} container p={1.5} pb={0} item xs={12}>
                                <Grid item md={4}>
                                </Grid>
                                <Grid item display={'flex'} justifyContent={'end'} md={8}>
                                    <Button onClick={handleConfirmArchive} size='small' sx={{ textTransform: 'none' }} className='bg-sky-500' variant='contained'><Archive sx={{ mr: 1 }} fontSize='small' /> Archive</Button>
                                </Grid>
                            </Grid>
                            {
                                dataLoading ?
                                    <LoadingEdit item={items} />
                                    :
                                    <>
                                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={4}>
                                                <Typography sx={{ fontWeight: '500' }}>Title</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <TextInput control={control} name="title"
                                                    value={watch('title')} />
                                                {errors.title && <span className='form-validation'>{errors.title.message}</span>}
                                            </Grid>
                                        </Grid>

                                        {/* date */}
                                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={4}>
                                                <Typography sx={{ fontWeight: '500' }}>Due Date</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
                                                <DateInput
                                                    control={control}
                                                    name="date"
                                                    value={watch('date')}
                                                // placeholder='Due Date'
                                                />
                                                {/* </LocalizationProvider> */}

                                            </Grid>
                                        </Grid>

                                        {/* assigned to */}
                                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={4}>
                                                <Typography sx={{ fontWeight: '500' }}>Assigned To</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <SelectX
                                                    loadOptions={fetchUser}
                                                    control={control}
                                                    // error={errors?.assigned_to?.id ? errors?.assigned_to?.message : false}
                                                    // error2={errors?.assigned_to?.message ? errors?.assigned_to?.message : false}
                                                    name={'assigned_to'}
                                                    defaultValue={watch('assigned_to')}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={4}>
                                                <Typography sx={{ fontWeight: '500' }}>Reviewer</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <SelectX
                                                    loadOptions={fetchUser}
                                                    control={control}
                                                    // error={errors?.assigned_to?.id ? errors?.assigned_to?.message : false}
                                                    // error2={errors?.assigned_to?.message ? errors?.assigned_to?.message : false}
                                                    name={'reviewer'}
                                                    defaultValue={watch('reviewer')}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={4}>
                                                <Typography sx={{ fontWeight: '500' }}>Priority</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                {priority.map(obj => {
                                                    return <DynamicChip key={obj.name} name={obj.name} id={obj.name} active={selectedPriority} onChipCLick={handlePriorityChange} />
                                                })}
                                            </Grid>
                                        </Grid>

                                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={4}>
                                                <Typography sx={{ fontWeight: '500' }}>Description</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
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
