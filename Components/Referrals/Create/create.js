import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, IconButton, TextField, Tooltip } from '@mui/material';
import { useEffect } from 'react';
import { Close, Delete, } from '@mui/icons-material';
import { ListingApi } from '@/data/Endpoints/Listing';
import TextInput from '@/Form/TextInput';
import { useState } from 'react';
import moment from 'moment';
import toast from 'react-hot-toast';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab';
import LoadingEdit from '@/Components/Common/Loading/LoadingEdit';
import dynamic from 'next/dynamic';
import AsyncSelect from "react-select/async";
import SelectX from '@/Form/SelectX';
import DateInput from '@/Form/DateInput';
import { ReferralApi } from '@/data/Endpoints/Referrals';


// import MyEditor from '@/Form/MyEditor';

const MyEditor = dynamic(() => import("../../../Form/MyEditor"), {
    ssr: false,
});

const scheme = yup.object().shape({
    source: yup.object().required("Lead Source is Required"),
})

export default function CreateReferral({ editId, setEditId, refresh, setRefresh, lead_id, handleRefresh }) {

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })

    const [state, setState] = React.useState({
        right: false,
    });
    const [selectedPriority, setSelectedPriority] = useState('Medium');
    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const [dataLoading, setDataLoading] = useState(false)

    const [attachment, setAttachment] = useState(null);
    const [fileInputKey, setFileInputKey] = useState(0);
    const [details, setdetails] = useState()

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



    const fetchSources = (e) => {
        return ListingApi.leadSource({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data
            } else {
                return [];
            }
        })
    }

    const fetchAgencies = (e) => {
        return ListingApi.agencies({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data
            } else {
                return [];
            }
        })
    }

    const fetchEvents = (e) => {
        return ListingApi.events({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data
            } else {
                return [];
            }
        })
    }


    const handleSourseChange = (data) => {
        // trigger('source')
        setValue('source', data || '')
        setValue('agent', '')
        // setValue('agency', '')
    }


    const items = [
        { label: 'Template Name' },
        { label: 'Subject' },
        { label: 'Body Footer' },
        { label: 'Default CC' },
        { label: 'Body', multi: true },
        { label: 'Body', multi: true },
        { label: 'Body', multi: true },
        // { label: 'Description' },

    ]

    const anchor = 'right'; // Set anchor to 'right'



    const onSubmit = async (data) => {

        setLoading(true)

        let date;
        if (data?.validity_date) {
            date = moment(data?.validity_date).format('YYYY-MM-DD')
        }

        const formData = new FormData();

        formData.append('title', data?.title)
        if (data?.source?.id) {
            formData.append('lead_source_id', data?.source?.id)
        }
        if (data?.agent) {
            formData.append('agency_id', data?.agent?.id)
        }
        if(data?.events){
            formData.append('events_id', data?.events?.id)
        }
        if (data?.validity_date) {
            formData.append('last_date_of_validity', date)
        }
        formData.append('top_description', data?.top_description)
        formData.append('bottom_description', data?.bottom_description)
        formData.append('private_remarks', data?.private_remarks)

        if (attachment) {
            formData.append('image', attachment)
        }

        for (var pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]); // Iterate through form data and log key-value pairs
        }

        let action;

        if (editId > 0) {
            formData.append('id', editId)
            action = ReferralApi.update(formData)
        } else {
            action = ReferralApi.add(formData)
        }

        action.then((response) => {
            console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                toast.success(editId > 0 ? 'Email Template Has Been Successfully Updated' : 'Email Template Has Been Successfully Created')
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
        setValue('title', '')
        setValue('validity_date', '')
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

    function trimUrlAndNumbers(url) {
        const lastSlashIndex = url?.lastIndexOf('/');
        let trimmedString = url?.substring(lastSlashIndex + 1);
        trimmedString = trimmedString?.replace(/[0-9]/g, ''); // Replace all numeric characters with an empty string
        return trimmedString?.replace(/_/g, ''); // Replace all underscores with an empty string
    }


    const getDetails = async () => {
        setDataLoading(true)
        try {
            const response = await ReferralApi.view({ id: editId })
            if (response?.data?.data) {
                let data = response?.data?.data
                // console.log(data);

                setValue('title', data?.title)
                setValue('source', data?.lead_source)
                setValue('validity_date', data?.last_date_of_validity)
                setValue('agent', data?.agency)
                setValue('top_description', data?.top_description)
                setValue('bottom_description', data?.bottom_description)
                setValue('private_remarks', data?.private_remarks)
                setdetails(data)
                setDataLoading(false)
            }
            setDataLoading(false)
        } catch (error) {
            setDataLoading(false)
        }
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

    // console.log(watch('body'));


    return (
        <div>

            <Drawer
                anchor={anchor}
                open={open}
                onClose={handleDrawerClose}
            >
                <Grid width={550}>
                    <Grid p={1} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <a style={{ fontWeight: 500, fontSize: '19px' }}>{editId > 0 ? "Edit Referral Link" : 'Create Referral Link'}</a>
                        <IconButton
                            onClick={handleClose}
                        >
                            <Close />
                        </IconButton>
                    </Grid>
                    <hr />
                    <div>

                        <form className='form-text-purpose' onSubmit={handleSubmit(onSubmit)}>


                            {
                                dataLoading ?
                                    <LoadingEdit item={items} />
                                    :
                                    <>


                                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={3}>
                                                <a sx={{ fontWeight: '500' }}>Title</a>
                                            </Grid>
                                            <Grid item xs={12} md={9}>
                                                <TextInput control={control} name="title"
                                                    value={watch('title')} />
                                                {errors.title && <span className='form-validation'>{errors.title.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={3}>
                                                <a sx={{ fontWeight: '500' }}>Lead Source</a>
                                            </Grid>
                                            <Grid item xs={12} md={9}>
                                                <AsyncSelect
                                                    name={'source'}
                                                    defaultValue={watch('source')}
                                                    isClearable
                                                    defaultOptions
                                                    loadOptions={fetchSources}
                                                    getOptionLabel={(e) => e.name}
                                                    getOptionValue={(e) => e.id}
                                                    onChange={handleSourseChange}
                                                />
                                                {errors?.source && <span className='form-validation'>{errors?.source.message}</span>}
                                            </Grid>

                                        </Grid>

                                        {
                                            watch('source')?.name == 'Agency' &&
                                            <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                                <Grid item xs={12} md={3}>
                                                    <a sx={{ fontWeight: '500' }}>Agent</a>
                                                </Grid>
                                                <Grid item xs={12} md={9}>
                                                    <SelectX
                                                        // menuPlacement='top'
                                                        loadOptions={fetchAgencies}
                                                        control={control}
                                                        // error={errors?.assigned_to?.id ? errors?.assigned_to?.message : false}
                                                        // error2={errors?.assigned_to?.message ? errors?.assigned_to?.message : false}
                                                        name={'agent'}
                                                        defaultValue={watch('agent')}
                                                    />
                                                </Grid>
                                            </Grid>
                                        }

                                        {
                                            watch('source')?.name == 'Events' &&
                                            <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                                <Grid item xs={12} md={3}>
                                                    <a sx={{ fontWeight: '500' }}>Events</a>
                                                </Grid>
                                                <Grid item xs={12} md={9}>
                                                    <SelectX
                                                        // menuPlacement='top'
                                                        loadOptions={fetchEvents}
                                                        control={control}
                                                        // error={errors?.assigned_to?.id ? errors?.assigned_to?.message : false}
                                                        // error2={errors?.assigned_to?.message ? errors?.assigned_to?.message : false}
                                                        name={'events'}
                                                        defaultValue={watch('events')}
                                                    />
                                                </Grid>
                                            </Grid>
                                        }

                                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={3}>
                                                <a sx={{ fontWeight: '500' }}>Last Date of Validity</a>
                                            </Grid>
                                            <Grid item xs={12} md={9}>
                                                <DateInput
                                                    control={control}
                                                    name="validity_date"
                                                    value={watch('validity_date')}
                                                // placeholder='Due Date'
                                                />
                                                {errors.validity_date && <span className='form-validation'>{errors.validity_date.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid display={'flex'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={3}>
                                                <a sx={{ fontWeight: '500' }}>Top Description</a>
                                            </Grid>
                                            <Grid item xs={12} md={9}>
                                                <TextField
                                                    {...register('top_description')}
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    sx={{ width: '100%', }}
                                                />
                                                {errors.top_description && <span className='form-validation'>{errors.top_description.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid display={'flex'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={3}>
                                                <a sx={{ fontWeight: '500' }}>Bottom Description</a>
                                            </Grid>
                                            <Grid item xs={12} md={9}>
                                                <TextField
                                                    {...register('bottom_description')}
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    sx={{ width: '100%', }}
                                                />
                                                {errors.bottom_description && <span className='form-validation'>{errors.bottom_description.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid display={'flex'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={3}>
                                                <a sx={{ fontWeight: '500' }}>Private Remarks</a>
                                            </Grid>
                                            <Grid item xs={12} md={9}>
                                                <TextField
                                                    {...register('private_remarks')}
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    sx={{ width: '100%', }}
                                                />
                                                {errors.private_remarks && <span className='form-validation'>{errors.private_remarks.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid p={1} mt={1} mb={1} display={'flex'} alignItems={'center'} container className='bg-sky-100' height={80} >
                                            <Grid item pr={1} alignItems={'center'} xs={4} md={4}>
                                                <Button
                                                    onClick={handleClick}
                                                    sx={{ textTransform: 'none', height: 30 }}
                                                    variant='contained'
                                                    className='bg-sky-800'
                                                >
                                                    Banner Image
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
                                                (attachment || details?.banner_image) &&
                                                <Grid display={'flex'} justifyContent={'space-between'} item pr={1} xs={8} md={8}>
                                                    {
                                                        !attachment &&
                                                        <Tooltip title={details?.banner_image}>
                                                            <a style={{ textDecoration: 'underLine', color: 'blue' }} href={details?.banner_image} target='_blank' className="text-gray-700">
                                                                {trimUrlAndNumbers(details?.banner_image)}
                                                            </a>
                                                        </Tooltip>
                                                    }
                                                    {
                                                        attachment &&
                                                            attachment?.name?.length > 30 ?
                                                            <Tooltip title={attachment?.name}>
                                                                <p>{attachment?.name?.substring(0, 30) + '...'}</p>
                                                            </Tooltip>
                                                            :
                                                            <p>{attachment?.name}</p>
                                                    }

                                                    {
                                                        attachment &&
                                                        <Delete onClick={handleDelete} fontSize='small' sx={{ color: 'red', cursor: 'pointer' }} />
                                                    }
                                                </Grid>
                                            }
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
