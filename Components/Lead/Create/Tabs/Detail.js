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
import { StudentApi } from '@/data/Endpoints/Student'
import AsyncSelect from "react-select/async";




function Detail({ handleClose, setRefresh, refresh, editId, handleRefresh }) {



    const [phone, setPhone] = useState()
    const [code, setCode] = useState()

    const [altPhone, setAltPhone] = useState()
    const [altCode, setAltCode] = useState()

    const [whatsapp, setWhatsapp] = useState()
    const [whatsappCode, setWhatsappCode] = useState()
    const scheme = yup.object().shape({
        name: yup.string().required("Name is Required"),
        email: yup.string().email("Invalid email format").required("Email is Required"),
        // phone: yup.string().required('Phone Number is Required'),
        // alt_phone: yup.string().test('not-equal', 'Alternate number must be different from mobile number', function (value) {
        //     return value !== this.parent.phone;
        // }),
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

    const fetchCourseLevel = (e) => {
        return ListingApi.courseLevel({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data
            } else {
                return [];
            }
        })
    }

    const fetchStudents = (e) => {
        return StudentApi.list({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data
            } else {
                return [];
            }
        })
    }

    const fetchAgencies = (e) => {
        return ListingApi.agencies({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data
            } else {
                return [];
            }
        })
    }

    const fetchSources = (e) => {
        return ListingApi.leadSource({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data
            } else {
                return [];
            }
        })
    }

    const fetchGlobalCountry = (e) => {
        return ListingApi.globalCountry({ keyword: e }).then(response => {
            // console.log(response?.data?.data);
            if (response?.data?.data) {
                return response.data.data;
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

    const handleSourseChange = (data) => {
        setValue('source', data || '')
        setValue('student', '')
        setValue('agency', '')
    }



    const onSubmit = async (data) => {

        setLoading(true)

        let dataToSubmit = {
            name: data?.name,
            email: data?.email,

            phone_country_code: code,
            phone_number: phone,

            alternate_phone_country_code: altCode,
            alternate_phone_number: altPhone,

            whatsapp_country_code: whatsappCode,
            whatsapp_number: whatsapp,

            preferred_course: data?.preffered_course,
            preferred_countries: data?.preffered_country,

            course_level_id: data?.preffered_course_level?.id,

            referrance_from: data?.reference,

            source_id: data?.source?.id,
            agency_id: data?.agency?.id,
            referred_student_id: data?.student?.id,

            state: data?.state,
            country_id: data?.country?.id,

            note: data?.note
        }

        // console.log(dataToSubmit);

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
                toast.success(editId > 0 ? 'Lead Has Been Successfully Updated ' : 'Lead Has Been Successfully Created')
                if (handleRefresh) {
                    handleRefresh()
                } else {
                    setRefresh(!refresh)
                }
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

    }

    const getDetails = async () => {
        setDataLoading(true)
        const response = await LeadApi.view({ id: editId })
        if (response?.data?.data) {
            let data = response?.data?.data
            console.log(data);

            // console.log(`+${data?.phone_country_code}${data?.phone_number}`);

            setValue('name', data?.name)
            setValue('email', data?.email)

            setValue('phone', `+${data?.phone_country_code}${data?.phone_number}`)
            setPhone(data?.phone_number)
            setCode(data?.phone_country_code)

            setValue('alt_phone', `+${data?.alternate_phone_country_code}${data?.alternate_phone_number}`)
            setAltPhone(data?.alternate_phone_number)
            setAltCode(data?.alternate_phone_country_code)

            setValue('whatsapp', `+${data?.whatsapp_country_code}${data?.whatsapp_number}`)
            setWhatsapp(data?.whatsapp_number)
            setWhatsappCode(data?.whatsapp_country_code)

            setValue('preffered_country', data?.preferred_countries)
            setValue('preffered_course_level', data?.course_level)
            setValue('preffered_course', data?.preferred_course)

            setValue('source', data?.lead_source)
            setValue('student', data?.referredStudent)
            setValue('agency', data?.agency)
            setValue('reference', data?.referrance_from)

            setValue('country', data?.country)
            setValue('state', data?.state)

            setValue('note', data?.note)

        }
        setDataLoading(false)
    }

    // useEffect(() => {
    //     if (watch('country')) {
    //         setselectedCountryID(watch('country')?.id)
    //     } if (watch('course')) {
    //         setselectedCourseID(watch('course')?.id)
    //     } if (watch('institute')) {
    //         setselectedInstituteID(watch('institute')?.id)
    //     }
    // }, [watch('source'), watch('course'), watch('institute')])

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
        { label: 'Whatsapp Number' },
        { label: 'Preferred Countries' },
        { label: 'Preferred Courses' },
        { label: 'Lead Source' },
        { label: 'How did you know about us?' },
        { label: 'Note', multi: true },
    ]

    return (
        <div>

            {/* <button type='reset' onClick={() => setLoading(false)}>click</button> */}
            {
                dataLoading ?
                    <LoadingEdit leftMD={5} rightMD={7} item={items} />
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
                                <Typography sx={{ fontWeight: '500' }}>Whatsapp Number</Typography>
                            </Grid>
                            <Grid item xs={12} md={7}>
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


                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                            <Grid item xs={12} md={5}>
                                <Typography sx={{ fontWeight: '500' }}>Preferred Countries</Typography>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <TextInput control={control} {...register('preffered_country')}
                                    value={watch('preffered_country')} />
                                {errors.preffered_country && <span className='form-validation'>{errors.preffered_country.message}</span>}
                            </Grid>
                        </Grid>

                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                            <Grid item xs={12} md={5}>
                                <Typography sx={{ fontWeight: '500' }}>Preferred Course Level</Typography>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <SelectX
                                    menuPlacement='top'
                                    loadOptions={fetchCourseLevel}
                                    control={control}
                                    // error={errors?.assigned_to?.id ? errors?.assigned_to?.message : false}
                                    // error2={errors?.assigned_to?.message ? errors?.assigned_to?.message : false}
                                    name={'preffered_course_level'}
                                    defaultValue={watch('preffered_course_level')}
                                />
                                {errors.preffered_course_level && <span className='form-validation'>{errors.preffered_course_level.message}</span>}
                            </Grid>
                        </Grid>

                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                            <Grid item xs={12} md={5}>
                                <Typography sx={{ fontWeight: '500' }}>Preferred courses</Typography>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <TextInput control={control} {...register('preffered_course')}
                                    value={watch('preffered_course')} />
                                {errors.preffered_course && <span className='form-validation'>{errors.preffered_course.message}</span>}
                            </Grid>
                        </Grid>

                        <Grid p={1} container >
                            <Grid item xs={12} md={5}>
                                <a className='form-text'>Country From</a>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <AsyncSelect
                                    menuPlacement='top'
                                    loadOptions={fetchGlobalCountry}
                                    onInputChange={fetchGlobalCountry}
                                    defaultOptions
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    control={control}
                                    name={'country'}
                                    defaultValue={watch('country')}
                                    onChange={(data) => setValue('country', data)}
                                />
                                {errors.country && <span className='form-validation'>{errors.country.message}</span>}
                            </Grid>
                        </Grid>

                        <Grid p={1} container >
                            <Grid item xs={12} md={5}>
                                <a className='form-text'>State / Province</a>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <TextInput control={control} name="state"
                                    // disabled={!watch('country')}
                                    value={watch('state')} />
                                {errors.state && <span className='form-validation'>{errors.state.message}</span>}
                            </Grid>
                        </Grid>

                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                            <Grid item xs={12} md={5}>
                                <Typography sx={{ fontWeight: '500' }}>Lead Source</Typography>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <AsyncSelect
                                    // isDisabled={!selectedUniversityId}
                                    // key={selectedUniversityId}
                                    name={'source'}
                                    defaultValue={watch('source')}
                                    isClearable
                                    defaultOptions
                                    loadOptions={fetchSources}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    onChange={handleSourseChange}
                                />
                            </Grid>

                        </Grid>

                        {
                            watch('source')?.name == 'Referral' &&
                            <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                <Grid item xs={12} md={5}>
                                    <Typography sx={{ fontWeight: '500' }}>Referred Student</Typography>
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <SelectX
                                        menuPlacement='top'
                                        loadOptions={fetchStudents}
                                        control={control}
                                        // error={errors?.assigned_to?.id ? errors?.assigned_to?.message : false}
                                        // error2={errors?.assigned_to?.message ? errors?.assigned_to?.message : false}
                                        name={'student'}
                                        defaultValue={watch('student')}
                                    />
                                    {/* {errors.preffered_course && <span className='form-validation'>{errors.preffered_course.message}</span>} */}
                                </Grid>
                            </Grid>
                        }


                        {
                            watch('source')?.name == 'Agency' &&
                            <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                <Grid item xs={12} md={5}>
                                    <Typography sx={{ fontWeight: '500' }}>Referred Agency</Typography>
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <SelectX
                                        menuPlacement='top'
                                        loadOptions={fetchAgencies}
                                        control={control}
                                        // error={errors?.assigned_to?.id ? errors?.assigned_to?.message : false}
                                        // error2={errors?.assigned_to?.message ? errors?.assigned_to?.message : false}
                                        name={'agency'}
                                        defaultValue={watch('agency')}
                                    />
                                    {/* {errors.preffered_course && <span className='form-validation'>{errors.preffered_course.message}</span>} */}
                                </Grid>
                            </Grid>
                        }

                        <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                            <Grid item xs={12} md={5}>
                                <Typography sx={{ fontWeight: '500' }}>How did you know about us? </Typography>
                            </Grid>
                            <Grid item xs={12} md={7}> 
                                <ReactSelector
                                    menuPlacement='auto'
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

                        <Grid display={'flex'} container p={1.5} item xs={12}>
                            <Grid item xs={12} md={5}>
                                <Typography sx={{ fontWeight: '500' }}>Note</Typography>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <TextField multiline rows={2} fullWidth control={control}  {...register('note')}
                                    value={watch('note') || ''} />
                            </Grid>
                        </Grid>

                        <Grid p={1} pb={3} display={'flex'} justifyContent={'end'}>
                            <Button onClick={handleClose} size='small' sx={{ textTransform: 'none', mr: 2, height: 30 }} variant='outlined'>Cancel</Button>
                            <LoadingButton loading={loading} disabled={loading} size='small' type='submit' sx={{ textTransform: 'none', height: 30 }} variant='contained'>Save</LoadingButton>
                        </Grid>
                    </form>
            }


        </div >
    )
}

export default Detail
