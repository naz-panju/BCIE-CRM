// import DateInput from '@/Form/DateInput'
// import SelectX from '@/Form/SelectX'
// import TextInput from '@/Form/TextInput'
// import { ListingApi } from '@/data/Endpoints/Listing'
// import { Button, Grid, TextField, Typography } from '@mui/material'
// import React, { useState } from 'react'
// import 'react-phone-input-2/lib/style.css'
// import PhoneInput from 'react-phone-input-2'
// import moment from 'moment'
// import { LeadApi } from '@/data/Endpoints/Lead'
// import toast from 'react-hot-toast'
// import * as yup from "yup";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useEffect } from 'react'
// import { LoadingButton } from '@mui/lab'
// import LoadingEdit from '@/Components/Common/Loading/LoadingEdit'
// import ReactSelector from 'react-select';
// import { StudentApi } from '@/data/Endpoints/Student'
// import AsyncSelect from "react-select/async";




// function Detail({ handleClose, setRefresh, refresh, editId, handleRefresh, from }) {


//     const [phone, setPhone] = useState()
//     const [code, setCode] = useState()

//     const [altPhone, setAltPhone] = useState()
//     const [altCode, setAltCode] = useState()

//     const [whatsapp, setWhatsapp] = useState()
//     const [whatsappCode, setWhatsappCode] = useState()


//     let scheme

//     if (from == 'app') {
//         scheme = yup.object().shape({
//             name: yup.string().required("Name is Required"),
//             email: yup.string().email("Invalid email format").required("Email is Required"),
//             dob: yup.string().required('Date of Birth is Required'),
//             address: yup.string().required('Address is Required'),
//             reference: yup.string().required('Reference is Required'),
//             phone: yup.string().required('Phone number is Required'),
//             alt_phone: yup.string().test('not-equal', 'Alternate number must be different from mobile number', function (value) {
//                 return value !== this.parent.phone;
//             }),
//             preffered_course: yup.string().required("Preffered Course is Required"),
//             preffered_country: yup.string().required("Preffered Country is Required"),
//             // assigned_to: yup.object().required("Please Choose an User").typeError("Please choose a User"),
//             // country: yup.object().required("Please Choose a Country").typeError("Please choose a User"),
//             // institute: yup.object().required("Please Choose a Country").typeError("Please choose an University"),
//             preffered_course_level: yup.object().required("Course Level is required").typeError("Please choose a Course"),
//             intake: yup.object().required("Intake is required").typeError("Please choose a Course"),
//             country_of_birth: yup.object().required("Country of Birth is required").typeError("Please choose a Course"),
//             country_of_residence: yup.object().required("Country of Residence is required").typeError("Please choose a Course"),
//             source: yup.object().required("Lead Source is required").typeError("Please choose a Course"),

//         })
//     } else {
//         scheme = yup.object().shape({
//             name: yup.string().required("Name is Required"),
//             email: yup.string().email("Invalid email format").required("Email is Required"),
//             alt_phone: yup.string().test('not-equal', 'Alternate number must be different from mobile number', function (value) {
//                 return value !== this.parent.phone;
//             }),
//             // phone: yup.string().required('Phone Number is Required'),
//             // alt_phone: yup.string().test('not-equal', 'Alternate number must be different from mobile number', function (value) {
//             //     return value !== this.parent.phone;
//             // }),
//             preffered_course: yup.string().required("Preffered Course is Required"),
//             // assigned_to: yup.object().required("Please Choose an User").typeError("Please choose a User"),
//             // country: yup.object().required("Please Choose a Country").typeError("Please choose a User"),
//             // institute: yup.object().required("Please Choose a Country").typeError("Please choose an University"),
//             // course: yup.object().required("Please Choose a Country").typeError("Please choose a Course"),
//         })
//     }



//     const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })
//     const phoneValue = watch('phone');

//     const [referenceOption, setreferenceOption] = useState([])


//     const [selectedCountryID, setselectedCountryID] = useState()
//     const [selectedInstituteID, setselectedInstituteID] = useState()
//     const [selectedCourseID, setselectedCourseID] = useState()

//     const [loading, setLoading] = useState(false)
//     const [dataLoading, setDataLoading] = useState(false)

//     const fetchReference = (e) => {
//         ListingApi.reference({ keyword: e }).then(response => {
//             if (typeof response?.data?.data !== "undefined") {
//                 setreferenceOption(response?.data?.data)
//             } else {
//                 return [];
//             }
//         })
//     }

//     const fetchCourseLevel = (e) => {
//         return ListingApi.courseLevel({ keyword: e }).then(response => {
//             if (typeof response?.data?.data !== "undefined") {
//                 return response?.data?.data
//             } else {
//                 return [];
//             }
//         })
//     }

//     const fetchStudents = (e) => {
//         return StudentApi.list({ keyword: e }).then(response => {
//             if (typeof response?.data?.data !== "undefined") {
//                 return response?.data?.data
//             } else {
//                 return [];
//             }
//         })
//     }

//     const fetchAgencies = (e) => {
//         return ListingApi.agencies({ keyword: e }).then(response => {
//             if (typeof response?.data?.data !== "undefined") {
//                 return response?.data?.data
//             } else {
//                 return [];
//             }
//         })
//     }

//     const fetchSources = (e) => {
//         return ListingApi.leadSource({ keyword: e }).then(response => {
//             if (typeof response?.data?.data !== "undefined") {
//                 return response?.data?.data
//             } else {
//                 return [];
//             }
//         })
//     }

//     const fetchGlobalCountry = (e) => {
//         return ListingApi.globalCountry({ keyword: e }).then(response => {
//             // console.log(response?.data?.data);
//             if (response?.data?.data) {
//                 return response.data.data;
//             } else {
//                 return [];
//             }
//         })
//     }


//     const fetchNameTitles = (e, title) => {
//         return ListingApi.nameTitle({ keyword: e, limit: 30 }).then(response => {
//             if (typeof response.data.data !== "undefined") {
//                 // settitles(response.data.data)
//                 return response.data.data;
//             } else {
//                 return [];
//             }
//         })
//     }

//     const fetchIntakes = (e) => {
//         return ListingApi.intakes({ keyword: e, }).then(response => {
//             if (typeof response.data.data !== "undefined") {
//                 return response.data.data;
//             } else {
//                 return [];
//             }
//         })
//     }

//     const handlePhoneNumber = (value, country) => {
//         if (!value) {
//             setPhone('');
//             setValue('phone', '')
//             return;
//         }

//         const { dialCode } = country;
//         setCode(dialCode)
//         setValue('phone', value)
//         if (editId == 0) {
//             setValue('whatsapp', value)
//             setWhatsappCode(dialCode)
//             setValue('whatsapp', value)
//             if (value.startsWith(dialCode)) {
//                 const trimmedPhone = value.slice(dialCode.length);
//                 setWhatsapp(trimmedPhone);
//             } else {
//                 setWhatsapp(value);
//             }
//         }
//         if (value.startsWith(dialCode)) {
//             const trimmedPhone = value.slice(dialCode.length);
//             setPhone(trimmedPhone);
//         } else {
//             setPhone(value);
//         }
//         // Trigger validation for the 'phone' field
//         trigger('phone');
//     };

//     // console.log(whatsappCode,whatsapp);

//     const handleAltPhoneNumber = (value, country) => {
//         if (!value) {
//             setAltPhone('');
//             setValue('alt_phone', '')
//             return;
//         }

//         const { dialCode } = country;
//         setAltCode(dialCode)
//         setValue('alt_phone', value)
//         if (value.startsWith(dialCode)) {
//             const trimmedPhone = value.slice(dialCode.length);
//             setAltPhone(trimmedPhone);
//         } else {
//             setAltPhone(value);
//         }
//         // Trigger validation for the 'phone' field
//         trigger('alt_phone');
//     };

//     const handleWhatsAppNumber = (value, country) => {
//         if (!value) {
//             setWhatsapp('');
//             setValue('whatsapp', '')
//             return;
//         }

//         const { dialCode } = country;
//         setWhatsappCode(dialCode)
//         setValue('whatsapp', value)
//         if (value.startsWith(dialCode)) {
//             const trimmedPhone = value.slice(dialCode.length);
//             setWhatsapp(trimmedPhone);
//         } else {
//             setWhatsapp(value);
//         }
//         // Trigger validation for the 'phone' field
//         trigger('whatsapp');
//     };

//     const handleSourseChange = (data) => {
//         setValue('source', data || '')
//         setValue('student', '')
//         setValue('agency', '')
//     }

//     const handleinTakeChange = (data) => {
//         setValue('intake', data || '')

//     }


//     const onSubmit = async (data) => {

//         setLoading(true)
//         let dob = ''
//         if (data?.dob) {
//             dob = moment(data?.dob).format('YYYY-MM-DD')
//         }


//         let dataToSubmit = {
//             title: data?.title?.name,
//             name: data?.name,
//             email: data?.email,

//             phone_country_code: code,
//             phone_number: phone,

//             alternate_phone_country_code: altCode,
//             alternate_phone_number: altPhone,

//             whatsapp_country_code: whatsappCode,
//             whatsapp_number: whatsapp,

//             preferred_course: data?.preffered_course,
//             preferred_countries: data?.preffered_country,

//             course_level_id: data?.preffered_course_level?.id || null,
//             intake_id: data?.intake?.id,

//             date_of_birth: dob,
//             address: data?.address,
//             // zipcode: data?.zipcode,
//             // state: data?.state,
//             country_of_birth_id: data?.country_of_birth?.id || null,
//             country_of_residence_id: data?.country_of_residence?.id || null,

//             referrance_from: data?.reference,

//             source_id: data?.source?.id || null,
//             agency_id: data?.agency?.id || null,
//             referred_student_id: data?.student?.id || null,
//             // country_id: data?.country?.id,

//             note: data?.note
//         }

//         console.log(dataToSubmit);

//         let action;

//         if (editId > 0) {
//             dataToSubmit['id'] = editId;
//             if (from == 'app') {
//                 dataToSubmit['applicant_data_submitted'] = 1;
//             }
//             action = LeadApi.update(dataToSubmit)
//         } else {
//             action = LeadApi.add(dataToSubmit)
//         }
//         action.then((response) => {
//             console.log(response);
//             if (response?.data?.data) {
//                 toast.success(editId > 0 ? 'Lead Has Been Successfully Updated ' : 'Lead Has Been Successfully Created')
//                 if (handleRefresh) {
//                     handleRefresh()
//                 } else {
//                     setRefresh(!refresh)
//                 }
//                 reset()
//                 handleClose()
//                 setLoading(false)
//             } else {
//                 toast.error(response?.response?.data?.message)
//                 setLoading(false)
//             }
//         }).catch((error) => {
//             console.log(error);
//             toast.error(error?.message)
//             setLoading(false)
//         })

//     }

//     const getDetails = async () => {
//         setDataLoading(true)
//         const response = await LeadApi.view({ id: editId })
//         if (response?.data?.data) {
//             let data = response?.data?.data
//             // console.log(data);
//             // console.log(`+${data?.phone_country_code}${data?.phone_number}`);
//             setValue('name', data?.name)
//             setValue('email', data?.email)

//             setValue('phone', `+${data?.phone_country_code}${data?.phone_number}`)
//             setPhone(data?.phone_number)
//             setCode(data?.phone_country_code)

//             setValue('alt_phone', `+${data?.alternate_phone_country_code}${data?.alternate_phone_number}`)
//             setAltPhone(data?.alternate_phone_number)
//             setAltCode(data?.alternate_phone_country_code)

//             setValue('whatsapp', `+${data?.whatsapp_country_code}${data?.whatsapp_number}`)
//             setWhatsapp(data?.whatsapp_number)
//             setWhatsappCode(data?.whatsapp_country_code)

//             setValue('preffered_country', data?.preferred_countries)
//             setValue('preffered_course_level', data?.course_level)
//             setValue('preffered_course', data?.preferred_course)

//             setValue('intake', data?.intake)
//             setValue('dob', data?.date_of_birth)

//             setValue('source', data?.lead_source)
//             setValue('student', data?.referredStudent)
//             setValue('agency', data?.agency)
//             setValue('reference', data?.referrance_from)

//             setValue('country_of_birth', data?.country_of_birth)
//             setValue('country_of_residence', data?.country_of_residence)

//             // setValue('state', data?.state)
//             setValue('address', data?.address)
//             setValue('note', data?.note)

//         }
//         setDataLoading(false)
//     }

//     // useEffect(() => {
//     //     if (watch('country')) {
//     //         setselectedCountryID(watch('country')?.id)
//     //     } if (watch('course')) {
//     //         setselectedCourseID(watch('course')?.id)
//     //     } if (watch('institute')) {
//     //         setselectedInstituteID(watch('institute')?.id)
//     //     }
//     // }, [watch('source'), watch('course'), watch('institute')])

//     useEffect(() => {
//         if (editId > 0) {
//             getDetails()
//         }
//         fetchReference()
//         // setValue('alt_phone','234')
//     }, [editId])

//     const items = [
//         { label: 'Name' },
//         { label: 'Email Address' },
//         { label: 'Mobile Number' },
//         { label: 'Alternate Mobile Number' },
//         { label: 'Whatsapp Number' },
//         { label: 'Preferred Countries' },
//         { label: 'Preferred Courses' },
//         { label: 'Lead Source' },
//         { label: 'How did you know about us?' },
//         { label: 'Note', multi: true },
//     ]

    

//     return (
//         <div className='form-data-cntr'>

//             {/* <button type='reset' onClick={() => setLoading(false)}>click</button> */}
//             {
//                 dataLoading ?
//                     <LoadingEdit leftMD={5} rightMD={7} item={items} />
//                     :
//                     <form onSubmit={handleSubmit(onSubmit)}>

//                         <div className='form_group d-flex align-items-center frm-nam-fild '>

//                             <div className='frm-nam-select' >
//                                 <svg className='author' xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
//                                     <path d="M13.4444 17C13.4444 14.5454 11.4546 12.5556 9 12.5556C6.5454 12.5556 4.55556 14.5454 4.55556 17M13.4444 17H14.1583C15.152 17 15.6489 17 16.0288 16.8064C16.3633 16.636 16.636 16.3633 16.8064 16.0288C17 15.6489 17 15.152 17 14.1583V3.8417C17 2.84799 17 2.3504 16.8064 1.97049C16.636 1.63598 16.3633 1.36421 16.0288 1.19377C15.6485 1 15.1514 1 14.1557 1H3.84462C2.84897 1 2.35077 1 1.97049 1.19377C1.63598 1.36421 1.36421 1.63598 1.19377 1.97049C1 2.35077 1 2.84897 1 3.84462V14.1557C1 15.1514 1 15.6485 1.19377 16.0288C1.36421 16.3633 1.63598 16.636 1.97049 16.8064C2.3504 17 2.84799 17 3.8417 17H4.55556M13.4444 17H4.55556M9 9.88889C7.52724 9.88889 6.33333 8.69498 6.33333 7.22222C6.33333 5.74946 7.52724 4.55556 9 4.55556C10.4728 4.55556 11.6667 5.74946 11.6667 7.22222C11.6667 8.69498 10.4728 9.88889 9 9.88889Z" stroke="#0B0D23" strokeWidth="1.2" strokeLinecap="round" stroke-linejoin="round" />
//                                 </svg>
//                                 <SelectX
//                                     // menuPlacement='top'
//                                     loadOptions={fetchNameTitles}
//                                     control={control}
//                                     name={'title'}
//                                     defaultValue={watch('title')}
//                                 />
//                                 {errors.title && <span className='form-validation'>{errors.title.message}</span>}
//                             </div>


//                             <input placeholder='Your Name' control={control} {...register('name', { required: 'The Name field is required' })}
//                                 value={watch('name')} />
//                             {errors.name && <span className='form-validation'>{errors.name.message}</span>}



//                         </div>




//                         <div className='form_group frm-conn-stl  '>

//                             <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 17 14" fill="none">
//                                 <path d="M1 3.5L7.3906 7.7604C8.0624 8.20827 8.9376 8.20827 9.6094 7.7604L16 3.5M3 12.6667H14C15.1046 12.6667 16 11.7712 16 10.6667V3C16 1.89543 15.1046 1 14 1H3C1.89543 1 1 1.89543 1 3V10.6667C1 11.7712 1.89543 12.6667 3 12.6667Z" stroke="#0B0D23" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
//                             </svg>
//                             <input placeholder='Type your email here' control={control} {...register('email', {
//                                 required: 'Please enter your email',
//                                 pattern: {
//                                     value: /^\S+@\S+$/i,
//                                     message: 'Please enter valid email address',
//                                 },
//                             })}
//                                 value={watch('email')} />
//                             {errors.email && <span className='form-validation'>{errors.email.message}</span>}


//                         </div>


//                         <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                             <div className='form_group'>
//                                 <PhoneInput
//                                     {...register('phone', { required: 'Please enter your mobile number' })}
//                                     international
//                                     // autoFormat
//                                     placeholder="Enter Mobile Number"
//                                     country="in"
//                                     value={watch('phone')}
//                                     onChange={handlePhoneNumber}
//                                     inputprops={{
//                                         autoFocus: true,
//                                         autoComplete: 'off',
//                                         // name: 'phone',
//                                         required: true,
//                                     }}
//                                     inputstyle={{
//                                         width: '100%',
//                                         height: '40px',
//                                         paddingLeft: '40px', // Adjust the padding to make space for the country symbol
//                                     }}
//                                     buttonstyle={{
//                                         border: 'none',
//                                         backgroundColor: 'transparent',
//                                         marginLeft: '5px',
//                                     }}
//                                 />
//                                 {errors.phone && <span className='form-validation'>{errors.phone.message}</span>}
//                             </div>
//                             <div className='form_group'>
//                                 <PhoneInput
//                                     {...register('alt_phone')}

//                                     international
//                                     // autoFormat
//                                     placeholder="Enter Alternate Number"
//                                     country="in"
//                                     value={watch('alt_phone')}
//                                     onChange={handleAltPhoneNumber}
//                                     inputprops={{
//                                         autoFocus: true,
//                                         autoComplete: 'off',
//                                         name: 'phone',
//                                         required: true,
//                                     }}
//                                     inputstyle={{
//                                         width: '100%',
//                                         height: '40px',
//                                         paddingLeft: '40px', // Adjust the padding to make space for the country symbol
//                                     }}
//                                     buttonstyle={{
//                                         border: 'none',
//                                         backgroundColor: 'transparent',
//                                         marginLeft: '5px',
//                                     }}
//                                 />
//                                 {errors.alt_phone && <span className='form-validation'>{errors.alt_phone.message}</span>}
//                             </div>
//                         </div>


//                         <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                             <div className='form_group'>
//                                 <PhoneInput
//                                     {...register('whatsapp')}

//                                     international
//                                     // autoFormat
//                                     placeholder="Enter your number"
//                                     country="in"
//                                     value={watch('whatsapp')}
//                                     onChange={handleWhatsAppNumber}
//                                     inputprops={{
//                                         autoFocus: true,
//                                         autoComplete: 'off',
//                                         name: 'phone',
//                                         required: true,
//                                     }}
//                                     inputstyle={{
//                                         width: '100%',
//                                         height: '40px',
//                                         paddingLeft: '40px', // Adjust the padding to make space for the country symbol
//                                     }}
//                                     buttonstyle={{
//                                         border: 'none',
//                                         backgroundColor: 'transparent',
//                                         marginLeft: '5px',
//                                     }}
//                                 />
//                                 {errors.whatsapp && <span className='form-validation'>{errors.whatsapp.message}</span>}

//                             </div>
//                             <div className='form_group frm-conn-stl '>
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                     <path d="M3 12H8M3 12C3 16.9706 7.02944 21 12 21M3 12C3 7.02944 7.02944 3 12 3M8 12H16M8 12C8 16.9706 9.79086 21 12 21M8 12C8 7.02944 9.79086 3 12 3M16 12H21M16 12C16 7.02944 14.2091 3 12 3M16 12C16 16.9706 14.2091 21 12 21M21 12C21 7.02944 16.9706 3 12 3M21 12C21 16.9706 16.9706 21 12 21" stroke="#0B0D23" strokeWidth="1.2" strokeLinecap="round" stroke-linejoin="round" />
//                                 </svg>
//                                 <input placeholder='Preferred Countries' control={control} {...register('preffered_country')}
//                                     value={watch('preffered_country')} />
//                                 {errors.preffered_country && <span className='form-validation'>{errors.preffered_country.message}</span>}

//                             </div>
//                         </div>


//                         <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                             <div className='form_group frm-sel-icon-stl'>

//                                 <svg className='sel-icon' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                     <path d="M12 9.7998V19.9998M12 9.7998C12 8.11965 12 7.27992 12.327 6.63818C12.6146 6.0737 13.0732 5.6146 13.6377 5.32698C14.2794 5 15.1196 5 16.7998 5H19.3998C19.9599 5 20.2401 5 20.454 5.10899C20.6422 5.20487 20.7948 5.35774 20.8906 5.5459C20.9996 5.75981 21 6.04004 21 6.6001V15.4001C21 15.9601 20.9996 16.2398 20.8906 16.4537C20.7948 16.6419 20.6425 16.7952 20.4543 16.8911C20.2406 17 19.961 17 19.402 17H16.5693C15.6301 17 15.1597 17 14.7334 17.1295C14.356 17.2441 14.0057 17.4317 13.701 17.6821C13.3568 17.965 13.096 18.3557 12.575 19.1372L12 19.9998M12 9.7998C12 8.11965 11.9998 7.27992 11.6729 6.63818C11.3852 6.0737 10.9263 5.6146 10.3618 5.32698C9.72004 5 8.87977 5 7.19961 5H4.59961C4.03956 5 3.75981 5 3.5459 5.10899C3.35774 5.20487 3.20487 5.35774 3.10899 5.5459C3 5.75981 3 6.04004 3 6.6001V15.4001C3 15.9601 3 16.2398 3.10899 16.4537C3.20487 16.6419 3.35774 16.7952 3.5459 16.8911C3.7596 17 4.03901 17 4.59797 17H7.43073C8.36994 17 8.83942 17 9.26569 17.1295C9.64306 17.2441 9.99512 17.4317 10.2998 17.6821C10.6426 17.9638 10.9017 18.3526 11.4185 19.1277L12 19.9998" stroke="#0B0D23" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
//                                 </svg>
//                                 <SelectX
//                                     placeholder={'Course Level'}
//                                     menuPlacement='top'
//                                     loadOptions={fetchCourseLevel}
//                                     control={control}
//                                     // error={errors?.assigned_to?.id ? errors?.assigned_to?.message : false}
//                                     // error2={errors?.assigned_to?.message ? errors?.assigned_to?.message : false}
//                                     name={'preffered_course_level'}
//                                     defaultValue={watch('preffered_course_level')}
//                                 />
//                                 {errors.preffered_course_level && <span className='form-validation'>{errors.preffered_course_level.message}</span>}

//                             </div>
//                             <div className='form_group frm-conn-stl '>
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                     <path d="M3 15.0002V16.8C3 17.9201 3 18.4798 3.21799 18.9076C3.40973 19.2839 3.71547 19.5905 4.0918 19.7822C4.5192 20 5.07899 20 6.19691 20H21.0002M3 15.0002V5M3 15.0002L6.8534 11.7891L6.85658 11.7865C7.55366 11.2056 7.90288 10.9146 8.28154 10.7964C8.72887 10.6567 9.21071 10.6788 9.64355 10.8584C10.0105 11.0106 10.3323 11.3324 10.9758 11.9759L10.9822 11.9823C11.6357 12.6358 11.9633 12.9635 12.3362 13.1153C12.7774 13.2951 13.2685 13.3106 13.7207 13.1606C14.1041 13.0334 14.4542 12.7275 15.1543 12.115L21 7" stroke="#0B0D23" strokeWidth="1.2" strokeLinecap="round" stroke-linejoin="round" />
//                                 </svg>
//                                 <input placeholder='Preferred Courses' control={control} {...register('preffered_course')}
//                                     value={watch('preffered_course')} />

//                                 {errors.preffered_course && <span className='form-validation'>{errors.preffered_course.message}</span>}
//                             </div>
//                         </div>


//                         <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                             <div className='form_group frm-sel-icon-stl'>
//                                 <svg className='sel-icon' xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
//                                     <path d="M1 6.66667H17M1 6.66667V14.978C1 16.0358 1 16.5645 1.21799 16.9686C1.40973 17.324 1.71547 17.6132 2.0918 17.7943C2.5192 18 3.07899 18 4.19691 18H13.8031C14.921 18 15.48 18 15.9074 17.7943C16.2837 17.6132 16.5905 17.324 16.7822 16.9686C17 16.5649 17 16.037 17 14.9812V6.66667M1 6.66667V5.9113C1 4.85342 1 4.32409 1.21799 3.92003C1.40973 3.56461 1.71547 3.27586 2.0918 3.09477C2.51962 2.88889 3.08009 2.88889 4.2002 2.88889H5M17 6.66667V5.90819C17 4.85238 17 4.32369 16.7822 3.92003C16.5905 3.56461 16.2837 3.27586 15.9074 3.09477C15.4796 2.88889 14.9203 2.88889 13.8002 2.88889H13M13 1V2.88889M13 2.88889H5M5 1V2.88889" stroke="#232648" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
//                                 </svg>
//                                 <AsyncSelect
//                                     placeholder='Intakes'
//                                     name={'intake'}
//                                     defaultValue={watch('intake')}
//                                     // isClearable
//                                     defaultOptions
//                                     loadOptions={fetchIntakes}
//                                     getOptionLabel={(e) => e.name}
//                                     getOptionValue={(e) => e.id}
//                                     onChange={handleinTakeChange}
//                                 />
//                                 {errors.intake && <span className='form-validation'>{errors.intake.message}</span>}

//                             </div>
//                             <div className='form_group'>
//                                 <DateInput
//                                     placeholder='Date of Birth'
//                                     control={control}
//                                     name="dob"
//                                     value={watch('dob')}
//                                 />
//                                 {errors.dob && <span className='form-validation'>{errors.dob.message}</span>}
//                             </div>
//                         </div>

//                         <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                             <div className='form_group frm-sel-icon-stl'>
//                                 <svg className='sel-icon' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                     <path d="M5 9.92285C5 14.7747 9.24448 18.7869 11.1232 20.3252C11.3921 20.5454 11.5281 20.6568 11.7287 20.7132C11.8849 20.7572 12.1148 20.7572 12.271 20.7132C12.472 20.6567 12.6071 20.5463 12.877 20.3254C14.7557 18.7871 18.9999 14.7751 18.9999 9.9233C18.9999 8.08718 18.2625 6.32605 16.9497 5.02772C15.637 3.72939 13.8566 3 12.0001 3C10.1436 3 8.36301 3.7295 7.05025 5.02783C5.7375 6.32616 5 8.08674 5 9.92285Z" stroke="#0B0D23" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
//                                     <path d="M10 9C10 10.1046 10.8954 11 12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9Z" stroke="#0B0D23" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
//                                 </svg>
//                                 <SelectX
//                                     placeholder='Country of Birth'
//                                     menuPlacement='top'
//                                     loadOptions={fetchGlobalCountry}
//                                     control={control}
//                                     name={'country_of_birth'}
//                                     defaultValue={watch('country_of_birth')}
//                                 />
//                                 {errors.country_of_birth && <span className='form-validation'>{errors.country_of_birth.message}</span>}

//                             </div>
//                             <div className='form_group frm-conn-stl'>
//                                 <SelectX
//                                     placeholder='Country of Residence'
//                                     menuPlacement='top'
//                                     loadOptions={fetchGlobalCountry}
//                                     control={control}
//                                     name={'country_of_residence'}
//                                     defaultValue={watch('country_of_residence')}
//                                 />
//                                 {errors.country_of_residence && <span className='form-validation'>{errors.country_of_residence.message}</span>}

//                             </div>
//                         </div>


//                         {/* 
//                         <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                             <div className='form_group frm-conn-stl'>

//                                 <input placeholder='State/Province' control={control} name="state"
//                                     // disabled={!watch('country')}
//                                     value={watch('state')} />
//                                 {errors.state && <span className='form-validation'>{errors.state.message}</span>}

//                             </div>
//                             <div className='form_group frm-conn-stl'>

//                                 <input placeholder='Zipcode' control={control} name="zipcode"
//                                     // disabled={!watch('country')}
//                                     value={watch('zipcode')} />
//                                 {errors.zipcode && <span className='form-validation'>{errors.zipcode.message}</span>}

//                             </div>
//                         </div> */}

//                         <div className='form_group frm-text-conn-stl '>

//                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                 <path d="M12 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V12M9 15V12.5L17.75 3.75C18.4404 3.05964 19.5596 3.05964 20.25 3.75V3.75C20.9404 4.44036 20.9404 5.55964 20.25 6.25L15.5 11L11.5 15H9Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
//                             </svg>
//                             <textarea placeholder='Address' multiline rows={2} fullWidth control={control}  {...register('address')}
//                                 value={watch('address') || ''} />
//                             {errors.address && <span className='form-validation'>{errors.address.message}</span>}

//                         </div>



//                         {/* grid grid-cols-1 md:grid-cols-2 gap-4 */}
//                         <div className='form_group'>
//                             {/* <div className='form_group frm-sel-icon-stl'> */}

//                             {/* <svg className='sel-icon' xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
//                                     <path d="M6 9.75L11 12.25M11 4.75L6 7.25M13.5 16C12.1193 16 11 14.8807 11 13.5C11 12.1193 12.1193 11 13.5 11C14.8807 11 16 12.1193 16 13.5C16 14.8807 14.8807 16 13.5 16ZM3.5 11C2.11929 11 1 9.88071 1 8.5C1 7.11929 2.11929 6 3.5 6C4.88071 6 6 7.11929 6 8.5C6 9.88071 4.88071 11 3.5 11ZM13.5 6C12.1193 6 11 4.88071 11 3.5C11 2.11929 12.1193 1 13.5 1C14.8807 1 16 2.11929 16 3.5C16 4.88071 14.8807 6 13.5 6Z" stroke="#0B0D23" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
//                                 </svg> */}
//                             <AsyncSelect
//                                 placeholder='Lead Source'
//                                 // isDisabled={!selectedUniversityId}
//                                 // key={selectedUniversityId}
//                                 name={'source'}
//                                 defaultValue={watch('source')}
//                                 isClearable
//                                 defaultOptions
//                                 loadOptions={fetchSources}
//                                 getOptionLabel={(e) => e.name}
//                                 getOptionValue={(e) => e.id}
//                                 onChange={handleSourseChange}
//                             />
//                             {/* </div> */}
//                             {errors.source && <span className='form-validation'>{errors.source.message}</span>}


//                         </div>



//                         {
//                             watch('source')?.name == 'Referral' &&
//                             // grid grid-cols-1 md:grid-cols-2 gap-4
//                             <div className='form_group'>

//                                 {/* <div className='form_group frm-sel-icon-stl'> */}

//                                 {/* <svg className='sel-icon' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                         <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="black" strokeWidth="1.5" />
//                                         <path d="M10 8.484C10.5 7.494 11 7 12 7C13.246 7 14 7.989 14 8.978C14 9.967 13.5 10.461 12 11.451V13M12 16.5V17" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
//                                     </svg> */}
//                                 <SelectX
//                                     placeholder='Referred Student'
//                                     menuPlacement='top'
//                                     loadOptions={fetchStudents}
//                                     control={control}
//                                     // error={errors?.assigned_to?.id ? errors?.assigned_to?.message : false}
//                                     // error2={errors?.assigned_to?.message ? errors?.assigned_to?.message : false}
//                                     name={'student'}
//                                     defaultValue={watch('student')}
//                                 />
//                                 {/* {errors.preffered_course && <span className='form-validation'>{errors.preffered_course.message}</span>} */}

//                                 {/* </div> */}
//                             </div>
//                         }


//                         {
//                             watch('source')?.name == 'Agency' &&
//                             <div className='form_group'>
//                                 <SelectX
//                                     placeholder='Referred Agency'
//                                     menuPlacement='top'
//                                     loadOptions={fetchAgencies}
//                                     control={control}
//                                     // error={errors?.assigned_to?.id ? errors?.assigned_to?.message : false}
//                                     // error2={errors?.assigned_to?.message ? errors?.assigned_to?.message : false}
//                                     name={'agency'}
//                                     defaultValue={watch('agency')}
//                                 />
//                                 {/* {errors.preffered_course && <span className='form-validation'>{errors.preffered_course.message}</span>} */}
//                             </div>
//                         }



//                         <div className='form_group'>
//                             <ReactSelector
//                                 placeholder='Refrence From'
//                                 menuPlacement='auto'
//                                 onInputChange={fetchReference}
//                                 styles={{ menu: provided => ({ ...provided, zIndex: 9999 }) }}
//                                 options={referenceOption}
//                                 getOptionLabel={option => option.name}
//                                 getOptionValue={option => option.name}
//                                 value={
//                                     referenceOption.filter(options =>
//                                         options?.name == watch('reference')
//                                     )
//                                 }
//                                 name='reference'
//                                 isClearable
//                                 defaultValue={(watch('reference'))}
//                                 onChange={(selectedOption) => setValue('reference', selectedOption?.name || '')}
//                             />
//                             {errors.reference && <span className='form-validation'>{errors.reference.message}</span>}

//                         </div>





//                         <div className='form_group frm-text-conn-stl '>

//                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                 <path d="M12 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V12M9 15V12.5L17.75 3.75C18.4404 3.05964 19.5596 3.05964 20.25 3.75V3.75C20.9404 4.44036 20.9404 5.55964 20.25 6.25L15.5 11L11.5 15H9Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
//                             </svg>
//                             <textarea placeholder='Note' multiline rows={2} fullWidth control={control}  {...register('note')}
//                                 value={watch('note') || ''} />
//                         </div>


//                         <Grid p={1} pb={3}  >
//                             <Button onClick={handleClose} className='cancel-btn'>Cancel <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
//                                 <path d="M7.875 13.5H19.125M19.125 13.5L14.625 9M19.125 13.5L14.625 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
//                             </svg></Button>
//                             <LoadingButton loading={loading} disabled={loading} type='submit' className='save-btn'>Save <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                 <path d="M9 9L11.9999 11.9999M11.9999 11.9999L14.9999 14.9999M11.9999 11.9999L9 14.9999M11.9999 11.9999L14.9999 9M4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4801 4 18.9079 4.21799C19.2842 4.40973 19.5905 4.71547 19.7822 5.0918C20.0002 5.51962 20.0002 6.07967 20.0002 7.19978V16.7998C20.0002 17.9199 20.0002 18.48 19.7822 18.9078C19.5905 19.2841 19.2842 19.5905 18.9079 19.7822C18.4805 20 17.9215 20 16.8036 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
//                             </svg></LoadingButton>
//                         </Grid>
//                     </form>
//             }


//         </div >
//     )
// }

// export default Detail
