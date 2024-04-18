import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, IconButton, Skeleton, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Close, Refresh, ThumbUpOffAlt } from '@mui/icons-material';
import { ListingApi } from '@/data/Endpoints/Listing';
import { useState } from 'react';

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton, } from '@mui/lab';
import LoadingEdit from '@/Components/Common/Loading/LoadingEdit';
import AsyncSelect from "react-select/async";
import { ApplicationApi } from '@/data/Endpoints/Application';
import toast from 'react-hot-toast';
import TextInput from '@/Form/TextInput';
import DateInput from '@/Form/DateInput';
import moment from 'moment';
import { FollowupApi } from '@/data/Endpoints/Followup';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import CachedIcon from '@mui/icons-material/Cached';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import TimelineOppositeContent, {
    timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';

const scheme = yup.object().shape({
    assigned_to: yup.object().required("Please Choose an User").typeError("Please choose an User"),
    date: yup.string().required('Date field is Required')
    // university: yup.object().required("Please Choose an University").typeError("Please choose an University"),
    // course: yup.object().required("Please Choose a Course").typeError("Please choose a Course"),
    // intake: yup.object().required("Please Choose an Intake").typeError("Please choose an Intake"),

})

export default function FollowUpModal({ lead_id, editId, setEditId, refresh, setRefresh, from, app_id, data }) {
    const [state, setState] = React.useState({
        right: false,
    });
    const [selectedPriority, setSelectedPriority] = useState('Medium');
    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const [laoding, setLaoding] = useState(false)


    const [list, setList] = useState([])
    const [limit, setLimit] = useState(50)

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

        let dataToSubmit = {
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


    const getData = async () => {
        setLaoding(true)
        let params = {
            id: lead_id,
            limit
        }
        if (from == 'app') {
            params['application_id'] = app_id
        }
        const response = await FollowupApi.list(params)
        setList(response?.data)
        // setTotal(response?.data?.meta?.total)
        setLaoding(false)
    }

    console.log(list);

    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
        } else if (editId == 0) {
            setOpen(true)
        }
        getData()
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

                    <hr />

                    {
                        list?.data?.length > 0 ?
                            <Timeline sx={{ [`& .${timelineOppositeContentClasses.root}`]: { flex: 0.2, }, }}>
                                {
                                    list?.data?.map((obj, index) => (
                                       
                                        <TimelineItem key={index} className='TimelineItemClass'>
                                            <TimelineOppositeContent className='TimelineOppositeContent' color="text.secondary">
                                                {moment(obj?.created_at).format('DD MMM YYYY hh:mm A')}
                                            </TimelineOppositeContent>
                                            <TimelineSeparator>
                                                <ThumbUpOffAlt className='timelineIcon' />
                                                <TimelineConnector />
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <div className='timeline-content-content'>
                                                    <Grid display={'flex'}>
                                                        <p><b>Follow Up</b> -</p> <p> with {data?.name?.toUpperCase()}</p>
                                                    </Grid>
                                                    <Grid display={'flex'}>
                                                        <p><b>Assigned To</b>: </p>
                                                        <p> {obj?.assigned_to_user?.name}</p>
                                                        <p> | <b>Due</b> </p>
                                                        <p>: </p>
                                                        <p> {moment(obj?.follow_up_date).format('DD MMM hh:mm A')}</p>
                                                    </Grid>
                                                    <Grid display={'flex'}>
                                                        <p><b>Created By</b>: </p>
                                                        <p> {obj?.created_by?.name}</p>
                                                        <p> | <b>Status</b> </p>
                                                        <p>:  </p>
                                                        <p> {obj?.status}
                                                            {/* {obj?.status !== 'Completed' && <React.Fragment> | <Button onClick={() => handleConfirmOpen(obj?.id)} sx={{ textTransform: 'none' }} variant='contained' className='h-4 text-black hover:bg-lime-600 hover:text-white' size='small'>Mark as Completed</Button></React.Fragment>} */}
                                                        </p>
                                                    </Grid>
                                                    {
                                                        obj?.note &&
                                                        <Grid display={'flex'}>
                                                            <p><b>Note</b>: </p>
                                                            <p> {obj?.note}</p>
                                                        </Grid>
                                                    }
                                                </div>


                                            </TimelineContent>
                                        </TimelineItem>
                                    ))
                                }

                            </Timeline>
                            :
                            <div className='no-follw-up-block'>
                                <h4>No Follow-up Found</h4>
                            </div>
                    }

                  
                </Grid>
            </Drawer>
        </div >
    );
}
