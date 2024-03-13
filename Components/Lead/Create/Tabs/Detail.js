import DateInput from '@/Form/DateInput'
import SelectX from '@/Form/SelectX'
import TextInput from '@/Form/TextInput'
import { ListingApi } from '@/data/Endpoints/Listing'
import { Button, Grid, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import 'react-phone-input-2/lib/style.css'
import PhoneInput from 'react-phone-input-2'
import moment from 'moment'
import { LeadApi } from '@/data/Endpoints/Lead'
import toast from 'react-hot-toast'
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from 'react'
import { LoadingButton } from '@mui/lab'
import LoadingEdit from '@/Components/Common/Loading/LoadingEdit'
import ReactSelector from 'react-select';




function Detail({ handleClose, setRefresh, refresh, editId }) {

   

    const [phone, setPhone] = useState()
    const [code, setCode] = useState()
    const [altPhone, setAltPhone] = useState()
    const [altCode, setAltCode] = useState()
    const scheme = yup.object().shape({
        name: yup.string().required("Name is Required"),
        email: yup.string().email("Invalid email format").required("Email is Required"),
        phone: yup.string().required('Phone Number is Required'),
        alt_phone: yup.string().test('not-equal', 'Alternate number must be different from mobile number', function (value) {
            return value !== this.parent.phone;
        }),
        preffered_course: yup.string().required("Preffered Course is Required"),
        // assigned_to: yup.object().required("Please Choose an User").typeError("Please choose a User"),
        // country: yup.object().required("Please Choose a Country").typeError("Please choose a User"),
        // institute: yup.object().required("Please Choose a Country").typeError("Please choose an University"),
        // course: yup.object().required("Please Choose a Country").typeError("Please choose a Course"),
    })

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })
    const phoneValue = watch('phone');

    const [referenceOption, setreferenceOption] = useState([])


    const [selectedCountryID, setselectedCountryID] = useState()
    const [selectedInstituteID, setselectedInstituteID] = useState()
    const [selectedCourseID, setselectedCourseID] = useState()

    const [loading, setLoading] = useState(false)
    const [dataLoading, setDataLoading] = useState(false)

    const fetchReference = (e) => {
        ListingApi.reference({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                setreferenceOption(response?.data?.data)
            } else {
                return [];
            }
        })
    }

    const handlePhoneNumber = (value, country) => {
        if (!value) {
            setPhone('');
            setValue('phone', '')
            return;
        }

        const { dialCode } = country;
        setCode(dialCode)
        setValue('phone', value)
        if (value.startsWith(dialCode)) {
            const trimmedPhone = value.slice(dialCode.length);
            setPhone(trimmedPhone);
        } else {
            setPhone(value);
        }
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


    const onSubmit = async (data) => {

        setLoading(true)

        let leadDate = ''
        if (data?.date) {
            leadDate = moment(data?.date).format('YYYY-MM-DD')
        }

        let dataToSubmit = {
            name: data?.name,
            email: data?.email,

            phone_country_code: code,
            phone_number: phone,

            alternate_phone_country_code: altCode,
            alternate_phone_number: altPhone,

            preferred_course: data?.preffered_course,
            referrance_from: data?.reference,

            // follow_up_assigned_to: data?.assigned_to?.id,
            // applying_for_country_id: data?.country?.id,
            // applying_for_university_id: data?.institute?.id,
            // applying_for_course_id: data?.course?.id,
            // next_follow_up_date: leadDate,
            // stage_id: data?.stage?.id,
            // substage_id: data?.sub_stage?.id,

            note: data?.note
        }

        console.log(dataToSubmit);

        let action;

        if (editId > 0) {
            dataToSubmit['id'] = editId;
            action = LeadApi.update(dataToSubmit)
        } else {
            action = LeadApi.add(dataToSubmit)
        }
        action.then((response) => {
            console.log(response);
            if (response?.data?.data) {
                toast.success('Lead Has Been Successfully Created ')
                setRefresh(!refresh)
                reset()
                handleClose()
                setLoading(false)
            } else {
                toast.error(response?.response?.data?.message)
                setLoading(false)
            }
        }).catch((error) => {
            console.log(error);
            toast.error(error?.message)
            setLoading(false)
        })

        // try {
        //     const response = await LeadApi.add(dataToSubmit)
        //     console.log(response);

        //     if (response?.data?.data) {
        //         toast.success('Lead Has Been Successfully Created ')
        //         setRefresh(!refresh)
        //         reset()
        //         handleClose()
        //     }

        // } catch (error) {
        //     console.log(error);
        //     toast.error(error?.message)

        // }

    }

    const getDetails = async () => {
        setDataLoading(true)
        const response = await LeadApi.view({ id: editId })
        if (response?.data?.data) {
            let data = response?.data?.data
            console.log(data);

            // console.log(`+${data?.phone_country_code}${data?.phone_number}`);

            setValue('name', data?.name)
            setValue('phone', `+${data?.phone_country_code}${data?.phone_number}`)
            setPhone(data?.phone_number)
            setCode(data?.phone_country_code)

            setValue('alt_phone', `+${data?.alternate_phone_country_code}${data?.alternate_phone_number}`)
            setAltPhone(data?.alternate_phone_number)
            setAltCode(data?.alternate_phone_country_code)

            setValue('email', data?.email)
            setValue('preffered_course', data?.preferred_course)
            setValue('reference', data?.referrance_from)


            // setValue('country', data?.applyingForCountry)
            // setValue('institute', data?.applyingForUniversity)
            // setValue('course', data?.applyingForCourse)
            // setValue('stage', data?.stage)
            // setValue('sub_stage', data?.substage)
            // setValue('assigned_to', data?.followUpAssignedToUser)
            // if (data?.next_follow_up_date) {
            //     const date = moment(data.next_follow_up_date, 'YYYY-MM-DD').toDate();
            //     setValue('date', date);
            // }

            setValue('note', data?.note)
            // setValue()
            // setValue()
            // setValue()
        }
        setDataLoading(false)
    }

    useEffect(() => {
        if (watch('country')) {
            setselectedCountryID(watch('country')?.id)
        } if (watch('course')) {
            setselectedCourseID(watch('course')?.id)
        } if (watch('institute')) {
            setselectedInstituteID(watch('institute')?.id)
        }
    }, [watch('country'), watch('course'), watch('institute')])

    useEffect(() => {
        if (editId > 0) {
            getDetails()
        }
        fetchReference()
    }, [editId])

    const items = [
        { label: 'Name' },
        { label: 'Email Address' },
        { label: 'Mobile Number' },
        { label: 'Alternate Mobile Number' },
        { label: 'Preferred Course' },
        { label: ' Reference From' },
        { label: 'Note', multi: true },
    ]

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* <button type='reset' onClick={() => setLoading(false)}>click</button> */}
                {
                    dataLoading ?
                        <LoadingEdit item={items} />
                        :
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
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

                            <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                <Grid item xs={12} md={5}>
                                    <Typography sx={{ fontWeight: '500' }}>Alternate Mobile Number</Typography>
                                </Grid>
                                <Grid item xs={12} md={7}>
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
                                <Grid item xs={12} md={5}>
                                    <Typography sx={{ fontWeight: '500' }}>Preferred Course</Typography>
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <TextInput control={control} {...register('preffered_course')}
                                        value={watch('preffered_course')} />
                                    {errors.preffered_course && <span className='form-validation'>{errors.preffered_course.message}</span>}
                                </Grid>
                            </Grid>

                            <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                <Grid item xs={12} md={5}>
                                    <Typography sx={{ fontWeight: '500' }}>Reference From</Typography>
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <ReactSelector
                                        onInputChange={fetchReference}
                                        styles={{ menu: provided => ({ ...provided, zIndex: 9999 }) }}
                                        options={referenceOption}
                                        getOptionLabel={option => option.name}
                                        getOptionValue={option => option.name}
                                        value={
                                            referenceOption.filter(options =>
                                                options?.name == watch('reference')
                                            )
                                        }
                                        name='reference'
                                        isClearable
                                        defaultValue={(watch('reference'))}
                                        onChange={(selectedOption) => setValue('reference', selectedOption?.name || '')}
                                    />
                                </Grid>

                            </Grid>


                            <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                <Grid item xs={12} md={5}>
                                    <Typography sx={{ fontWeight: '500' }}>Note</Typography>
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <TextField multiline rows={2} fullWidth control={control}  {...register('note')}
                                        value={watch('note')} />
                                </Grid>
                            </Grid>
                        </form>
                }

                <Grid p={1} pb={3} display={'flex'} justifyContent={'end'}>
                    <Button size='small' sx={{ textTransform: 'none', mr: 2, height: 30 }} variant='outlined'>Cancel</Button>
                    <LoadingButton loading={loading} disabled={loading} size='small' type='submit' sx={{ textTransform: 'none', height: 30 }} variant='contained'>Save</LoadingButton>
                </Grid>

            </form>
        </div >
    )
}

export default Detail
