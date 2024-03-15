import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, IconButton, Skeleton, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Close, Refresh } from '@mui/icons-material';
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


const scheme = yup.object().shape({
    country: yup.object().required("Please Choose a Country").typeError("Please choose a Country"),
    university: yup.object().required("Please Choose an University").typeError("Please choose an University"),
    course: yup.object().required("Please Choose a Course").typeError("Please choose a Course"),
    intake: yup.object().required("Please Choose an Intake").typeError("Please choose an Intake"),

})

export default function LeadApplicationModal({ lead_id, editId, setEditId, handleRefresh }) {
    const [state, setState] = React.useState({
        right: false,
    });
    const [selectedPriority, setSelectedPriority] = useState('Medium');
    const [open, setOpen] = useState(false)

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

    const [selectedCountryID, setselectedCountryID] = useState()
    const [selectedUniversityId, setselectedUniversityId] = useState()
    const [coursePopup, setcoursePopup] = useState(false)

    const fetchCounty = (e) => {
        return ListingApi.country({ keyword: e }).then(response => {
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
        return ListingApi.courses({ keyword: e, university: selectedUniversityId }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
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


    const onSubmit = async (data) => {
        // console.log(data);

        setLoading(true)

        let dataToSubmit = {
            lead_id: lead_id,
            country_id: data?.country?.id,
            university_id: data?.university?.id,
            course_id: data?.course?.id,
            intake_id: data?.intake?.id,
            remarks: data.remarks,
        }


        // console.log(dataToSubmit);

        let action;

        if (editId > 0) {
            // dataToSubmit['id'] = editId
            // action = TaskApi.update(dataToSubmit)
        } else {
            action = ApplicationApi.add(dataToSubmit)
        }

        action.then((response) => {
            // console.log(response);
            if (response?.statusText == 'Created') {
                toast.success('Applied Successfully')
                reset()
                handleClose()
                handleRefresh()
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
        setselectedCountryID()
        setselectedUniversityId()
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

    const initialValues = () => {
        // setValue('email', details?.email)
        // setValue('phone', `${details?.phone_country_code}${details?.phone_number}`)
    }

    const handleCountryChange = (data) => {
        setValue('country', data || '')
        setselectedUniversityId()
        setValue('university', '')
        setValue('course', '')
        setValue('intake', '')
    }

    const handleUniversityChange = (data) => {
        setValue('university', data || '')
        setValue('course', '')
        setValue('intake', '')
    }

    const handleCourseChange = (data) => {
        setValue('course', data || '')
    }
    const handleinTakeChange = (data) => {
        setValue('intake', data || '')

    }

    const handleCoursePopup = () => {
        setcoursePopup(!coursePopup)
    }

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
                <Grid width={650}>
                    <Grid p={1} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <a style={{ fontWeight: 500, fontSize: '19px' }}>Apply</a>
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
                                            <Grid item pr={1} display={'flex'} alignItems={'center'} xs={4} md={4}>
                                                <a className='form-text'>Country</a>
                                            </Grid>

                                            <Grid item pr={1} xs={8} md={8}>
                                                <AsyncSelect
                                                    name='country'
                                                    defaultValue={watch('country')}
                                                    // isClearable
                                                    defaultOptions
                                                    loadOptions={fetchCounty}
                                                    getOptionLabel={(e) => e.name}
                                                    getOptionValue={(e) => e.id}
                                                    onChange={handleCountryChange}
                                                />
                                                {/* <SelectX
                                                    loadOptions={fetchCounty}
                                                    control={control}
                                                    name={'country'}
                                                    defaultValue={watch('country')}
                                                /> */}
                                                {errors.country && <span className='form-validation'>{errors.country.message}</span>}

                                            </Grid>

                                        </Grid>



                                        <Grid p={1} container >
                                            <Grid item pr={1} display={'flex'} alignItems={'center'} xs={4} md={4}>
                                                <a className='form-text'>University</a>
                                            </Grid>

                                            <Grid item pr={1} xs={8} md={8}>
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
                                        </Grid>

                                        <Grid p={1} container >
                                            <Grid item pr={1} display={'flex'} alignItems={'center'} xs={4} md={4}>
                                                <a className='form-text'>Course</a>
                                            </Grid>

                                            <Grid item pr={1} xs={8} md={8}>

                                                <AsyncSelect
                                                    isDisabled={!selectedUniversityId}
                                                    key={selectedUniversityId}
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
                                        </Grid>

                                        <Grid p={1} container  >
                                            <Grid item pr={1} display={'flex'} alignItems={'center'} xs={4} md={4}>

                                            </Grid>

                                            <Grid item display={'flex'} justifyContent={'end'} pr={1} xs={8} md={8}>
                                                <Button onClick={handleCoursePopup} size='small' className='bg-sky-300 text-white h-6 text-xs hover:bg-sky-500 text-white' variant='contained'>{coursePopup ? 'Cancel' : 'Add Course'}</Button>
                                            </Grid>
                                        </Grid>

                                        <Grid className={`border border-sky-100 bg-sky-50 course-popup ${coursePopup ? 'show' : ''}`}>
                                            <Grid p={1} container >
                                                <Grid item pr={1} display={'flex'} alignItems={'center'} xs={4} md={4}>
                                                    <a className='form-text'>Add Course Level</a>
                                                </Grid>

                                                <Grid item pr={1} xs={8} md={8}>
                                                    <TextInput control={control} name="add_course_level"
                                                        value={watch('add_course_level')} />
                                                </Grid>
                                            </Grid>
                                            <Grid p={1} container >
                                                <Grid item pr={1} display={'flex'} alignItems={'center'} xs={4} md={4}>
                                                    <a className='form-text'>Add Course</a>
                                                </Grid>

                                                <Grid item pr={1} xs={8} md={8}>
                                                    <TextInput control={control} name="add_course"
                                                        value={watch('add_course')} />
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid p={1} container >
                                            <Grid item pr={1} display={'flex'} alignItems={'center'} xs={4} md={4}>
                                                <a className='form-text'>Intake</a>
                                            </Grid>

                                            <Grid item pr={1} xs={8} md={8}>
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
                                        </Grid>

                                        <Grid p={1} container >
                                            <Grid item pr={1} xs={4} md={4}>
                                                <a className='form-text'> Remarks </a>
                                            </Grid>

                                            <Grid item pr={1} xs={8} md={8}>
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
