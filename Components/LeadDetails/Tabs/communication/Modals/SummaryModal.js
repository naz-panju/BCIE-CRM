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
                handleRefresh()
                reset()
                handleClose()
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
                onClose={handleClose}
            >
                <Grid width={650}>
                    <Grid className='modal_title d-flex align-items-center  '>
                        <a className='back_modal' onClick={handleClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                                <path d="M21.9582 15.5H9.0415M9.0415 15.5L14.2082 20.6666M9.0415 15.5L14.2082 10.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                            </svg>
                        </a>
                        <a className='back_modal_head'>{editId == 0 ? 'Add Phone Call Summary' : 'Edit Phone Call Summary'}</a>

                    </Grid>
                    <hr />
                    <div className='form-data-cntr'>

                        <form onSubmit={handleSubmit(onSubmit)}>

                            {
                                dataLoading ?
                                    <LoadingEdit item={items} />
                                    :
                                    <>

                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-0">
                                            <div className='application-input'>
                                                <a className='form-text'>Type</a>

                                                <Grid className='mb-5 forms-data'>
                                                    <ReactSelector
                                                        // placeholder={'Type'}
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
                                            </div>




                                            <div className='application-input'>
                                                <a className='form-text'>Date and Time</a>

                                                <Grid className='mb-5 forms-data  '>
                                                    <DateTime
                                                        // placeholder='Date and Time'
                                                        control={control}
                                                        name="date_and_time"
                                                        value={watch('date_and_time')}

                                                    />
                                                    {errors.date_and_time && <span className='form-validation'>{errors.date_and_time.message}</span>}
                                                </Grid>
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                                            <div className='application-input'>
                                                <a className='form-text'>Call Summary</a>

                                                {/* frm-text-conn-stl */}
                                                <Grid className='mb-5 forms-data'>
                                                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V12M9 15V12.5L17.75 3.75C18.4404 3.05964 19.5596 3.05964 20.25 3.75V3.75C20.9404 4.44036 20.9404 5.55964 20.25 6.25L15.5 11L11.5 15H9Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round"></path></svg> */}


                                                    <TextField
                                                        // placeholder='Call Summary'
                                                        {...register('summary')}
                                                        variant="outlined"
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        sx={{ width: '100%', }}
                                                    />
                                                    {errors.summary && <span className='form-validation'>{errors.summary.message}</span>}

                                                </Grid>
                                            </div>
                                        </div>


                                    </>
                            }

                            <Grid pb={3} display={'flex'} >
                                <LoadingButton className='save-btn' disabled={loading || dataLoading} size='small' type='submit' sx={{ textTransform: 'none', height: 30 }} variant='contained'> {
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
        </div >
    );
}
