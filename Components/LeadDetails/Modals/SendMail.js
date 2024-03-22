import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, IconButton, Skeleton, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Close, Refresh } from '@mui/icons-material';
import { ListingApi } from '@/data/Endpoints/Listing';
import DateInput from '@/Form/DateInput';
import SelectX from '@/Form/SelectX';
import TextInput from '@/Form/TextInput';
import { useState } from 'react';

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab';
import LoadingEdit from '@/Components/Common/Loading/LoadingEdit';
import AsyncSelect from "react-select/async";
import moment from 'moment';
import { StudentApi } from '@/data/Endpoints/Student';
import toast from 'react-hot-toast';
import { TemplateApi } from '@/data/Endpoints/Template';
import dynamic from 'next/dynamic';
import { LeadApi } from '@/data/Endpoints/Lead';


const MyEditor = dynamic(() => import("../../../Form/MyEditor"), {
    ssr: false,
});


const scheme = yup.object().shape({
    subject: yup.string().required("Subject is Required"),
    body: yup.string().required("Body is Required"),
    default_cc: yup.string().required("Mail CC is Required"),
    // dob: yup.string().required("Date Of Birth is Required"),
    // zip: yup.string().required("Zip Code is Required"),
    // country: yup.object().required("Please Choose a Country").typeError("Please choose a Country"),
    // state: yup.string().required("State is Required"),
})

export default function SendMail({ details, editId, setEditId, refresh, setRefresh }) {
    const [state, setState] = React.useState({
        right: false,
    });
    const [selectedPriority, setSelectedPriority] = useState('Medium');
    const [open, setOpen] = useState(false)

    const [altPhone, setAltPhone] = useState()
    const [altCode, setAltCode] = useState()

    const [whatsapp, setWhatsapp] = useState()
    const [whatsappCode, setWhatsappCode] = useState()

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




    const fetchTemplates = (e) => {
        return TemplateApi.list({ keyword: e }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }




    const onSubmit = async (data) => {

        setLoading(true)
        const formData = new FormData()

        formData.append('to', data?.to)
        formData.append('cc', data?.default_cc)
        formData.append('subject', data?.subject || '')
        formData.append('body', data?.body || '')
        formData.append('lead_id', details?.id || '')
        
        // console.log(dataToSubmit);

        let action;

        if (editId > 0) {
            // dataToSubmit['id'] = editId
            // action = TaskApi.update(dataToSubmit)
        } else {
            action = LeadApi.sendMail(formData)
        }

        action.then((response) => {
            // console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                toast.success('Email Sent Successfully');
                reset()
                handleClose()
                // setRefresh(!refresh)
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
        // reset()
        setValue('template', '')
        setValue('default_cc', '')
        setValue('subject', '')
        setValue('to', '')
        setValue('body', '')
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


    const handleTemplateChange = (data) => {
        // console.log(data);.
        setValue('template', data || '')
        setValue('default_cc', data?.default_cc || '')
        // setValue('to', details?.email || '')
        setValue('subject', data?.subject || '')
        setValue('body', data?.body || '')
    }


   const getInitialValue = () => {
        setValue('to', details?.email)
    }

    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
        } else if (editId == 0) {
            setOpen(true)
        }
        getInitialValue()
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
                        <a style={{ fontWeight: 500, fontSize: '19px' }}>Send Mail</a>
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
                                            <Grid item pr={1} xs={3} md={3}>
                                                <a className='form-text'>Select Template</a>
                                            </Grid>
                                            <Grid item pr={1} xs={9} md={9}>
                                                <AsyncSelect
                                                    // isDisabled={!selectedUniversityId}
                                                    // key={selectedUniversityId}
                                                    name={'template'}
                                                    defaultValue={watch('template')}
                                                    // isClearable
                                                    defaultOptions
                                                    loadOptions={fetchTemplates}
                                                    getOptionLabel={(e) => e.name}
                                                    getOptionValue={(e) => e.id}
                                                    onChange={handleTemplateChange}
                                                />
                                                {/* <SelectX
                                                    // menuPlacement='top'
                                                    loadOptions={fetchTemplates}
                                                    control={control}
                                                    name={'template'}
                                                    defaultValue={watch('template')}
                                                /> */}
                                                {errors.template && <span className='form-validation'>{errors.template.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid p={1} container >
                                            <Grid item pr={1} xs={3} md={3}>
                                                <a className='form-text'>Mail To </a>
                                            </Grid>
                                            <Grid item pr={1} xs={9} md={9}>
                                                <TextInput disabled control={control} name="to"
                                                    value={watch('to')} />
                                                {errors.to && <span className='form-validation'>{errors.to.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid p={1} container >
                                            <Grid item pr={1} xs={3} md={3}>
                                                <a className='form-text'>Mail CC </a>
                                            </Grid>
                                            <Grid item pr={1} xs={9} md={9}>
                                                <TextInput control={control} name="default_cc"
                                                    value={watch('default_cc')} />
                                                {errors.default_cc && <span className='form-validation'>{errors.default_cc.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid p={1} container >
                                            <Grid item pr={1} xs={3} md={3}>
                                                <a className='form-text'>Subject </a>
                                            </Grid>
                                            <Grid item pr={1} xs={9} md={9}>
                                                <TextInput control={control} name="subject"
                                                    value={watch('subject')} />
                                                {errors.subject && <span className='form-validation'>{errors.subject.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid display={'flex'} container p={1.5} item xs={12}>
                                            <Grid item display={'flex'} xs={3} md={3}>
                                                <Typography sx={{ fontWeight: '500' }}>Body</Typography>
                                            </Grid>
                                            <Grid item xs={9} md={9}>
                                                <MyEditor name={'body'} onValueChange={e => setValue('body', e)} value={watch('body')} />
                                            </Grid>
                                        </Grid>



                                    </>
                            }

                            <Grid p={1} pb={3} display={'flex'} justifyContent={'end'}>
                                <Button onClick={handleClose} size='small' sx={{ textTransform: 'none', mr: 2 }} variant='outlined'>Cancel</Button>
                                <LoadingButton loading={loading} disabled={loading || dataLoading} size='small' type='submit' sx={{ textTransform: 'none', height: 30 }} variant='contained'>Send</LoadingButton>
                            </Grid>

                        </form>
                    </div>
                </Grid>
            </Drawer>
        </div >
    );
}
