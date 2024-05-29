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
        // let date = ''
        // if (data?.date) {
        //     date = moment(data?.date).format('YYYY-MM-DD')
        // }

        let dataToSubmit = {
            id: details.id,
            intake_id: data?.intake?.id,
            note: data?.note
            // substage_id: data?.substage?.id,
        }


        let action;

        action = ApplicationApi.deferIntake(dataToSubmit)

        // if (editId > 0) {
        //     // dataToSubmit['id'] = editId
        //     // action = TaskApi.update(dataToSubmit)
        // } else {
        //     action = ApplicationApi.addDeposit(dataToSubmit)
        // }

        action.then((response) => {
            // console.log(response);
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
                                <path d="M21.9582 15.5H9.0415M9.0415 15.5L14.2082 20.6666M9.0415 15.5L14.2082 10.3333" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
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
                                        <Grid className='form_group' >
                                            <AsyncSelect
                                                placeholder='Intake'
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

                                        <Grid className='form_group' >
                                            <TextField
                                                placeholder='Note'
                                                {...register('note')}
                                                variant="outlined"
                                                fullWidth
                                                multiline
                                                rows={2}
                                                sx={{ width: '100%', }}
                                            />
                                            {errors.note && <span className='form-validation'>{errors.note.message}</span>}
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
