import DateInput from '@/Form/DateInput'
import SelectX from '@/Form/SelectX'
import TextInput from '@/Form/TextInput'
import { ListingApi } from '@/data/Endpoints/Listing'
import { Button, Checkbox, FormControlLabel, FormGroup, Grid, TextField, Typography } from '@mui/material'
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
import ReactSelector from 'react-select';
import { StudentApi } from '@/data/Endpoints/Student'
import AsyncSelect from "react-select/async";
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'




function Form({ data }) {

    const router = useRouter()
    // console.log(data);
    const [formDatas, setformDatas] = useState(data)

    const myLoader = ({ src, width }) => {
        return `${src}?w=${width}`;
    }


    const [referralId, setreferralId] = useState(data?.id)

    const [phone, setPhone] = useState()
    const [code, setCode] = useState()

    const [altPhone, setAltPhone] = useState()
    const [altCode, setAltCode] = useState()

    const [whatsapp, setWhatsapp] = useState()
    const [whatsappCode, setWhatsappCode] = useState()
    const scheme = yup.object().shape({
        name: yup.string().required("Name is Required"),
        email: yup.string().email("Invalid email format").required("Email is Required"),
        // alt_phone: yup.string().test('not-equal', 'Alternate number must be different from mobile number', function (value) {
        //     return value !== this.parent.phone;
        // }),
        // phone: yup.string().required('Phone Number is Required'),
        // alt_phone: yup.string().test('not-equal', 'Alternate number must be different from mobile number', function (value) {
        //     return value !== this.parent.phone;
        // }),
        // preffered_course: yup.string().required("Preffered Course is Required"),
        // assigned_to: yup.object().required("Please Choose an User").typeError("Please choose a User"),
        // country: yup.object().required("Please Choose a Country").typeError("Please choose a User"),
        // institute: yup.object().required("Please Choose a Country").typeError("Please choose an University"),
        // course: yup.object().required("Please Choose a Country").typeError("Please choose a Course"),

    })


    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })
    const phoneValue = watch('phone');

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
        return ListingApi.students({ keyword: e }).then(response => {
            console.log(response?.data?.data);

            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data?.data
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

    const fetchUniversities = (e) => {
        return ListingApi.universities({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data
            } else {
                return [];
            }
        })
    }


    const [referenceOption, setreferenceOption] = useState([
        {
            name: 'No sponsor',
            value: 'No sponsor',
        },
        {
            name: 'Family Sponsor',
            value: 'Family Sponsor',
        },
        {
            name: 'Still to Find',
            value: 'Government funding',
        },
        {
            name: 'Government funding',
            value: 'Government funding',
        },

    ])

    const fetchSources = (e) => {
        return ListingApi.leadSource({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return referenceOption
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
                settitles(response.data.data)
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

        // const { dialCode } = country;
        // setCode(dialCode)
        setValue('phone', value)

        setValue('whatsapp', value)
        // setWhatsappCode(dialCode)
        // if (value.startsWith(dialCode)) {
        //     const trimmedPhone = value.slice(dialCode.length);
        //     setWhatsapp(trimmedPhone);
        // } else {
        setWhatsapp(value);
        // }

        // if (value.startsWith(dialCode)) {
        //     const trimmedPhone = value.slice(dialCode.length);
        //     setPhone(trimmedPhone);
        // } else {
        setPhone(value);
        // }
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

        // const { dialCode } = country;
        // setAltCode(dialCode)
        setValue('alt_phone', value)
        // if (value.startsWith(dialCode)) {
        //     const trimmedPhone = value.slice(dialCode.length);
        //     setAltPhone(trimmedPhone);
        // } else {
        setAltPhone(value);
        // }
        // Trigger validation for the 'phone' field
        trigger('alt_phone');
    };

    const handleWhatsAppNumber = (value, country) => {
        if (!value) {
            setWhatsapp('');
            setValue('whatsapp', '')
            return;
        }

        // const { dialCode } = country;
        // setWhatsappCode(dialCode)
        setValue('whatsapp', value)
        // if (value.startsWith(dialCode)) {
        //     const trimmedPhone = value.slice(dialCode.length);
        //     setWhatsapp(trimmedPhone);
        // } else {
        setWhatsapp(value);
        // }
        // Trigger validation for the 'phone' field
        trigger('whatsapp');
    };

    const handleSourseChange = (data) => {
        setValue('source', data || '')
        setValue('student', '')
        setValue('agency', '')
    }

    const handleSponsorChange = (data) => {
        setValue('sponser', data || '')
    }

    const handleResidenceChange = (data) => {
        setValue('country_of_residence', data || '')
        if (data) {
            // setCode(dialCode)
            setValue('phone', `+${data?.phonecode}`)
            setValue('alt_phone', `+${data?.phonecode}`)
            setValue('phone', `+${data?.phonecode}`)
            setValue('whatsapp', `+${data?.phonecode}`)
        }
    }

    const handleinTakeChange = (data) => {
        setValue('intake', data || '')

    }

    const [titles, settitles] = useState([])
    const [currentTitle, setcurrentTitle] = useState()

    const [selectedCountries, setSelectedCountries] = useState([]);
    const handleCountryChange = (event) => {
        const value = event.target.value;

        setSelectedCountries((prevSelectedCountries) => {
            if (prevSelectedCountries.includes(value)) {
                // Remove the country if it's already selected
                return prevSelectedCountries.filter((country) => country !== value);
            } else {
                // Add the country if it's not selected
                return [...prevSelectedCountries, value];
            }
        });
    };


    const onSubmit = async (data) => {

        setLoading(true)

        let dob = ''
        if (data?.dob) {
            dob = moment(data?.dob).format('YYYY-MM-DD')
        }

        let passport_exp_date = ''
        if (data?.passport_expiry) {
            passport_exp_date = moment(data?.passport_expiry).format('YYYY-MM-DD')
        }

        let countries = selectedCountries?.join(', ')

        let dataToSubmit = {
            referral_link_id: formDatas?.id,
            title: data?.title?.name,
            name: data?.name,
            email: data?.email,

            // phone_country_code: code,
            phone_number: phone,

            // alternate_phone_country_code: altCode,
            // alternate_phone_number: altPhone,

            // whatsapp_country_code: whatsappCode,
            whatsapp_number: whatsapp,

            preferred_course: data?.preffered_course,
            preferred_countries: countries,
            sponser_details: data?.sponser?.value,

            // passport: data?.passport_number,
            // passport_exp_date: passport_exp_date,

            // course_level_id: data?.preffered_course_level?.id || null,
            // intake_id: data?.intake?.id,

            // date_of_birth: dob,
            // address: data?.address,
            // city: data?.city,

            // country_of_birth_id: data?.country_of_birth?.id || null,
            // country_of_residence_id: data?.country_of_residence?.id || null,

            referrance_from: data?.reference,
            note: data?.note,

            source_id: formDatas?.lead_source?.id || null,

            ...(formDatas?.lead_source?.id == 6 ? { agency_id: formDatas?.agency?.id } : {}),
            ...(formDatas?.lead_source?.id == 5 ? { referred_student_id: formDatas?.referredStudent?.id } : {}),
            ...(formDatas?.lead_source?.id == 7 ? { referral_university_id: formDatas?.referred_university?.id } : {}),
            ...(formDatas?.lead_source?.id == 11 ? { event_id: formDatas?.event?.id } : {}),
            // referred_student_id: formDatas?.source?.id == 5 ? formDatas?.referredStudent?.id : null || null,
            // referral_university_id: formDatas?.source?.id == 7 ? formDatas?.referred_university?.id : null || null, // country_id: data?.country?.id,
            // event_id: formDatas?.source?.id == 11 ? formDatas?.event?.id : null || null,

            note: data?.note
        }

        console.log(dataToSubmit);

        LeadApi.publicAdd(dataToSubmit).then((response) => {
            // console.log(response);
            if (response?.data?.data) {

                // toast.success('Lead Has Been Successfully Created')
                reset()
                // handleClear()
                // setLoading(false)
                // location.reload()
                router.push('/thankyou')
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

    const disableSpecificDateForDob = (date) => {
        return moment(date).isAfter(moment().subtract(14, 'years'), 'day');
    }


    const setTitleValue = () => {
        let getTitle = titles?.find((obj => obj?.name == currentTitle))
        setValue('title', getTitle)
    }

    const getOptionLabel = (option) => {
        return option.student_code ? `${option.name} (${option.student_code})` : option.name;
    };

    useEffect(() => {
        fetchReference()
    }, [])


    return (
        <Grid style={{ backgroundColor: '#f0f4f8', padding: '20px' }} container display="flex" alignItems="center" justifyContent="center">
            <div className='m-auto p-[20px] max-w-[700px]' style={{ backgroundColor: 'white', borderRadius: '8px' }}>
                <div className='block'>
                    <div style={{ backgroundImage: `url(${data?.banner_image || 'https:\/\/bcie.spider.ws\/uploads\/referral_links\/banners\/1720096455_header-bg.png'})`, backgroundSize: '120% 140%', backgroundPosition: 'center' }} className='p-[25px]'>
                        <h2 className='text-[18px] text-[#fff] text-left'>{data?.top_description}</h2>
                    </div>

                    <div className='form-data-cntr block'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <a className='form-text'>Full Name</a>
                                    <TextInput placeholder='' control={control} {...register('name', { required: 'The Name field is required' })} value={watch('name')} />
                                    {errors.name && <span className='form-validation'>{errors.name.message}</span>}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <a className='form-text'>Email Address</a>
                                    <TextInput control={control} {...register('email', { required: 'Please enter your email', pattern: { value: /^\S+@\S+$/i, message: 'Please enter valid email address' } })} value={watch('email')} />
                                    {errors.email && <span className='form-validation'>{errors.email.message}</span>}
                                </Grid>
                                {/* <Grid item xs={12} md={6}>
                                    <a className='form-text'>Country of Birth</a>
                                    <AsyncSelect name='country_of_birth' defaultValue={watch('country_of_birth')} isClearable defaultOptions loadOptions={fetchGlobalCountry} getOptionLabel={(e) => e.name} getOptionValue={(e) => e.id} onChange={(data) => setValue('country_of_birth', data)} />
                                    {errors.country_of_birth && <span className='form-validation'>{errors.country_of_birth.message}</span>}
                                </Grid> */}
                                {/* <Grid item xs={12} md={6}> 
                                    <a className='form-text'>Country of Residence</a>
                                    <AsyncSelect name='country_of_residence' defaultValue={watch('country_of_residence')} isClearable defaultOptions loadOptions={fetchGlobalCountry} getOptionLabel={(e) => e.name} getOptionValue={(e) => e.id} onChange={handleResidenceChange} />
                                    {errors.country_of_residence && <span className='form-validation'>{errors.country_of_residence.message}</span>}
                                </Grid> */}
                                <Grid item xs={12} md={6}>
                                    <a className='form-text'>Mobile Phone number</a>
                                    <PhoneInput {...register('phone', { required: 'Please enter your mobile number' })} country={formDatas?.country?.country_code?.toLowerCase()} international placeholder="" value={watch('phone')} onChange={handlePhoneNumber} inputProps={{ autoComplete: 'off', required: true }} inputStyle={{ width: '100%', height: '40px', paddingLeft: '40px' }} buttonStyle={{ border: 'none', backgroundColor: 'transparent', marginLeft: '5px' }} />
                                    {errors.phone && <span className='form-validation'>{errors.phone.message}</span>}
                                </Grid>
                                {/* <Grid item xs={12} md={6}>
                                    <a className='form-text'>Enter Alternate Number</a>
                                    <PhoneInput {...register('alt_phone')} international placeholder="" value={watch('alt_phone')} country={formDatas?.country?.country_code?.toLowerCase()} onChange={handleAltPhoneNumber} inputProps={{ autoComplete: 'off', required: true }} inputStyle={{ width: '100%', height: '40px', paddingLeft: '40px' }} buttonStyle={{ border: 'none', backgroundColor: 'transparent', marginLeft: '5px' }} />
                                    {errors.alt_phone && <span className='form-validation'>{errors.alt_phone.message}</span>}
                                </Grid> */}
                                <Grid item xs={12} md={6}>
                                    <a className='form-text'>Whatsapp Number</a>
                                    <PhoneInput {...register('whatsapp')} international placeholder="" value={watch('whatsapp')} country={formDatas?.country?.country_code?.toLowerCase()} onChange={handleWhatsAppNumber} inputProps={{ autoComplete: 'off', required: true }} inputStyle={{ width: '100%', height: '40px', paddingLeft: '40px' }} buttonStyle={{ border: 'none', backgroundColor: 'transparent', marginLeft: '5px' }} />
                                    {errors.whatsapp && <span className='form-validation'>{errors.whatsapp.message}</span>}
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <a className='form-text'>What course are you interested in?</a>
                                    <TextInput placeholder='' control={control} {...register('preffered_course')} value={watch('preffered_course')} />
                                    {errors.preffered_course && <span className='form-validation'>{errors.preffered_course.message}</span>}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <a className='form-text'>How did you hear about BCIE Ltd?</a>
                                    <ReactSelector placeholder='Select...' menuPlacement='auto' onInputChange={fetchReference} styles={{ menu: (provided) => ({ ...provided, zIndex: 9999 }) }} options={referenceOption} getOptionLabel={(option) => option.name} getOptionValue={(option) => option.name} value={referenceOption.filter((options) => options?.name == watch('reference'))} name='reference' isClearable defaultValue={watch('reference')} onChange={(selectedOption) => setValue('reference', selectedOption?.name || '')} />
                                    {errors.reference && <span className='form-validation'>{errors.reference.message}</span>}
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <a className='form-text'>Where would you like to study?</a>
                                    <div className='flex'>
                                        <FormGroup row className='responsive-checkbox-group'>
                                            {['UK', 'Australia', 'USA', 'Canada'].map((country, index) => (
                                                <FormControlLabel
                                                    style={{ marginRight: 30 }}
                                                    key={country}
                                                    control={
                                                        <Checkbox
                                                            {...register('preferred_country')}
                                                            checked={selectedCountries.includes(country)}
                                                            onChange={handleCountryChange}
                                                            value={country}
                                                        />
                                                    }
                                                    label={country}
                                                />
                                            ))}
                                        </FormGroup>
                                    </div>
                                    {errors.preferred_country && (
                                        <span className='form-validation'>{errors.preferred_country.message}</span>
                                    )}
                                </Grid>


                                <Grid item xs={12} md={6}>
                                    <a className='form-text'>If you have a sponsor please state who</a>
                                    <AsyncSelect menuPlacement='auto' placeholder='Select...' name='sponser' defaultValue={watch('sponser')} isClearable defaultOptions loadOptions={fetchSources} getOptionLabel={(e) => e.name} getOptionValue={(e) => e.id} onChange={handleSponsorChange} />
                                    {errors.sponser && <span className='form-validation'>{errors.sponser.message}</span>}
                                </Grid>
                                {/* <Grid item xs={12} md={6}>
                                    <a className='form-text'>Date of Birth</a>
                                    <DateInput shouldDisableDate={disableSpecificDateForDob} placeholder='' control={control} name='dob' value={watch('dob')} />
                                    {errors.dob && <span className='form-validation'>{errors.dob.message}</span>}
                                </Grid> */}
                                {/* <Grid item xs={12} md={6}>
                                    <a className='form-text'>Passport Number</a>
                                    <TextInput placeholder='' control={control} {...register('passport_number')} value={watch('passport_number')} />
                                    {errors.passport_number && <span className='form-validation'>{errors.passport_number.message}</span>}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <a className='form-text'>Passport Expiry Date</a>
                                    <DateInput placeholder='' control={control} name='passport_expiry' value={watch('passport_expiry')} />
                                    {errors.passport_expiry && <span className='form-validation'>{errors.passport_expiry.message}</span>}
                                </Grid> */}
                                {/* <Grid item xs={12}>
                                    <a className='form-text'>City</a>
                                    <TextInput placeholder='' control={control} {...register('city')} value={watch('city')} />
                                    {errors.city && <span className='form-validation'>{errors.city.message}</span>}
                                </Grid> */}
                                {/* <Grid item xs={12}>
                                    <a className='form-text'>Address</a>
                                    <TextField placeholder='' multiline rows={2} fullWidth control={control} {...register('address')} value={watch('address') || ''} />
                                    {errors.address && <span className='form-validation'>{errors.address.message}</span>}
                                </Grid> */}

                                <Grid item xs={12}>
                                    <a className='form-text'>Any further comments</a>
                                    <TextField placeholder='' multiline rows={3} fullWidth control={control} {...register('note')} value={watch('note') || ''} />
                                    {errors.note && <span className='form-validation'>{errors.note.message}</span>}
                                </Grid>


                                {/* <Grid item xs={12} md={6}>
                                    <a className='form-text'>Lead Source</a>
                                    <AsyncSelect menuPlacement='auto' placeholder='Select...' name='source' defaultValue={watch('source')} isClearable defaultOptions loadOptions={fetchSources} getOptionLabel={(e) => e.name} getOptionValue={(e) => e.id} onChange={handleSourseChange} />
                                    {errors.source && <span className='form-validation'>{errors.source.message}</span>}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <a className='form-text'>How did you hear about us?</a>
                                    <ReactSelector placeholder='Select...' menuPlacement='auto' onInputChange={fetchReference} styles={{ menu: (provided) => ({ ...provided, zIndex: 9999 }) }} options={referenceOption} getOptionLabel={(option) => option.name} getOptionValue={(option) => option.name} value={referenceOption.filter((options) => options?.name == watch('reference'))} name='reference' isClearable defaultValue={watch('reference')} onChange={(selectedOption) => setValue('reference', selectedOption?.name || '')} />
                                    {errors.reference && <span className='form-validation'>{errors.reference.message}</span>}
                                </Grid>
                                {watch('source')?.id == 5 && (
                                    <Grid item xs={12}>
                                        <a className='form-text'>Referred Student</a>
                                        <AsyncSelect placeholder='Select...' name='student' defaultValue={watch('student')} isClearable defaultOptions loadOptions={fetchStudents} getOptionLabel={getOptionLabel} getOptionValue={(e) => e.id} onChange={(e) => setValue('student', e)} />
                                    </Grid>
                                )}
                                {watch('source')?.id == 6 && (
                                    <Grid item xs={12}>
                                        <a className='form-text'>Referred Agency</a>
                                        <AsyncSelect name='agency' defaultValue={watch('agency')} isClearable defaultOptions loadOptions={fetchAgencies} getOptionLabel={(e) => e.name} getOptionValue={(e) => e.id} onChange={(e) => setValue('agency', e)} />
                                    </Grid>
                                )}
                                 {watch('source')?.id == 7 && (
                                    <Grid item xs={12}>
                                        <a className='form-text'>Referred University</a>
                                        <AsyncSelect name='referred_university' defaultValue={watch('referred_university')} isClearable defaultOptions loadOptions={fetchAgencies} getOptionLabel={(e) => e.name} getOptionValue={(e) => e.id} onChange={(e) => setValue('referred_university', e)} />
                                    </Grid>
                                )} */}

                            </Grid>
                            <Grid mt={3} pb={3} className='flex justify-end' >
                                <LoadingButton className='save-btn' loading={loading} disabled={loading} type='submit'  >
                                    {
                                        loading ?
                                            <Grid display={'flex'} justifyContent={'center'}><div className="spinner"></div></Grid>
                                            :
                                            <>
                                                Submit <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                                                    <path d="M7.875 13.5H19.125M19.125 13.5L14.625 9M19.125 13.5L14.625 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </>
                                    }
                                </LoadingButton>
                                {/* <Button className='cancel-btn' >Cancel <svg svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 9L11.9999 11.9999M11.9999 11.9999L14.9999 14.9999M11.9999 11.9999L9 14.9999M11.9999 11.9999L14.9999 9M4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4801 4 18.9079 4.21799C19.2842 4.40973 19.5905 4.71547 19.7822 5.0918C20.0002 5.51962 20.0002 6.07967 20.0002 7.19978V16.7998C20.0002 17.9199 20.0002 18.48 19.7822 18.9078C19.5905 19.2841 19.2842 19.5905 18.9079 19.7822C18.4805 20 17.9215 20 16.8036 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg></Button> */}

                            </Grid>

                            {
                                data?.bottom_description &&
                                <Grid item xs={12} className='p-[25px]' style={{ backgroundColor: '#f5f5f5' }} >
                                    <h2 className='text-[15px] text-[#666]'> {data?.bottom_description}</h2>
                                </Grid>
                            }

                        </form>
                    </div>

                </div>
            </div>
        </Grid>

    )
}

export default Form

export async function getServerSideProps(context) {
    try {
        const formCheck = await axios.get(process.env.NEXT_PUBLIC_API_PATH + `referral-links/form/${context?.query?.slug}`)
        // console.log('ss', formCheck);
        if (formCheck?.status == 200 || formCheck?.status == 201) {
            return {
                props: {
                    data: formCheck?.data?.data || null
                },

            };
        } else {
            // console.log(':;;');
            return {
                props: {
                    data: null
                },
                redirect: {
                    destination: '/notFound', // Replace with your custom error page path
                    permanent: false,
                },

            };
        }
    } catch (error) {
        console.error('Error', error);

        return {
            props: {
                data: null, // or handle the error in a way that makes sense for your application
            },
            redirect: {
                destination: '/notFound', // Replace with your custom error page path
                permanent: false,
            },
        };
    }
}

