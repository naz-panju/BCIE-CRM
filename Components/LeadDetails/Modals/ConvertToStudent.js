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
import PhoneInput from 'react-phone-input-2';
import moment from 'moment';
import { StudentApi } from '@/data/Endpoints/Student';
import toast from 'react-hot-toast';

const scheme = yup.object().shape({
    first_name: yup.string().required("First Name is Required"),
    email: yup.string().required("Email is Required"),
    phone: yup.string().required("Phone Number is Required"),
    dob: yup.string().required("Date Of Birth is Required"),
    zip: yup.string().required("Zip Code is Required"),
    country: yup.object().required("Please Choose a Country").typeError("Please choose a Country"),
    state: yup.string().required("State is Required"),
})

export default function ConvertLeadToStudent({ details, editId, setEditId, refresh, setRefresh }) {
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



    const fetchGlobalCountry = (e) => {
        return ListingApi.globalCountry({ keyword: e }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }

    const fetchNameTitles = (e) => {
        return ListingApi.nameTitle({ keyword: e }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }




    const onSubmit = async (data) => {
        console.log(data);

        setLoading(true)
        let dob = ''
        if (data?.dob) {
            dob = moment(data?.dob).format('YYYY-MM-DD')
        }

        let dataToSubmit = {
            lead_id: details.id,
            title: data?.title?.name,
            first_name: data?.first_name,
            middle_name: data?.middle_name,
            last_name: data?.last_name,
            email: data?.email,
            phone_number: data?.phone,
            date_of_birth: dob,
            address: data?.address,
            zipcode: data?.zip,
            state: data?.state,
            country_id: data?.country?.id,
            alternate_phone_number:data?.alt_phone,
            whatsapp_number:data?.whatsapp
        }

        console.log(dataToSubmit);

        let action;

        if (editId > 0) {
            // dataToSubmit['id'] = editId
            // action = TaskApi.update(dataToSubmit)
        } else {
            action = StudentApi.add(dataToSubmit)
        }

        action.then((response) => {
            console.log(response);
            if (response?.statusText == "Created") {
                toast.success('Student Has Been Successfully Created')
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
        setValue('title', '')
        setValue('date', '')
        setValue('assigned_to', '')
        setValue('reviewer', '')
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

    const handlePhoneNumber = (value, country) => {
        if (!value) {
            setValue('phone', '')
            return;
        }

        setValue('phone', value)

        // Trigger validation for the 'phone' field
        trigger('phone');
    };

    const handleAltPhoneNumber = (value, country) => {
        if (!value) {
            setAltPhone('');
            setValue('alt_phone', '')
            return;
        }

        const { dialCode } = country;
        setAltCode(dialCode)
        setValue('alt_phone', value)
        if (value.startsWith(dialCode)) {
            const trimmedPhone = value.slice(dialCode.length);
            setAltPhone(trimmedPhone);
        } else {
            setAltPhone(value);
        }
        // Trigger validation for the 'phone' field
        trigger('alt_phone');
    };

    const handleWhatsAppNumber = (value, country) => {
        if (!value) {
            setWhatsapp('');
            setValue('whatsapp', '')
            return;
        }

        const { dialCode } = country;
        setWhatsappCode(dialCode)
        setValue('whatsapp', value)
        if (value.startsWith(dialCode)) {
            const trimmedPhone = value.slice(dialCode.length);
            setWhatsapp(trimmedPhone);
        } else {
            setWhatsapp(value);
        }
        // Trigger validation for the 'phone' field
        trigger('whatsapp');
    };

    const initialValues = () => {
        setValue('email', details?.email)
        setValue('phone', `${details?.phone_country_code}${details?.phone_number}`)
        setValue('alt_phone', `${details?.alternate_phone_country_code}${details?.alternate_phone_number}`)
        setValue('whatsapp', `+${details?.whatsapp_country_code}${details?.whatsapp_number}`)
        setValue('country',details?.country)
        setValue('state',details?.state)

        // console.log(details);
    }



    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
        } else if (editId == 0) {
            setOpen(true)
            initialValues()
        }
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
                        <a style={{ fontWeight: 500, fontSize: '19px' }}>Convert To Student</a>
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
                                                <a className='form-text'>Title</a>
                                            </Grid>
                                            <Grid item pr={1} xs={6} md={3}>
                                                <SelectX
                                                    // menuPlacement='top'
                                                    loadOptions={fetchNameTitles}
                                                    control={control}
                                                    name={'title'}
                                                    defaultValue={watch('title')}
                                                />
                                                {errors.title && <span className='form-validation'>{errors.title.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid p={1} container >
                                            <Grid item pr={1} xs={4} md={4}>
                                                <a className='form-text'>First Name </a>
                                            </Grid>
                                            <Grid item pr={1} xs={8} md={8}>
                                                <TextInput control={control} name="first_name"
                                                    value={watch('first_name')} />
                                                {errors.first_name && <span className='form-validation'>{errors.first_name.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid p={1} container >
                                            <Grid item pr={1} xs={4} md={4}>
                                                <a className='form-text'>Middle Name </a>
                                            </Grid>
                                            <Grid item pr={1} xs={8} md={8}>
                                                <TextInput control={control} name="middle_name"
                                                    value={watch('middle_name')} />
                                                {errors.middle_name && <span className='form-validation'>{errors.middle_name.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid p={1} container >
                                            <Grid item pr={1} xs={4} md={4}>
                                                <a className='form-text'>Last Name </a>
                                            </Grid>
                                            <Grid item pr={1} xs={8} md={8}>
                                                <TextInput control={control} name="last_name"
                                                    value={watch('last_name')} />
                                                {errors.last_name && <span className='form-validation'>{errors.last_name.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid p={1} container >
                                            <Grid item pr={1} xs={4} md={4}>
                                                <a className='form-text'>Email Address </a>
                                            </Grid>
                                            <Grid item pr={1} xs={8} md={8}>
                                                <TextInput control={control} name="email"
                                                    value={watch('email')} />
                                                {errors.email && <span className='form-validation'>{errors.email.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid p={1} container >
                                            <Grid item pr={1} xs={4} md={4}>
                                                <a className='form-text'>Phone Number </a>
                                            </Grid>
                                            <Grid item pr={1} xs={8} md={8}>
                                                <PhoneInput
                                                    {...register('phone')}
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

                                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={4}>
                                                <Typography sx={{ fontWeight: '500' }}>Alternate Mobile Number</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <PhoneInput
                                                    {...register('alt_phone')}

                                                    international
                                                    // autoFormat
                                                    placeholder="Enter your number"
                                                    country="in"
                                                    value={watch('alt_phone')}
                                                    onChange={handleAltPhoneNumber}
                                                    inputprops={{
                                                        autoFocus: true,
                                                        autoComplete: 'off',
                                                        name: 'phone',
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
                                                {errors.alt_phone && <span className='form-validation'>{errors.alt_phone.message}</span>}

                                            </Grid>
                                        </Grid>

                                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                            <Grid item xs={12} md={4}>
                                                <Typography sx={{ fontWeight: '500' }}>Whatsapp Number</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <PhoneInput
                                                    {...register('whatsapp')}

                                                    international
                                                    // autoFormat
                                                    placeholder="Enter your number"
                                                    country="in"
                                                    value={watch('whatsapp')}
                                                    onChange={handleWhatsAppNumber}
                                                    inputprops={{
                                                        autoFocus: true,
                                                        autoComplete: 'off',
                                                        name: 'phone',
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
                                                {errors.whatsapp && <span className='form-validation'>{errors.whatsapp.message}</span>}

                                            </Grid>
                                        </Grid>

                                        <Grid p={1} container >
                                            <Grid item pr={1} xs={4} md={4}>
                                                <a className='form-text'>Date Of Birth </a>
                                            </Grid>
                                            <Grid item pr={1} xs={8} md={8}>
                                                <DateInput
                                                    control={control}
                                                    name="dob"
                                                    value={watch('dob')}
                                                />
                                                {errors.dob && <span className='form-validation'>{errors.dob.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid p={1} container >
                                            <Grid item pr={1} xs={4} md={4}>
                                                <a className='form-text'> Address </a>
                                            </Grid>
                                            <Grid item pr={1} xs={8} md={8}>
                                                <TextField
                                                    {...register('address')}
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    sx={{ width: '100%', }}
                                                />
                                                {errors.address && <span className='form-validation'>{errors.address.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid p={1} container >
                                            <Grid item pr={1} xs={4} md={4}>
                                                <a className='form-text'>Country </a>
                                            </Grid>
                                            <Grid item pr={1} xs={8} md={8}>
                                                <SelectX
                                                    menuPlacement='top'
                                                    loadOptions={fetchGlobalCountry}
                                                    control={control}
                                                    name={'country'}
                                                    defaultValue={watch('country')}
                                                />
                                                {errors.country && <span className='form-validation'>{errors.country.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid p={1} container >
                                            <Grid item pr={1} xs={4} md={4}>
                                                <a className='form-text'>State / Province</a>
                                            </Grid>
                                            <Grid item pr={1} xs={8} md={8}>
                                                <TextInput disabled={!watch('country')} control={control} name="state"
                                                    value={watch('state')} />
                                                {errors.state && <span className='form-validation'>{errors.state.message}</span>}
                                            </Grid>
                                        </Grid>

                                        <Grid p={1} container >
                                            <Grid item pr={1} xs={4} md={4}>
                                                <a className='form-text'>Zip Code </a>
                                            </Grid>
                                            <Grid item pr={1} xs={8} md={8}>
                                                <TextInput type='number' control={control} name="zip"
                                                    value={watch('zip')} />
                                                {errors.zip && <span className='form-validation'>{errors.zip.message}</span>}
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
