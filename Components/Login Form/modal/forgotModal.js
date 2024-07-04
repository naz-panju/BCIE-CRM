import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, IconButton, Skeleton, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { ListingApi } from '@/data/Endpoints/Listing';
import { useState } from 'react';
import AsyncSelect from "react-select/async";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab';
import LoadingEdit from '@/Components/Common/Loading/LoadingEdit';
import toast from 'react-hot-toast';
import ReactSelector from 'react-select';
import { ApplicationApi } from '@/data/Endpoints/Application';
import TextInput from '@/Form/TextInput';
import { PasswordApi } from '@/data/Endpoints/Password';




export default function ForgotPasswordModal({ editId, setEditId }) {

    const [state, setState] = React.useState({
        right: false,
    });
    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const [otpData, setotpData] = useState(false)


    const anchor = 'right'; // Set anchor to 'right'

    let scheme;

    if (otpData) {
        scheme = yup.object().shape({
            email: yup.string().email("Please enter a valid email address").required("email is a required field"),
            otp: yup.string().required("otp is a required field"),
            new: yup.string().required("new is a required field"),
        });
    } else {
        scheme = yup.object().shape({
            email: yup.string().email("Please enter a valid email address").required("Please enter your email address"),
        });
    }
    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })


    const sendOtp = (data) => {

        setLoading(true)


        let dataToSubmit = {
            email: data?.email,

        }
        PasswordApi.forgot(dataToSubmit).then((response) => {
            // console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                toast.success(response?.data?.message)
                setotpData(true)
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


    const resetPassword = (data) => {
        if (data.confirm === data.new) {

            setLoading(true)

            let dataToSubmit = {
                email: data?.email,
                otp: data?.otp,
                password: data?.new,
                password_confirmation: data?.confirm,
            }
            PasswordApi.reset(dataToSubmit).then((response) => {
                // console.log(response);
                if (response?.status == 200 || response?.status == 201) {
                    toast.success(response?.data?.message)
                    handleClose()
                    setLoading(false)
                    setotpData(false)
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
        } else {
            toast.error('Passwords do not match');
        }
    }


    const onSubmit = async (data) => {


        if (otpData) {
            resetPassword(data)
        } else {
            sendOtp(data)
        }

    }


    const handleClose = () => {
        setEditId()
        reset()
        setValue('email', '')
        setValue('otp', '')
        setValue('new', '')
        setValue('confirm', '')
        setotpData(false)
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
        if (editId > 0) {
            setOpen(true)
        } else if (editId == 0) {
            setOpen(true)
        }
    }, [editId])

    return (

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

                    <a className='back_modal_head'> Forgot Password </a>

                </Grid>
                {/* <hr /> */}
                <div className='form-data-cntr'>
                    <form onSubmit={handleSubmit(onSubmit)}>


                        <>

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                                <div className='application-input'>
                                    <a style={{ fontSize: '14px' }} className='form-text'>Email Address</a>
                                    <TextInput type='text' control={control} name="email"
                                        value={watch('email')} />
                                    {errors.email && <span className='form-validation'>{errors.email.message}</span>}
                                </div>
                            </div>

                            {
                                otpData &&
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0 mt-4">
                                        <div className='application-input'>
                                            <a style={{ fontSize: '14px' }} className='form-text'>OTP</a>
                                            <TextInput type='text' control={control} name="otp"
                                                value={watch('otp')} />
                                            {errors.otp && <span className='form-validation'>{errors.otp.message}</span>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0 mt-4">
                                        <div className='application-input'>
                                            <a style={{ fontSize: '14px' }} className='form-text'>New Password</a>
                                            <TextInput type='text' control={control} name="new"
                                                value={watch('new')} />
                                            {errors.new && <span className='form-validation'>{errors.new.message}</span>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0 mt-4">
                                        <div className='application-input'>
                                            <a style={{ fontSize: '14px' }} className='form-text'>Confirm Password</a>
                                            <TextInput type='text' control={control} name="confirm"
                                                value={watch('confirm')} />
                                            {errors.confirm && <span className='form-validation'>{errors.confirm.message}</span>}
                                        </div>
                                    </div>
                                </>
                            }

                        </>


                        <Grid pt={2} pb={3} display={'flex'} >
                            {
                                otpData ?
                                    <LoadingButton style={{ height: '35px', textTransform: 'none', width: 180 }} className='mr-2' loading={loading} disabled={loading} type='submit'  >
                                        {
                                            loading ?
                                                <Grid display={'flex'} justifyContent={'center'}><div className="spinner"></div></Grid>
                                                :
                                                <>
                                                    Reset Password <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                                                        <path d="M7.875 13.5H19.125M19.125 13.5L14.625 9M19.125 13.5L14.625 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </>
                                        }
                                    </LoadingButton>
                                    :
                                    <LoadingButton style={{ height: '35px', textTransform: 'none', width: 130 }} className='mr-2' loading={loading} disabled={loading} type='submit'  >
                                        {
                                            loading ?
                                                <Grid display={'flex'} justifyContent={'center'}><div className="spinner"></div></Grid>
                                                :
                                                <>
                                                    Send OTP <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                                                        <path d="M7.875 13.5H19.125M19.125 13.5L14.625 9M19.125 13.5L14.625 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </>
                                        }
                                    </LoadingButton>

                            }


                        </Grid>

                    </form>
                </div>
            </Grid>
        </Drawer>

    );
}

