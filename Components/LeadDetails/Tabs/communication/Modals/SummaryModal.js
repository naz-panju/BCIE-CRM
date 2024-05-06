import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, IconButton, Skeleton, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Close, Refresh } from '@mui/icons-material';
import DateInput from '@/Form/DateInput';

import { useState } from 'react';
import ReactSelector from 'react-select';

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab';
import LoadingEdit from '@/Components/Common/Loading/LoadingEdit';
import moment from 'moment';
import { StudentApi } from '@/data/Endpoints/Student';
import toast from 'react-hot-toast';
import DateTime from '@/Form/DateTime';
import { PhoneCallApi } from '@/data/Endpoints/PhoneCall';

const scheme = yup.object().shape({
    summary: yup.string().required("Call Summary is Required"),
    date_and_time: yup.string().required("Date and Time is Required"),
    // zip: yup.string().required("Zip Code is Required"),
    // state: yup.string().required("State is Required"),
})

export default function PhoneCallModal({ lead_id, editId, setEditId, handleRefresh }) {
    const [state, setState] = React.useState({
        right: false,
    });
    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const [dataLoading, setDataLoading] = useState(false)

    const [currentTitle, setcurrentTitle] = useState()

    const items = [
        { label: 'Title' },
        { label: 'Due Date' },
        { label: 'Description', multi: true },
    ]

    const anchor = 'right'; // Set anchor to 'right'

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })

    const searchOptions = [
        { name: 'Inbound' },
        { name: 'Outbound' },
    ]


    const onSubmit = async (data) => {
        console.log(data);

        setLoading(true)
        let date_and_time = ''
        if (data?.date_and_time) {
            date_and_time = moment(data?.date_and_time).format('YYYY-MM-DD HH:mm:ss')
        }

        let dataToSubmit = {
            lead_id: lead_id,
            type: data?.type,
            date_time_of_call: date_and_time,
            call_summary: data?.summary,
        }

        console.log(dataToSubmit);

        let action;

        if (editId > 0) {
            dataToSubmit['id'] = editId
            action = PhoneCallApi.update(dataToSubmit)
        } else {
            action = PhoneCallApi.add(dataToSubmit)
        }

        action.then((response) => {
            console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                toast.success(`Phone Call Summary Has Been Successfully ${editId > 0 ? 'Updated' : 'Created'} `)
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
            toast.error(error?.message)
            setLoading(false)
        })
    }


    const handleClose = () => {
        setEditId()
        reset()
        setValue('date_and_time', '')
        setValue('summary', '')
        setValue('type', '')
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
        const response = await PhoneCallApi.view({ id: editId })
        if (response?.data?.data) {
            let data = response?.data?.data
            setValue('type', data?.type)
            setValue('date_and_time', data?.date_time_of_call)
            setValue('summary', data?.call_summary)
        }
        setDataLoading(false)
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
                        <a style={{ fontWeight: 500, fontSize: '19px' }}>{editId == 0 ? 'Add Phone Call Summary' : 'Edit Phone Call Summary'}</a>
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
                                            <Grid item pr={1} xs={4} md={4}>
                                                <a className='form-text'>Type </a>
                                            </Grid>
                                            <Grid item pr={1} xs={8} md={8}>
                                                <ReactSelector
                                                    onInputChange={searchOptions}
                                                    styles={{
                                                        menu: provided => ({ ...provided, zIndex: 9999 })
                                                    }}
                                                    options={searchOptions}
                                                    getOptionLabel={option => option.name}
                                                    getOptionValue={option => option.name}
                                                    value={
                                                        searchOptions.find(options =>
                                                            options.name === watch('type')
                                                        )
                                                    }
                                                    name='type'

                                                    defaultValue={(watch('type'))}
                                                    onChange={(selectedOption) => setValue('type', selectedOption?.name)}
                                                />
                                                {errors.type && <span className='form-validation'>{errors.type.message}</span>}
                                            </Grid>
                                        </Grid>



                                        <Grid p={1} container >
                                            <Grid item pr={1} xs={4} md={4}>
                                                <a className='form-text'>Date and Time </a>
                                            </Grid>
                                            <Grid item pr={1} xs={8} md={8}>
                                                <DateTime
                                                    control={control}
                                                    name="date_and_time"
                                                    value={watch('date_and_time')}
                                                />
                                                {errors.date_and_time && <span className='form-validation'>{errors.date_and_time.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid p={1} container >
                                            <Grid item pr={1} xs={4} md={4}>
                                                <a className='form-text'> Call Summary </a>
                                            </Grid>
                                            <Grid item pr={1} xs={8} md={8}>
                                                <TextField
                                                    {...register('summary')}
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    sx={{ width: '100%', }}
                                                />
                                                {errors.summary && <span className='form-validation'>{errors.summary.message}</span>}
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
