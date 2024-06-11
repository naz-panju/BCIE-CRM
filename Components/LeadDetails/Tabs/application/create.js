import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, IconButton, Skeleton, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Close, KeyboardArrowDownOutlined, KeyboardArrowUpOutlined, Refresh } from '@mui/icons-material';
import { ListingApi } from '@/data/Endpoints/Listing';
import { useState } from 'react';

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab';
import LoadingEdit from '@/Components/Common/Loading/LoadingEdit';
import AsyncSelect from "react-select/async";
import { ApplicationApi } from '@/data/Endpoints/Application';
import toast from 'react-hot-toast';
import TextInput from '@/Form/TextInput';
import AddCourse from './addCourse';
import { LeadApi } from '@/data/Endpoints/Lead';


const scheme = yup.object().shape({
    country: yup.object().required("Please Choose a Country").typeError("Please choose a Country"),
    university: yup.object().required("Please Choose an University").typeError("Please choose an University"),
    course: yup.object().required("Please Choose a Course").typeError("Please choose a Course"),
    intake: yup.object().required("Please Choose an Intake").typeError("Please choose an Intake"),
})

export default function LeadApplicationModal({ lead_id, editId, setEditId, handleRefresh, details }) {
    const [state, setState] = React.useState({
        right: false,
    });
    const [selectedPriority, setSelectedPriority] = useState('Medium');
    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)


    const items = [
        { label: 'Country' },
        { label: 'Course Level' },
        { label: 'University' },
        { label: 'Course' },
        { label: 'Intake' },
        { label: 'Remarks', multi: true },

    ]

    const anchor = 'right'; // Set anchor to 'right'

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })

    const [selectedCountryID, setselectedCountryID] = useState()
    const [selectedUniversityId, setselectedUniversityId] = useState()
    const [coursePopup, setcoursePopup] = useState(false)
    const [dataLoading, setDataLoading] = useState(false)

    const [courseRefresh, setcourseRefresh] = useState()

    const [addId, setAddId] = useState()

    const handleCourseRefresh = () => {
        setcourseRefresh(Math.random())
    }

    const fetchCounty = (e) => {
        return ListingApi.universityCountries({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data;
            } else {
                return [];
            }
        })
    }

    const fetchUniversities = (e) => {
        return ListingApi.universities({ keyword: e, country: selectedCountryID }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data;
            } else {
                return [];
            }
        })
    }
    const fetchCourse = (e) => {
        return ListingApi.subjectAreas({ keyword: e }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
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


    const fetchIntakes = (e) => {
        return ListingApi.intakes({ keyword: e, university_id: selectedUniversityId }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }

    const fetchDocuments = (e) => {
        return LeadApi.listDocuments({ keyword: e, lead_id: lead_id, limit: 50, status: 'Accepted' }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }



    const onSubmit = async (data) => {
        // console.log(data);

        setLoading(true)

        let docs = []
        data?.documents?.map((obj) => {
            docs.push(obj?.id)
        })

        let dataToSubmit = {
            lead_id: lead_id,
            country_id: data?.country?.id,
            university_id: data?.university?.id,
            course_level_id: data?.course_level?.id,
            subject_area_id: data?.course?.id,
            intake_id: data?.intake?.id,
            documents: docs,

            // courses: data?.add_course,
            course: data?.coursetext,

            remarks: data.remarks,
        }
        let action;

        if (editId > 0) {
            dataToSubmit['id'] = editId
            action = ApplicationApi.update(dataToSubmit)
        } else {
            action = ApplicationApi.add(dataToSubmit)
        }

        action.then((response) => {
            console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                toast.success(editId > 0 ? 'Application has been Updated Successfully' : 'Applied Successfully')
                reset()
                handleClose()
                handleRefresh()
                setLoading(false)
            }
            else {
                toast.error(response?.response?.data?.message)

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
        setselectedCountryID()
        setselectedUniversityId()
        setcoursePopup(false)
        setOpen(false)
        setValue('coursetext', '')
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

    const handleCountryChange = (data) => {
        setValue('country', data || '')
        setselectedUniversityId()
        setValue('university', '')
        setValue('course', '')
        setValue('intake', '')
        setValue('coursetext', '')
        setIsExpanded(true)
    }

    const handleUniversityChange = (data) => {
        setValue('university', data || '')
        setValue('intake', '')
    }

    const handleCourseChange = (data) => {
        setValue('course', data || '')
    }
    const handleCourseLevelChange = (data) => {
        setValue('course_level', data || '')
    }
    const handleinTakeChange = (data) => {
        setValue('intake', data || '')

    }


    const handleDocumentChange = (data) => {
        setValue('documents', data || '')

    }

    const handleCoursePopup = () => {
        setAddId(0)
    }



    const getDetails = async () => {
        setDataLoading(true)
        const response = await ApplicationApi.view({ id: editId })
        if (response?.data?.data) {
            let data = response?.data?.data
            console.log(data);

            setValue('country', data?.country)
            setValue('university', data?.university)
            setValue('course_level', data?.course_level)
            setValue('course', data?.subject_area)
            setValue('intake', data?.intake)
            setValue('remarks', data?.remarks)
            setValue('coursetext', data?.course)
            setValue('documents', data?.documents)

        }
        setDataLoading(false)
    }

    const [isExpanded, setIsExpanded] = useState(true);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        if (watch('country')) {
            setselectedCountryID(watch('country')?.id)
        }
        if (watch('university')) {
            setselectedUniversityId(watch('university')?.id || '')
        }
    }, [watch('country'), watch('university')])



    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
            getDetails()
        } else if (editId == 0) {
            setOpen(true)
        }
    }, [editId])

    const customStyles = {
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999, // Ensure the dropdown menu is above other elements
        }),
        control: (base) => ({
            ...base,
            width: '100%', // Ensures the select input width
        }),
    };



    return (
        <div>

            <AddCourse id={lead_id} addId={addId} setAddId={setAddId} handleRefresh={handleCourseRefresh} />
            <Drawer
                anchor={anchor}
                open={open}
                onClose={handleClose}
            >
                <Grid width={600}>
                    <Grid className='modal_title d-flex align-items-center'>
                        <a className='back_modal' onClick={handleClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                                <path d="M21.9582 15.5H9.0415M9.0415 15.5L14.2082 20.6666M9.0415 15.5L14.2082 10.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                            </svg>
                        </a>
                        <a className='back_modal_head'> {editId > 0 ? 'Edit Application' : 'Apply'} </a>
                    </Grid>


                    <div className='form-data-cntr'>

                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-0">
                                <div className='application-input'>
                                    <a className='form-text'>Country</a>
                                    {/* className='form_group */}
                                    <Grid className='mb-5' >
                                        <AsyncSelect

                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                            // styles={{ width: '100%' }}
                                            name='country'
                                            defaultValue={watch('country')}
                                            // isClearable
                                            // classNamePrefix="react-select"
                                            defaultOptions
                                            loadOptions={fetchCounty}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                            onChange={handleCountryChange}

                                        />

                                        {errors.country && <span className='form-validation'>{errors.country.message}</span>}
                                    </Grid>
                                </div>

                                <div className='application-input'>
                                    <a className='form-text'>Course Level</a>
                                    <Grid className='mb-5' >
                                        <AsyncSelect
                                            // isDisabled={!selectedUniversityId}
                                            key={selectedUniversityId}
                                            name={'course_level'}
                                            defaultValue={watch('course_level')}
                                            // isClearable
                                            defaultOptions
                                            loadOptions={fetchCourseLevel}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                            onChange={handleCourseLevelChange}
                                        />
                                        {errors.course_level && <span className='form-validation'>{errors.course_level.message}</span>}
                                    </Grid>
                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-0'>

                                <div className='application-input'>
                                    <a className='form-text'>University</a>
                                    <Grid className='mb-5' >
                                        <AsyncSelect
                                            isDisabled={!selectedCountryID}
                                            key={selectedCountryID}
                                            name={'university'}
                                            defaultValue={watch('university')}
                                            // isClearable
                                            defaultOptions
                                            loadOptions={fetchUniversities}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                            onChange={handleUniversityChange}
                                        />
                                        {errors.university && <span className='form-validation'>{errors.university.message}</span>}
                                    </Grid>
                                </div>


                                <div className='application-input'>
                                    <a className='form-text'>Subject Area</a>
                                    <Grid className='mb-5' >
                                        <AsyncSelect
                                            isDisabled={!selectedCountryID}
                                            key={courseRefresh}
                                            name={'course'}
                                            defaultValue={watch('course')}
                                            // isClearable
                                            defaultOptions
                                            loadOptions={fetchCourse}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                            onChange={handleCourseChange}
                                        />
                                        {errors.course && <span className='form-validation'>{errors.course.message}</span>}
                                    </Grid>
                                </div>
                            </div>

                            <div>
                                <div className='application-input'>
                                    <a className='form-text' > Courses</a>
                                    <Grid className='mb-5' >
                                        <TextInput control={control} name="coursetext"
                                            value={watch('coursetext')} />
                                        {errors.coursetext && <span className='form-validation'>{errors.coursetext.message}</span>}
                                    </Grid>

                                </div>


                                <div className='application-input'>
                                    <a className='form-text'>Intake</a>
                                    <Grid className='mb-5' >
                                        <AsyncSelect
                                            isDisabled={!selectedUniversityId}
                                            key={selectedUniversityId}
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
                                    </Grid>
                                </div>


                                <div className='application-input'>
                                    <a className='form-text'>Documents</a>
                                    <Grid className='mb-5' >
                                        <AsyncSelect
                                            isMulti
                                            name={'documents'}
                                            defaultValue={watch('documents')}
                                            // isClearable
                                            defaultOptions
                                            loadOptions={fetchDocuments}
                                            getOptionLabel={(e) => e.title}
                                            getOptionValue={(e) => e.id}
                                            onChange={handleDocumentChange}
                                        />
                                        {errors.documents && <span className='form-validation'>{errors.documents.message}</span>}
                                    </Grid>
                                </div>


                                <div className='application-input'>
                                    <a className='form-text'> Remarks </a>
                                    <Grid className='mb-5' >
                                        <TextField
                                            {...register('remarks')}
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            rows={2}
                                            sx={{ width: '100%', }}
                                        />
                                        {errors.email && <span className='form-validation'>{errors.email.message}</span>}
                                    </Grid>
                                </div>


                            </div>




                            <Grid pb={3} display={'flex'}>

                                <LoadingButton className='save-btn' loading={loading} disabled={loading || dataLoading} size='small' type='submit' sx={{ textTransform: 'none', height: 30 }} variant='contained'>{
                                    loading ?
                                        <Grid display={'flex'} justifyContent={'center'}><div className="spinner"></div></Grid>
                                        :
                                        <>
                                            Save <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                                                <path d="M7.875 13.5H19.125M19.125 13.5L14.625 9M19.125 13.5L14.625 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </>
                                }</LoadingButton>
                                <Button className='cancel-btn' onClick={handleClose} size='small' sx={{ textTransform: 'none', mr: 2 }} variant='outlined'> Cancel <svg svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 9L11.9999 11.9999M11.9999 11.9999L14.9999 14.9999M11.9999 11.9999L9 14.9999M11.9999 11.9999L14.9999 9M4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4801 4 18.9079 4.21799C19.2842 4.40973 19.5905 4.71547 19.7822 5.0918C20.0002 5.51962 20.0002 6.07967 20.0002 7.19978V16.7998C20.0002 17.9199 20.0002 18.48 19.7822 18.9078C19.5905 19.2841 19.2842 19.5905 18.9079 19.7822C18.4805 20 17.9215 20 16.8036 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                                </svg></Button>

                            </Grid>



                        </form>
                    </div>
                </Grid >
            </Drawer >
        </div >
    );
}
