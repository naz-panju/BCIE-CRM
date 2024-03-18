import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Checkbox, Grid, IconButton, Skeleton, TextField, Typography } from '@mui/material';
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
import { TemplateApi } from '@/data/Endpoints/Template';

const scheme = yup.object().shape({

})

export default function CreateEmailTemplate({ editId, setEditId, refresh, setRefresh, lead_id, handleRefresh }) {
    const [state, setState] = React.useState({
        right: false,
    });
    const [selectedPriority, setSelectedPriority] = useState('Medium');
    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const [dataLoading, setDataLoading] = useState(false)

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
        // Add any additional logic here if needed
    };

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
        let dueDate = ''
        if (data?.date) {
            dueDate = moment(data?.date).format('YYYY-MM-DD')
        }

        let dataToSubmit = {
            // lead_id: data?.lead?.id,
            name: data?.name,
            subject: data?.subject,
            body: data?.body,
            body_footer: data?.body_footer,
            default_cc: data?.default_cc,
        }

        console.log(dataToSubmit);

        if (lead_id) {
            dataToSubmit['lead_id'] = lead_id
        }


        let action;

        if (editId > 0) {
            dataToSubmit['id'] = editId
            // action = TemplateApi.update(dataToSubmit)
        } else {
            action = TemplateApi.add(dataToSubmit)
        }

        action.then((response) => {
            if (response?.data) {
                toast.success(editId > 0 ? 'Email Template Has Been Successfully Updated' : 'Email Template Has Been Successfully Created')
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

                            {
                                dataLoading ?
                                    <LoadingEdit item={items} />
                                    :
                                    <>
                                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={4}>
                                                <Typography sx={{ fontWeight: '500' }}>Template Name</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <TextInput control={control} name="name"
                                                    value={watch('name')} />
                                                {errors.name && <span className='form-validation'>{errors.name.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={4}>
                                                <Typography sx={{ fontWeight: '500' }}> Subject</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <TextInput control={control} name="subject"
                                                    value={watch('subject')} />
                                                {errors.subject && <span className='form-validation'>{errors.subject.message}</span>}
                                            </Grid>
                                        </Grid>


                                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={4}>
                                                <Typography sx={{ fontWeight: '500' }}>Body</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <TextField
                                                    {...register('body')}
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    sx={{ width: '100%', }}
                                                />
                                                {errors.body && <span className='form-validation'>{errors.body.message}</span>}

                                                {/* <Editor emoji={false} val={watch('description')}
                                            onValueChange={e => setValue('description', e)}
                                        /> */}
                                            </Grid>
                                        </Grid>

                                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={4}>
                                                <Typography sx={{ fontWeight: '500' }}> Body Footer</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <TextInput control={control} name="body_footer"
                                                    value={watch('body_footer')} />
                                                {errors.body_footer && <span className='form-validation'>{errors.body_footer.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={4}>
                                                <Typography sx={{ fontWeight: '500' }}> Default CC</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <TextInput control={control} name="default_cc"
                                                    value={watch('default_cc')} />
                                                {errors.default_cc && <span className='form-validation'>{errors.default_cc.message}</span>}
                                            </Grid>
                                        </Grid>


                                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={4}>
                                                <Typography sx={{ fontWeight: '500' }}>Is Public Template</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
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
