import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Detail from './Tabs/Detail';
import { useState } from 'react';
import TabPanel from '@/utils/TabPanel';
import { useForm } from 'react-hook-form';
import { ListingApi } from '@/data/Endpoints/Listing';
import { StudentApi } from '@/data/Endpoints/Student';
import { LeadApi } from '@/data/Endpoints/Lead';
import * as yup from "yup";
import toast from 'react-hot-toast';
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import SelectX from '@/Form/SelectX';
import AsyncSelect from "react-select/async";
import DateInput from '@/Form/DateInput';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, TextField, Tooltip } from '@mui/material';
import ReactSelector from 'react-select';
import LoadingEdit from '@/Components/Common/Loading/LoadingEdit';
import moment from 'moment';
import TextInput from '@/Form/TextInput';





function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


export default function CreateTabs({ handleClose, refresh, setRefresh, editId, handleRefresh, from, handleLeadRefresh }) {
    const [phone, setPhone] = useState()
    const [code, setCode] = useState()

    const [altPhone, setAltPhone] = useState()
    const [altCode, setAltCode] = useState()

    const [whatsapp, setWhatsapp] = useState()
    const [whatsappCode, setWhatsappCode] = useState()


    let scheme

    if (from == 'app') {
        scheme = yup.object().shape({
            name: yup.string().required("Name is Required"),
            email: yup.string().email("Invalid email format").required("Email is Required"),
            dob: yup.string().required('Date of Birth is Required'),
            address: yup.string().required('Address is Required'),
            city: yup.string().required('City is Required'),
            reference: yup.string().required('Reference is Required'),
            phone: yup.string().required('Phone number is Required'),
            alt_phone: yup.string().test('not-equal', 'Alternate number must be different from mobile number', function (value) {
                return value !== this.parent.phone;
            }),
            passport_number: yup.string().required("Passport Number is Required"),
            passport_expiry: yup.string().required("Passport Expiry Date is Required"),
            preffered_course: yup.string().required("Preffered Course is Required"),
            preferred_country: yup.string().required("Preffered Country is Required"),
            // preffered_course_level: yup.object().required("Course Level is required").typeError("Please choose a Course"),
            // intake: yup.object().required("Intake is required").typeError("Please choose a Course"),
            country_of_birth: yup.object().required("Country of Birth is required").typeError("Please choose a Course"),
            country_of_residence: yup.object().required("Country of Residence is required").typeError("Please choose a Course"),
            source: yup.object().required("Lead Source is required").typeError("Please choose a Course"),

        })
    } else {
        scheme = yup.object().shape({
            name: yup.string().required("Name is Required"),
            email: yup.string().email("Invalid email format").required("Email is Required"),
            alt_phone: yup.string().test('not-equal', 'Alternate number must be different from mobile number', function (value) {
                return value !== this.parent.phone;
            }),
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
    }



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
            if (e) {
                if (typeof response?.data?.data !== "undefined") {
                    return response?.data?.data
                } else {
                    return [];
                }
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


    // console.log('here');

    const onSubmit = async (data) => {

        console.log(data);

        setLoading(true)
        let dob = ''
        if (data?.dob) {
            dob = moment(data?.dob).format('YYYY-MM-DD')
        }

        let passport_exp_date = ''
        if (data?.passport_expiry) {
            passport_exp_date = moment(data?.passport_expiry).format('YYYY-MM-DD')
        }

        let dataToSubmit = {
            title: data?.title?.name,
            name: data?.name,
            email: data?.email,

            phone_country_code: code,
            phone_number: phone,

            alternate_phone_country_code: altCode,
            alternate_phone_number: altPhone,

            whatsapp_country_code: whatsappCode,
            whatsapp_number: whatsapp,

            preferred_course: data?.preffered_course,
            preferred_countries: data?.preferred_country,

            passport: data?.passport_number,
            passport_exp_date: passport_exp_date,

            // course_level_id: data?.preffered_course_level?.id || null,
            // intake_id: data?.intake?.id,

            date_of_birth: dob,
            address: data?.address,
            city: data?.city,

            country_of_birth_id: data?.country_of_birth?.id || null,
            country_of_residence_id: data?.country_of_residence?.id || null,

            referrance_from: data?.reference,

            source_id: data?.source?.id || null,

            agency_id: data?.source?.name == 'Agency' ? data?.agency?.id : null || null,
            referred_student_id: data?.source?.name == 'Referral' ? data?.student?.id : null || null,
            referral_university_id: data?.source?.name == 'University' ? data?.referred_university?.id : null || null,
            // country_id: data?.country?.id,

            note: data?.note
        }

        // console.log(dataToSubmit);

        let action;

        if (editId > 0) {
            dataToSubmit['id'] = editId;
            if (from == 'app') {
                dataToSubmit['applicant_data_submitted'] = 1;
            }
            action = LeadApi.update(dataToSubmit)
        } else {
            action = LeadApi.add(dataToSubmit)
        }
        action.then((response) => {
            // console.log(response);
            if (response?.data?.data) {
                toast.success(editId > 0 ? 'Lead Has Been Successfully Updated ' : 'Lead Has Been Successfully Created')
                if (handleRefresh) {
                    handleRefresh()
                } else {
                    setRefresh(!refresh)
                }
                if (handleLeadRefresh) {
                    handleLeadRefresh()
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

    // const [dataLoading, setDataLoading] = useState(false)

    const getDetails = async () => {
        setDataLoading(true)
        const response = await LeadApi.view({ id: editId })
        if (response?.data?.data) {
            let data = response?.data?.data

            setcurrentTitle(data?.title)

            // console.log(data);
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

            setValue('preferred_country', data?.preferred_countries)
            setValue('preffered_course', data?.preferred_course)

            // setValue('preffered_course_level', data?.course_level)
            // setValue('intake', data?.intake)
            setValue('passport_number', data?.passport)
            setValue('passport_expiry', data?.passport_exp_date)

            setValue('dob', data?.date_of_birth)

            setValue('source', data?.lead_source)
            setValue('student', data?.referredStudent)
            setValue('agency', data?.agency)
            setValue('referred_university', data?.referred_university)
            setValue('reference', data?.referrance_from)

            setValue('country_of_birth', data?.country_of_birth)
            setValue('country_of_residence', data?.country_of_residence)

            setValue('city', data?.city)
            setValue('address', data?.address)
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
    const setTitleValue = () => {
        let getTitle = titles?.find((obj => obj?.name == currentTitle))
        setValue('title', getTitle)
    }

    const getOptionLabel = (option) => {
        return option.student_code ? `${option.name} (${option.student_code})` : option.name;
    };

    const disableSpecificDate = (date) => {
        return moment(date).isBefore(moment(), 'day');
    }

    const disableSpecificDateForDob = (date) => {
        return moment(date).isAfter(moment().subtract(14, 'years'), 'day');
    }

    useEffect(() => {
        setTitleValue()
    }, [titles])

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
                    <LoadingEdit leftMD={5} rightMD={12} item={items} />
                    :
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className='form_group d-flex align-items-center frm-nam-fild '>

                            <div className='frm-nam-select' >
                                <svg className='author' xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M13.4444 17C13.4444 14.5454 11.4546 12.5556 9 12.5556C6.5454 12.5556 4.55556 14.5454 4.55556 17M13.4444 17H14.1583C15.152 17 15.6489 17 16.0288 16.8064C16.3633 16.636 16.636 16.3633 16.8064 16.0288C17 15.6489 17 15.152 17 14.1583V3.8417C17 2.84799 17 2.3504 16.8064 1.97049C16.636 1.63598 16.3633 1.36421 16.0288 1.19377C15.6485 1 15.1514 1 14.1557 1H3.84462C2.84897 1 2.35077 1 1.97049 1.19377C1.63598 1.36421 1.36421 1.63598 1.19377 1.97049C1 2.35077 1 2.84897 1 3.84462V14.1557C1 15.1514 1 15.6485 1.19377 16.0288C1.36421 16.3633 1.63598 16.636 1.97049 16.8064C2.3504 17 2.84799 17 3.8417 17H4.55556M13.4444 17H4.55556M9 9.88889C7.52724 9.88889 6.33333 8.69498 6.33333 7.22222C6.33333 5.74946 7.52724 4.55556 9 4.55556C10.4728 4.55556 11.6667 5.74946 11.6667 7.22222C11.6667 8.69498 10.4728 9.88889 9 9.88889Z" stroke="#0B0D23" strokeWidth="1.2" strokeLinecap="round" stroke-linejoin="round" />
                                </svg>
                                <SelectX
                                    // menuPlacement='top'
                                    loadOptions={fetchNameTitles}
                                    control={control}
                                    name={'title'}
                                    defaultValue={watch('title')}
                                    placeholder={'Title'}
                                />
                                {errors.title && <span className='form-validation'>{errors.title.message}</span>}
                            </div>


                            <TextInput placeholder='Your Name' control={control} {...register('name', { required: 'The Name field is required' })}
                                value={watch('name')} />
                            {errors.name && <span className='form-validation'>{errors.name.message}</span>}



                        </div>






                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                            <div className='application-input'>
                                <a className='form-text'>Email</a>
                                {/* className='form_group */}
                                <Grid className='mb-5 forms-data' >
                                    <TextInput placeholder='' control={control} {...register('email', {
                                        required: 'Please enter your email',
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: 'Please enter valid email address',
                                        },
                                    })}
                                        value={watch('email')} />
                                    {errors.email && <span className='form-validation'>{errors.email.message}</span>}
                                </Grid>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-0'>
                            <div className='application-input'>
                                <a className='form-text'>Country of Birth</a>
                                {/* className='form_group */}
                                <Grid className='mb-5 forms-data' >
                                    <SelectX
                                        placeholder=''
                                        menuPlacement='top'
                                        loadOptions={fetchGlobalCountry}
                                        control={control}
                                        name={'country_of_birth'}
                                        defaultValue={watch('country_of_birth')}
                                    />
                                    {errors.country_of_birth && <span className='form-validation'>{errors.country_of_birth.message}</span>}

                                </Grid>
                            </div>
                            <div className='application-input'>
                                <a className='form-text'>Country of Residence</a>
                                {/* className='form_group */}
                                <Grid className='mb-5 forms-data' >

                                    <AsyncSelect
                                        placeholder=''
                                        name={'country_of_residence'}
                                        defaultValue={watch('country_of_residence')}
                                        isClearable
                                        defaultOptions
                                        loadOptions={fetchGlobalCountry}
                                        getOptionLabel={(e) => e.name}
                                        getOptionValue={(e) => e.id}
                                        onChange={handleResidenceChange}
                                    />
                                    {/* <SelectX
                                    placeholder='Country of Residence'
                                    menuPlacement='top'
                                    loadOptions={fetchGlobalCountry}
                                    control={control}
                                    name={'country_of_residence'}
                                    defaultValue={watch('country_of_residence')}
                                /> */}
                                    {errors.country_of_residence && <span className='form-validation'>{errors.country_of_residence.message}</span>}


                                </Grid>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-0'>
                            <div className='application-input'>
                                <a className='form-text'>Enter Mobile Number</a>
                                {/* className='form_group */}
                                <Grid className='mb-5 forms-data' >
                                    <PhoneInput
                                        {...register('phone', { required: 'Please enter your mobile number' })}
                                        international
                                        // autoFormat
                                        placeholder=""
                                        // country="global"
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
                            </div>
                            <div className='application-input'>
                                <a className='form-text'>Enter Alternate Number</a>
                                {/* className='form_group */}
                                <Grid className='mb-5 forms-data' >
                                    <PhoneInput
                                        {...register('alt_phone')}

                                        international
                                        // autoFormat
                                        placeholder=""
                                        // country="in"
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
                            </div>
                        </div>


                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-0'>
                            <div className='application-input'>
                                <a className='form-text'>Enter Whatsapp Number</a>
                                {/* className='form_group */}
                                <Grid className='mb-5 forms-data' >
                                    <PhoneInput
                                        {...register('whatsapp')}

                                        international
                                        // autoFormat
                                        placeholder=""
                                        // country="in"
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
                            </div>
                            <div className='application-input'>
                                <a className='form-text'>Preferred Countries</a>
                                {/* className='form_group */}
                                <Grid className='mb-5 forms-data' >
                                    <TextInput placeholder='' control={control} {...register('preferred_country')}
                                        value={watch('preferred_country')} />
                                    {errors.preferred_country && <span className='form-validation'>{errors.preferred_country.message}</span>}

                                </Grid>
                            </div>
                        </div>



                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-0'>

                            <div className='application-input'>
                                <a className='form-text'>Preferred Courses</a>
                                <Grid className='mb-5 forms-data' >
                                    <TextInput placeholder='' control={control} {...register('preffered_course')}
                                        value={watch('preffered_course')} />

                                    {errors.preffered_course && <span className='form-validation'>{errors.preffered_course.message}</span>}
                                </Grid>
                            </div>
                            <div className='application-input'>
                                <a className='form-text'>Date of Birth</a>
                                {/* className='form_group */}
                                <Grid className='mb-5 forms-data' >
                                    <DateInput
                                        shouldDisableDate={disableSpecificDateForDob}
                                        placeholder=''
                                        control={control}
                                        name="dob"
                                        value={watch('dob')}
                                    />
                                    {errors.dob && <span className='form-validation'>{errors.dob.message}</span>}
                                </Grid>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-0'>

                            <div className='application-input'>
                                <a className='form-text'>Passport Number</a>
                                <Grid className='mb-5 forms-data' >
                                    <TextInput placeholder='' control={control} {...register('passport_number')}
                                        value={watch('passport_number')} />

                                    {errors.passport_number && <span className='form-validation'>{errors.passport_number.message}</span>}
                                </Grid>
                            </div>
                            <div className='application-input'>
                                <a className='form-text'>Passport Expiry Date</a>
                                {/* className='form_group */}
                                <Grid className='mb-5 forms-data' >
                                    <DateInput
                                        shouldDisableDate={disableSpecificDate}
                                        placeholder=''
                                        control={control}
                                        name="passport_expiry"
                                        value={watch('passport_expiry')}
                                    />
                                    {errors.passport_expiry && <span className='form-validation'>{errors.passport_expiry.message}</span>}
                                </Grid>
                            </div>
                        </div>


                        {/* intake and course level */}
                        {/* <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='form_group frm-sel-icon-stl'>
                                <svg className='sel-icon' xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                                    <path d="M1 6.66667H17M1 6.66667V14.978C1 16.0358 1 16.5645 1.21799 16.9686C1.40973 17.324 1.71547 17.6132 2.0918 17.7943C2.5192 18 3.07899 18 4.19691 18H13.8031C14.921 18 15.48 18 15.9074 17.7943C16.2837 17.6132 16.5905 17.324 16.7822 16.9686C17 16.5649 17 16.037 17 14.9812V6.66667M1 6.66667V5.9113C1 4.85342 1 4.32409 1.21799 3.92003C1.40973 3.56461 1.71547 3.27586 2.0918 3.09477C2.51962 2.88889 3.08009 2.88889 4.2002 2.88889H5M17 6.66667V5.90819C17 4.85238 17 4.32369 16.7822 3.92003C16.5905 3.56461 16.2837 3.27586 15.9074 3.09477C15.4796 2.88889 14.9203 2.88889 13.8002 2.88889H13M13 1V2.88889M13 2.88889H5M5 1V2.88889" stroke="#232648" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                                </svg>
                                <AsyncSelect
                                    placeholder='Intakes'
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
                            <div className='form_group frm-sel-icon-stl'>

                                <svg className='sel-icon' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 9.7998V19.9998M12 9.7998C12 8.11965 12 7.27992 12.327 6.63818C12.6146 6.0737 13.0732 5.6146 13.6377 5.32698C14.2794 5 15.1196 5 16.7998 5H19.3998C19.9599 5 20.2401 5 20.454 5.10899C20.6422 5.20487 20.7948 5.35774 20.8906 5.5459C20.9996 5.75981 21 6.04004 21 6.6001V15.4001C21 15.9601 20.9996 16.2398 20.8906 16.4537C20.7948 16.6419 20.6425 16.7952 20.4543 16.8911C20.2406 17 19.961 17 19.402 17H16.5693C15.6301 17 15.1597 17 14.7334 17.1295C14.356 17.2441 14.0057 17.4317 13.701 17.6821C13.3568 17.965 13.096 18.3557 12.575 19.1372L12 19.9998M12 9.7998C12 8.11965 11.9998 7.27992 11.6729 6.63818C11.3852 6.0737 10.9263 5.6146 10.3618 5.32698C9.72004 5 8.87977 5 7.19961 5H4.59961C4.03956 5 3.75981 5 3.5459 5.10899C3.35774 5.20487 3.20487 5.35774 3.10899 5.5459C3 5.75981 3 6.04004 3 6.6001V15.4001C3 15.9601 3 16.2398 3.10899 16.4537C3.20487 16.6419 3.35774 16.7952 3.5459 16.8911C3.7596 17 4.03901 17 4.59797 17H7.43073C8.36994 17 8.83942 17 9.26569 17.1295C9.64306 17.2441 9.99512 17.4317 10.2998 17.6821C10.6426 17.9638 10.9017 18.3526 11.4185 19.1277L12 19.9998" stroke="#0B0D23" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                                </svg>
                                <SelectX
                                    placeholder={'Course Level'}
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
                        </div> */}


                        {/* 
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='form_group frm-conn-stl'>

                            <input placeholder='State/Province' control={control} name="state"
                                // disabled={!watch('country')}
                                value={watch('state')} />
                            {errors.state && <span className='form-validation'>{errors.state.message}</span>}

                        </div>
                        <div className='form_group frm-conn-stl'>

                            <input placeholder='Zipcode' control={control} name="zipcode"
                                // disabled={!watch('country')}
                                value={watch('zipcode')} />
                            {errors.zipcode && <span className='form-validation'>{errors.zipcode.message}</span>}

                        </div>
                    </div> */}

                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                            <div className='application-input'>
                                <a className='form-text'>City</a>
                                {/* className='form_group */}
                                <Grid className='mb-5 forms-data' >
                                    <TextInput placeholder='' control={control} {...register('city')}
                                        value={watch('city')} />
                                    {errors.city && <span className='form-validation'>{errors.city.message}</span>}
                                </Grid>
                            </div>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                            <div className='application-input'>
                                <a className='form-text'>Address</a>
                                <Grid className='mb-5 forms-data' >
                                    <TextField placeholder='' multiline rows={2} fullWidth control={control}  {...register('address')}
                                        value={watch('address') || ''} />
                                    {errors.address && <span className='form-validation'>{errors.address.message}</span>}
                                </Grid>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-0">
                            <div className='application-input'>
                                <a className='form-text'>Lead Source</a>
                                <Grid className='mb-5 forms-data' >
                                    <AsyncSelect
                                        placeholder=''
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
                                    {/* </div> */}
                                    {errors.source && <span className='form-validation'>{errors.source.message}</span>}
                                </Grid>
                            </div>

                            <div className='application-input'>
                                <a className='form-text'>How did you hear about us?</a>
                                <Grid className='mb-5 forms-data' >
                                    <ReactSelector
                                        placeholder=''
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
                                    {errors.reference && <span className='form-validation'>{errors.reference.message}</span>}
                                </Grid>
                            </div>

                        </div>

                        {
                            watch('source')?.name == 'Referral' &&
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-0">
                                <div className='application-input'>
                                    <a className='form-text'>Referred Student</a>
                                    <Grid className='mb-5 forms-data' >
                                        <AsyncSelect
                                            placeholder=''
                                            name={'student'}
                                            defaultValue={watch('student')}
                                            isClearable
                                            defaultOptions
                                            loadOptions={fetchStudents}
                                            getOptionLabel={getOptionLabel}
                                            getOptionValue={(e) => e.id}
                                            onChange={(e) => setValue('student', e)}
                                        />
                                    </Grid>
                                </div>
                            </div>
                        }


                        {
                            watch('source')?.name == 'Agency' &&
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-0">
                                <div className='application-input'>
                                    <a className='form-text'>Referred Angency</a>
                                    <Grid className='mb-5 forms-data' >
                                        <SelectX
                                            placeholder=''
                                            menuPlacement='auto'
                                            loadOptions={fetchAgencies}
                                            control={control}
                                            name={'agency'}
                                            defaultValue={watch('agency')}
                                        />
                                    </Grid>
                                </div>
                            </div>
                        }
                        {
                            watch('source')?.name == 'University' &&
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-0">
                                <div className='application-input'>
                                    <a className='form-text'>Referred University</a>
                                    <Grid className='mb-5 forms-data' >
                                        <SelectX
                                            placeholder=''
                                            menuPlacement='auto'
                                            loadOptions={fetchUniversities}
                                            control={control}
                                            name={'referred_university'}
                                            defaultValue={watch('referred_university')}
                                        />
                                    </Grid>
                                </div>
                            </div>
                        }


                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                            <div className='application-input'>
                                <a className='form-text'>Note</a>
                                <Grid className='mb-5 forms-data' >
                                    <TextField placeholder='' multiline rows={2} fullWidth control={control}  {...register('note')}
                                        value={watch('note') || ''} />
                                </Grid>
                            </div>
                        </div>


                        <Grid pb={3}  >
                            <LoadingButton className='save-btn' loading={loading} disabled={loading} type='submit'  >
                                {
                                    loading ?
                                        <Grid display={'flex'} justifyContent={'center'}><div className="spinner"></div></Grid>
                                        :
                                        <>
                                            Submit <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                                                <path d="M7.875 13.5H19.125M19.125 13.5L14.625 9M19.125 13.5L14.625 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </>
                                }
                            </LoadingButton>
                            <Button className='cancel-btn' onClick={handleClose}>Cancel <svg svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9 9L11.9999 11.9999M11.9999 11.9999L14.9999 14.9999M11.9999 11.9999L9 14.9999M11.9999 11.9999L14.9999 9M4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4801 4 18.9079 4.21799C19.2842 4.40973 19.5905 4.71547 19.7822 5.0918C20.0002 5.51962 20.0002 6.07967 20.0002 7.19978V16.7998C20.0002 17.9199 20.0002 18.48 19.7822 18.9078C19.5905 19.2841 19.2842 19.5905 18.9079 19.7822C18.4805 20 17.9215 20 16.8036 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                            </svg></Button>

                        </Grid>
                    </form>
            }


        </div >
    );
}
