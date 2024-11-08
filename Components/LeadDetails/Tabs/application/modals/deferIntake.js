import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, IconButton, Skeleton, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Close, Refresh } from '@mui/icons-material';
import { ListingApi } from '@/data/Endpoints/Listing';
import SelectX from '@/Form/SelectX';
import { useState } from 'react';
import AsyncSelect from "react-select/async";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab';
import LoadingEdit from '@/Components/Common/Loading/LoadingEdit';
import toast from 'react-hot-toast';
import { LeadApi } from '@/data/Endpoints/Lead';
import ReactSelector from 'react-select';
import { ApplicationApi } from '@/data/Endpoints/Application';
import TextInput from '@/Form/TextInput';
import DateInput from '@/Form/DateInput';
import moment from 'moment';


const scheme = yup.object().shape({
    // intake: yup.string().required("Intake is Required"),
    // date: yup.string().required("Deposit Paid Date is Required"),
    // phone: yup.string().required("Phone Number is Required"),
    // dob: yup.string().required("Date Of Birth is Required"),
    // zip: yup.string().required("Zip Code is Required"),
    intake: yup.object().required("Please Choose an Intake").typeError("Please choose an Intake"),
    // state: yup.string().required("State is Required"),
})

export default function DeferIntake({ details, editId, setEditId, refresh, setRefresh }) {


    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const [dataLoading, setDataLoading] = useState(false)

    const fetchIntakes = (e) => {
        return ListingApi.intakes({ keyword: e }).then(response => {
            // console.log(response);
            if (response.status == 200 || response?.status == 2001) {
                return response.data.data;
            } else {
                return [];
            }
        })
    }

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

        let dataToSubmit = {
            id: details?.id,
            intake_id: data?.intake?.id,
            note: data?.note
            // substage_id: data?.substage?.id,
        }

        console.log(dataToSubmit);


        let action;

        action = ApplicationApi.deferIntake(dataToSubmit)

        action.then((response) => {
            console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                toast.success(response?.data?.message)
                reset()
                handleClose()
                setRefresh(!refresh)
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
        setValue('intake', '')
        setValue('note', '')
        setOpen(false)
        setLoading(false)
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


    const setInitialValue = () => {
        // console.log(details)
        setValue('intake', details?.intake)
        setValue('note', details?.differ_intake_note)
    }

    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
            setInitialValue()
        } else if (editId == 0) {
            setOpen(true)
            setInitialValue()
        }
    }, [editId])


    return (
        <div>
            <Drawer
                anchor={anchor}
                open={open}
                onClose={handleClose}
            >
                <Grid width={550}>
                    <Grid className='modal_title d-flex align-items-center'>

                        <a className='back_modal' onClick={handleClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                                <path d="M21.9582 15.5H9.0415M9.0415 15.5L14.2082 20.6666M9.0415 15.5L14.2082 10.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>

                        <a className='back_modal_head'> Defer Intake </a>

                    </Grid>
                    <hr />
                    <div className='form-data-cntr'>

                        <form onSubmit={handleSubmit(onSubmit)}>

                            {
                                dataLoading ?
                                    <LoadingEdit item={items} />
                                    :
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                                            <div className='application-input'>
                                                <a className='form-text'>Intake</a>
                                                <Grid className='mb-5 forms-data' >
                                                    <AsyncSelect
                                                        // placeholder='Intake'
                                                        // isDisabled={!selectedUniversityId}
                                                        // key={selectedUniversityId}
                                                        name={'intake'}
                                                        defaultValue={watch('intake')}
                                                        // isClearable
                                                        defaultOptions
                                                        loadOptions={fetchIntakes}
                                                        getOptionLabel={(e) => e.name}
                                                        getOptionValue={(e) => e.id}
                                                        onChange={(e) => setValue('intake', e)}
                                                    />
                                                    {errors.intake && <span className='form-validation'>{errors.intake.message}</span>}

                                                </Grid>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                                            <div className='application-input'>
                                                <a className='form-text'>Note</a>
                                                <Grid className='mb-5 forms-data' >
                                                    <TextField
                                                        // placeholder='Note'
                                                        {...register('note')}
                                                        variant="outlined"
                                                        fullWidth
                                                        multiline
                                                        rows={2}
                                                        sx={{ width: '100%', }}
                                                    />
                                                    {errors.note && <span className='form-validation'>{errors.note.message}</span>}
                                                </Grid>
                                            </div>
                                        </div>

                                    </>
                            }

                            <Grid p={1} pb={3} display={'flex'} >
                                <LoadingButton className='save-btn' loading={loading || dataLoading} disabled={loading} type='submit'  >
                                    {
                                        loading ?
                                            <Grid display={'flex'} justifyContent={'center'}><div className="spinner"></div></Grid>
                                            :
                                            <>
                                                Save <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                                                    <path d="M7.875 13.5H19.125M19.125 13.5L14.625 9M19.125 13.5L14.625 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </>
                                    }
                                </LoadingButton>
                                <Button className='cancel-btn' onClick={handleClose}>Cancel <svg svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 9L11.9999 11.9999M11.9999 11.9999L14.9999 14.9999M11.9999 11.9999L9 14.9999M11.9999 11.9999L14.9999 9M4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4801 4 18.9079 4.21799C19.2842 4.40973 19.5905 4.71547 19.7822 5.0918C20.0002 5.51962 20.0002 6.07967 20.0002 7.19978V16.7998C20.0002 17.9199 20.0002 18.48 19.7822 18.9078C19.5905 19.2841 19.2842 19.5905 18.9079 19.7822C18.4805 20 17.9215 20 16.8036 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg></Button>
                            </Grid>

                        </form>
                    </div>
                </Grid>
            </Drawer>
        </div >
    );
}
