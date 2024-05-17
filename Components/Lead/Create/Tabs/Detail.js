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


    const fetchNameTitles = (e, title) => {
        return ListingApi.nameTitle({ keyword: e, limit: 30 }).then(response => {
            if (typeof response.data.data !== "undefined") {
                // settitles(response.data.data)
                return response.data.data;
            } else {
                return [];
            }
        })
    }

    const fetchIntakes = (e) => {
        return ListingApi.intakes({ keyword: e, }).then(response => {
            if (typeof response.data.data !== "undefined") {
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
        if (editId == 0) {
            setValue('whatsapp', value)
            setWhatsappCode(dialCode)
            setValue('whatsapp', value)
            if (value.startsWith(dialCode)) {
                const trimmedPhone = value.slice(dialCode.length);
                setWhatsapp(trimmedPhone);
            } else {
                setWhatsapp(value);
            }
        }
        if (value.startsWith(dialCode)) {
            const trimmedPhone = value.slice(dialCode.length);
            setPhone(trimmedPhone);
        } else {
            setPhone(value);
        }
        // Trigger validation for the 'phone' field
        trigger('phone');
    };

    // console.log(whatsappCode,whatsapp);

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

    const handleinTakeChange = (data) => {
        setValue('intake', data || '')

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
        // setValue('alt_phone','234')
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
        <div className='form-data-cntr'>

            {/* <button type='reset' onClick={() => setLoading(false)}>click</button> */}
            {
                dataLoading ?
                    <LoadingEdit leftMD={5} rightMD={7} item={items} />
                    :
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className='form_group d-flex align-items-center frm-nam-fild '>
                            
                            <div className='frm-nam-select' >
                                <SelectX
                                    // menuPlacement='top'
                                    loadOptions={fetchNameTitles}
                                    control={control}
                                    name={'title'}
                                    defaultValue={watch('title')}
                                />
                                {errors.title && <span className='form-validation'>{errors.title.message}</span>}
                            </div>

                           
                                <input  placeholder='Your Name' control={control} {...register('name', { required: 'The Name field is required' })}
                                    value={watch('name')} />
                                {errors.name && <span className='form-validation'>{errors.name.message}</span>}
                           


                        </div>


                      

                        <div className='form_group frm-conn-stl  '>
                         
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 17 14" fill="none">
  <path d="M1 3.5L7.3906 7.7604C8.0624 8.20827 8.9376 8.20827 9.6094 7.7604L16 3.5M3 12.6667H14C15.1046 12.6667 16 11.7712 16 10.6667V3C16 1.89543 15.1046 1 14 1H3C1.89543 1 1 1.89543 1 3V10.6667C1 11.7712 1.89543 12.6667 3 12.6667Z" stroke="#0B0D23" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                                <input placeholder='Type your email here' control={control} {...register('email', {
                                    required: 'Please enter your email',
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: 'Please enter valid email address',
                                    },
                                })}
                                    value={watch('email')} />
                                {errors.email && <span className='form-validation'>{errors.email.message}</span>}

                             
                        </div>


                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='form_group'>
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
                            </div>
                            <div className='form_group'>
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
                            </div>
                        </div>


                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='form_group'>
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

                            </div>
                            <div className='form_group frm-conn-stl '>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M3 12H8M3 12C3 16.9706 7.02944 21 12 21M3 12C3 7.02944 7.02944 3 12 3M8 12H16M8 12C8 16.9706 9.79086 21 12 21M8 12C8 7.02944 9.79086 3 12 3M16 12H21M16 12C16 7.02944 14.2091 3 12 3M16 12C16 16.9706 14.2091 21 12 21M21 12C21 7.02944 16.9706 3 12 3M21 12C21 16.9706 16.9706 21 12 21" stroke="#0B0D23" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                            <input placeholder='Preferred Countries' control={control} {...register('preffered_country')}
                                    value={watch('preffered_country')} />
                                {errors.preffered_country && <span className='form-validation'>{errors.preffered_country.message}</span>}
                            
                            </div>
                        </div>



                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='form_group'>
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
                            
                            </div>
                            <div className='form_group frm-conn-stl '>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M3 15.0002V16.8C3 17.9201 3 18.4798 3.21799 18.9076C3.40973 19.2839 3.71547 19.5905 4.0918 19.7822C4.5192 20 5.07899 20 6.19691 20H21.0002M3 15.0002V5M3 15.0002L6.8534 11.7891L6.85658 11.7865C7.55366 11.2056 7.90288 10.9146 8.28154 10.7964C8.72887 10.6567 9.21071 10.6788 9.64355 10.8584C10.0105 11.0106 10.3323 11.3324 10.9758 11.9759L10.9822 11.9823C11.6357 12.6358 11.9633 12.9635 12.3362 13.1153C12.7774 13.2951 13.2685 13.3106 13.7207 13.1606C14.1041 13.0334 14.4542 12.7275 15.1543 12.115L21 7" stroke="#0B0D23" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                            <input placeholder='Preferred Course level' control={control} {...register('preffered_course')}
                                    value={watch('preffered_course')} />
                                {errors.preffered_course && <span className='form-validation'>{errors.preffered_course.message}</span>}
                         
                            </div>
                        </div>


                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='form_group'>
                            <AsyncSelect
                                    name={'intake'}
                                    defaultValue={watch('intake')}
                                    // isClearable
                                    defaultOptions
                                    loadOptions={fetchIntakes}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    onChange={handleinTakeChange}
                                />
                                {errors.intake && <span className='form-validation'>{errors.intake.message}</span>}
                            
                            </div>
                            <div className='form_group'>
                            <DateInput
                                    control={control}
                                    name="dob"
                                    value={watch('dob')}
                                />
                                {errors.dob && <span className='form-validation'>{errors.dob.message}</span>}
                            </div>
                        </div>

                    
                            
                          
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='form_group'>
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
                             
                            </div>
                            <div className='form_group'>
                            <input control={control} name="state"
                                    // disabled={!watch('country')}
                                    value={watch('state')} />
                                {errors.state && <span className='form-validation'>{errors.state.message}</span>}
                             
                            </div>
                        </div>
                                
  

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='form_group'>
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
                            </div>
                            <div className='form_group'>
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
                                
                            </div>
                        </div>
 

                      

                         
 


                       
 

                        {
                            watch('source')?.name == 'Referral' &&
                            <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                                <Grid item xs={12} md={5}>
                                    <Typography sx={{ fontWeight: '500' }}>Referred Student</Typography>
                                </Grid>
                                <Grid item xs={12} md={7}>
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

                       
                            
<div className='form_group'>
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
                            </div>

                       

                       
                           
                            <div className='form_group'>
                                <textarea multiline rows={2} fullWidth control={control}  {...register('note')}
                                    value={watch('note') || ''} />
                            </div>
                       

                        <Grid p={1} pb={3}  >
                            <Button onClick={handleClose} className='cancel-btn'>Cancel <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
  <path d="M7.875 13.5H19.125M19.125 13.5L14.625 9M19.125 13.5L14.625 18" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg></Button>
                            <LoadingButton loading={loading} disabled={loading}  className='save-btn'>Save <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M9 9L11.9999 11.9999M11.9999 11.9999L14.9999 14.9999M11.9999 11.9999L9 14.9999M11.9999 11.9999L14.9999 9M4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4801 4 18.9079 4.21799C19.2842 4.40973 19.5905 4.71547 19.7822 5.0918C20.0002 5.51962 20.0002 6.07967 20.0002 7.19978V16.7998C20.0002 17.9199 20.0002 18.48 19.7822 18.9078C19.5905 19.2841 19.2842 19.5905 18.9079 19.7822C18.4805 20 17.9215 20 16.8036 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg></LoadingButton>
                        </Grid>
                    </form>
            }


        </div >
    )
}

export default Detail
