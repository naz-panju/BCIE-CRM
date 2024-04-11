
import TextInput from '@/Form/TextInput'
import { Button, Grid, TextField, Typography,IconButton, } from '@mui/material'
import React, { useEffect, useState } from 'react'
import 'react-phone-input-2/lib/style.css'
import PhoneInput from 'react-phone-input-2'
import toast from 'react-hot-toast'
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab'
import LoadingEdit from '@/Components/Common/Loading/LoadingEdit'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';


import axios from 'axios'
import { EventRegistrationApi } from '@/data/Endpoints/EventRegistration'
import { Close } from '@mui/icons-material'

const scheme = yup.object().shape({
    name: yup.string().required("Name is Required"),
    email: yup.string().email("Invalid email format").required("Email is Required"),
    // phone: yup.string().required('Phone Number is Required'),
})


function EventRegistrationModal({ id, editId, setEditId, handleRefresh, eventId }) {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 550,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
    };
    

    // console.log(data);

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })

    // const [eventId, setEventId] = useState()
    const [loading, setLoading] = useState(false)
    const [dataLoading, setDataLoading] = useState(false)
    const [code, setcode] = useState()
    const [open, setOpen] = useState(false)


    const handlePhoneNumber = (value, country) => {
        if (!value) {
            setValue('phone', '')
            return;
        }
        else {
            setValue('phone', value)
            setcode(country?.dialCode)
            return;
        }
    };

    const handleClose = () => {
        setValue('template', '')
        setValue('title', '')
        // setDetails()
        setValue('remarks', '')
        setEditId()
        setOpen(false);
    }



    const onSubmit = async (data) => {

        setLoading(true)

        let dataToSubmit = {
            event_id: eventId,
            name: watch('name'),
            email: watch('email'),
            phone_number: watch('phone'),
        }


        EventRegistrationApi.add(dataToSubmit).then((response) => {
            // console.log(response);
            if (response?.data?.data) {
                toast.success('Registered Successfully')
                setValue('phone', `+${code}`)
                reset()
                handleRefresh()
                setLoading(false)
            } else {
                toast.error(response?.response?.data?.message)
                setLoading(false)
            }
        }).catch((error) => {
            console.log(error);
            toast.error(error?.response?.data?.message)
            setLoading(false)
        })

    }

    const getDetails = async () => {
        // setDataLoading(true)
        // const response = await LeadApi.viewDocuments({ id: editId })
        // if (response?.data?.data) {
        //     let data = response?.data?.data
        //     console.log(data);
        //     setDetails(data)
        //     setValue('template', data?.document_template)
        //     console.log(data);
        //     console.log(data);
        //     setValue('title', data?.title)
        //     setValue('remarks', data?.note || '')
        // }
        // setDataLoading(false)
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
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            BackdropProps={{
                onClick: null, // Prevent closing when clicking outside
            }}
        >
            <Box sx={style}>
                <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {editId > 0 ? 'Register' : 'Edit Registration'}
                    </Typography>
                    <IconButton
                        onClick={handleClose}
                    >
                        <Close />
                    </IconButton>
                </Grid>
                <Grid  display={'flex'}  flexDirection={'column'} justifyContent={'center'} >

                    {/* <Typography>{data?.name}</Typography> */}
                    <form  >
                        <Grid display={'flex'} alignItems={'center'} p={1.5} container  item xs={12}>
                            <Grid item xs={12} md={5}>
                                <Typography sx={{ fontWeight: '500' }}>Name</Typography>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <TextInput control={control} {...register('name', { required: 'The Name field is required' })}
                                    value={watch('name')} />
                                {errors.name && <span className='form-validation'>{errors.name.message}</span>}
                            </Grid>
                        </Grid>

                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                            <Grid item xs={12} md={5}>
                                <Typography sx={{ fontWeight: '500' }}>Email Address</Typography>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <TextInput control={control} {...register('email', {
                                    required: 'Please enter your email',
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: 'Please enter valid email address',
                                    },
                                })}
                                    value={watch('email')} />
                                {errors.email && <span className='form-validation'>{errors.email.message}</span>}

                            </Grid>
                        </Grid>

                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                            <Grid item xs={12} md={5}>
                                <Typography sx={{ fontWeight: '500' }}>Mobile Number</Typography>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                {/* <TextInput control={control} name="mobile"
                                value={watch('mobile')} /> */}

                                <PhoneInput
                                    {...register('phone', { required: 'Please enter your mobile number' })}
                                    international
                                    // autoFormat
                                    placeholder="Enter your number"
                                    country="in"
                                    value={watch('phone')}
                                    onChange={handlePhoneNumber}
                                    inputprops={{
                                        autoFocus: true,
                                        autoComplete: 'off',
                                        // name: 'phone',
                                        required: true,
                                    }}
                                    inputstyle={{
                                        width: '100%',
                                        height: '40px',
                                        paddingLeft: '40px', // Adjust the padding to make space for the country symbol
                                    }}
                                    buttonstyle={{
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        marginLeft: '5px',
                                    }}
                                />
                                {errors.phone && <span className='form-validation'>{errors.phone.message}</span>}

                            </Grid>
                        </Grid>

                        <Grid p={1} pb={3} display={'flex'} justifyContent={'end'}>
                            <LoadingButton loading={loading} disabled={loading} size='small' type='submit' onClick={onSubmit} sx={{ textTransform: 'none', height: 30 }} variant='contained'>Submit</LoadingButton>
                        </Grid>
                    </form>

                </Grid >
            </Box>
        </Modal >
    )
}

export default EventRegistrationModal


