import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Close, Refresh } from '@mui/icons-material';
import { ListingApi } from '@/data/Endpoints/Listing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DateInput from '@/Components/Form/DateInput';
import SelectX from '@/Components/Form/SelectX';
import { useForm } from 'react-hook-form';
import TextInput from '@/Components/Form/TextInput';
import DynamicChip from '@/utils/DynamicChip';
import { useState } from 'react';
import Editor from '@/Components/Form/Editor';
import moment from 'moment';
import { TaskApi } from '@/data/Endpoints/Task';
import toast from 'react-hot-toast';
import { LeadApi } from '@/data/Endpoints/Lead';

export default function CreateTask({ open, setOpen, refresh, setRefresh }) {
    const [state, setState] = React.useState({
        right: false,
    });
    const [selectedPriority, setSelectedPriority] = useState('Medium');

    const anchor = 'right'; // Set anchor to 'right'

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({})

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


        let dueDate = ''
        if (data?.date) {
            dueDate = moment(data?.date?.$d).format('YYYY-MM-DD')
        }

        let dataToSubmit = {
            title: data?.title,
            description: data?.description,
            // start_date: startDate,
            // end_date: phone,
            due_date: dueDate,
            assigned_to_user_id: data?.assigned_to?.id,
            reviewer_id: data?.reviewer?.id,
            priority: selectedPriority,
        }

        console.log(dataToSubmit);

        try {
            const response = await TaskApi.add(dataToSubmit)
            console.log(response);

            if (response?.data) {
                toast.success('Task Has Been Successfully Created ')
                setRefresh(!refresh)
                reset()
                setOpen(false)
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.message)

        }
    }


    const handleClose = () => {
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



    useEffect(() => {
        if (open) {

        }
    }, [open])


    return (
        <div>
            <Drawer
                anchor={anchor}
                open={open}
                onClose={handleDrawerClose}
            >
                <Grid width={650}>
                    <Grid p={1} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <a style={{ fontWeight: 500, fontSize: '19px' }}>Add Task</a>
                        <IconButton
                            onClick={() => setOpen(false)}
                        >
                            <Close />
                        </IconButton>
                    </Grid>
                    <hr />
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
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
                            </Grid>

                            <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                <Grid item md={4}>
                                    <Typography sx={{ fontWeight: '500' }}>Title</Typography>
                                </Grid>
                                <Grid item md={8}>
                                    <TextInput control={control} name="title"
                                        value={watch('title')} />
                                </Grid>
                            </Grid>

                            {/* date */}
                            <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                <Grid item md={4}>
                                    <Typography sx={{ fontWeight: '500' }}>Due Date</Typography>
                                </Grid>
                                <Grid item md={8}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateInput
                                            control={control}
                                            label='Due Date'
                                            name="date"
                                            value={watch('date')}
                                        />
                                    </LocalizationProvider>

                                </Grid>
                            </Grid>

                            {/* assigned to */}
                            <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                <Grid item md={4}>
                                    <Typography sx={{ fontWeight: '500' }}>Assigned To</Typography>
                                </Grid>
                                <Grid item md={8}>
                                    <SelectX
                                        options={fetchUser}
                                        control={control}
                                        // error={errors?.assigned_to?.id ? errors?.assigned_to?.message : false}
                                        // error2={errors?.assigned_to?.message ? errors?.assigned_to?.message : false}
                                        name={'assigned_to'}
                                        defaultValue={watch('assigned_to')}
                                    />
                                </Grid>
                            </Grid>

                            <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                <Grid item md={4}>
                                    <Typography sx={{ fontWeight: '500' }}>Reviewer</Typography>
                                </Grid>
                                <Grid item md={8}>
                                    <SelectX
                                        options={fetchUser}
                                        control={control}
                                        // error={errors?.assigned_to?.id ? errors?.assigned_to?.message : false}
                                        // error2={errors?.assigned_to?.message ? errors?.assigned_to?.message : false}
                                        name={'reviewer'}
                                        defaultValue={watch('reviewer')}
                                    />
                                </Grid>
                            </Grid>

                            <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                <Grid item md={4}>
                                    <Typography sx={{ fontWeight: '500' }}>Priority</Typography>
                                </Grid>
                                <Grid item md={8}>
                                    {priority.map(obj => {
                                        return <DynamicChip key={obj.name} name={obj.name} id={obj.name} active={selectedPriority} onChipCLick={handlePriorityChange} />
                                    })}
                                </Grid>
                            </Grid>

                            <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                <Grid item md={4}>
                                    <Typography sx={{ fontWeight: '500' }}>Description</Typography>
                                </Grid>
                                <Grid item md={8}>
                                    <TextField
                                        {...register('description')}
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        sx={{ width: '100%', }}
                                    />
                                    {/* <Editor emoji={false} val={watch('description')}
                                        onValueChange={e => setValue('description', e)}
                                    /> */}
                                </Grid>
                            </Grid>

                            <Grid p={1} pb={3} display={'flex'} justifyContent={'end'}>
                                <Button size='small' sx={{ textTransform: 'none', mr: 2 }} variant='outlined'>Cancel</Button>
                                <Button size='small' type='submit' sx={{ textTransform: 'none', height: 30 }} variant='contained'>Save</Button>
                            </Grid>

                        </form>
                    </div>
                </Grid>
            </Drawer>
        </div>
    );
}
