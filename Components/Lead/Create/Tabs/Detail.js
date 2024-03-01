import DateInput from '@/Components/Form/DateInput'
import SelectX from '@/Components/Form/SelectX'
import TextInput from '@/Components/Form/TextInput'
import { ListingApi } from '@/data/Endpoints/Listing'
import { Button, Grid, Typography } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'react-phone-input-2/lib/style.css'
import PhoneInput from 'react-phone-input-2'
import moment from 'moment'
import { LeadApi } from '@/data/Endpoints/Lead'
import toast from 'react-hot-toast'

function Detail({ setOpen,setRefresh,refresh }) {
    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({})

    const [phone, setPhone] = useState()
    const [code, setCode] = useState()
    const [altPhone, setAltPhone] = useState()
    const [altCode, setAltCode] = useState()

    const fetchCounty = (e) => {
        return ListingApi.country({ keyword: e }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }
    const fetchStages = (e) => {
        return ListingApi.stages({ keyword: e }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }
    const fetchSubStages = (e) => {
        return ListingApi.substages({ keyword: e }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }

    const fetchUniversities = (e) => {
        return ListingApi.universities({ keyword: e }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }
    const fetchCourse = (e) => {
        return ListingApi.courses({ keyword: e }).then(response => {
            if (typeof response.data.data !== "undefined") {
                return response.data.data;
            } else {
                return [];
            }
        })
    }
    const fetchUser = (e) => {
        return ListingApi.users({ keyword: e }).then(response => {
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
        setValue('alt_phone', '')
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
            applying_for_country_id: data?.country?.id,
            applying_for_university_id: data?.institute?.id,
            applying_for_course_id: data?.course?.id,
            next_follow_up_date: leadDate,
            stage_id: data?.stage?.id,
            substage_id: data?.sub_stage?.id,

            note: data?.note

        }

        console.log(dataToSubmit);

        try {
            const response = await LeadApi.add(dataToSubmit)
            console.log(response);

            if (response?.data?.data) {
                toast.success('Lead Has Been Successfully Created ')
                setRefresh(!refresh)
                reset()
                setOpen(false)
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.message)

        }
        // "name": "Lead 1",
        // "": "lead1@spiderworks.in",
        // "": "91",
        // "": "9496856556",
        // "": "91",
        // "": "9496856556",
        // "": 1,
        // "": 1,
        // "": 1,
        // "": 1,
        // "": 1,
        // "agency_id": 1,
        // "assigned_to": 1,
        // "": "2024-03-15",
        // "follow_up_assigned_to": 2,
        // "verification_status": "No",
        // "": "Lead 1 note"
    }



    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                    <Grid item md={5}>
                        <Typography sx={{ fontWeight: '500' }}>Email Address</Typography>
                    </Grid>
                    <Grid item md={7}>
                        <TextInput control={control} name="email"
                            value={watch('email')} />
                    </Grid>
                </Grid>

                <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                    <Grid item md={5}>
                        <Typography sx={{ fontWeight: '500' }}>Mobile Number</Typography>
                    </Grid>
                    <Grid item md={7}>
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
                    </Grid>
                </Grid>

                <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                    <Grid item md={5}>
                        <Typography sx={{ fontWeight: '500' }}>Alternate Mobile Number</Typography>
                    </Grid>
                    <Grid item md={7}>
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
                    </Grid>
                </Grid>

                <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                    <Grid item md={5}>
                        <Typography sx={{ fontWeight: '500' }}>Name</Typography>
                    </Grid>
                    <Grid item md={7}>
                        <TextInput control={control} name="name"
                            value={watch('name')} />
                    </Grid>
                </Grid>

                <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                    <Grid item md={5}>
                        <Typography sx={{ fontWeight: '500' }}>Country Applying For</Typography>
                    </Grid>
                    <Grid item md={7}>
                        <SelectX
                            options={fetchCounty}
                            control={control}
                            error={errors?.country?.id ? errors?.country?.id?.message : false}
                            error2={errors?.country?.message ? errors?.country?.message : false}
                            name={'country'}
                            defaultValue={watch('country')}
                        />
                    </Grid>
                </Grid>

                {/* institute */}
                <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                    <Grid item md={5}>
                        <Typography sx={{ fontWeight: '500' }}>Institute Applying For</Typography>
                    </Grid>
                    <Grid item md={7}>
                        <SelectX
                            options={fetchUniversities}
                            control={control}
                            // error={errors?.institute?.id ? errors?.institute?.id?.message : false}
                            // error2={errors?.institute?.message ? errors?.institute?.message : false}
                            name={'institute'}
                            defaultValue={watch('institute')}
                        />
                    </Grid>
                </Grid>

                {/* institute */}
                <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                    <Grid item md={5}>
                        <Typography sx={{ fontWeight: '500' }}>Course Applying For</Typography>
                    </Grid>
                    <Grid item md={7}>
                        <SelectX
                            options={fetchCourse}
                            control={control}
                            // error={errors?.institute?.id ? errors?.institute?.id?.message : false}
                            // error2={errors?.institute?.message ? errors?.institute?.message : false}
                            name={'course'}
                            defaultValue={watch('course')}
                        />
                    </Grid>
                </Grid>

                {/* stage */}
                <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                    <Grid item md={5}>
                        <Typography sx={{ fontWeight: '500' }}>Select Lead Stage</Typography>
                    </Grid>
                    <Grid item md={7}>
                        <SelectX
                            options={fetchStages}
                            control={control}
                            // error={errors?.stage?.id ? errors?.stage?.id?.message : false}
                            // error2={errors?.stage?.message ? errors?.stage?.message : false}
                            name={'stage'}
                            defaultValue={watch('stage')}
                        />
                    </Grid>
                </Grid>

                {/* sub stage */}
                <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                    <Grid item md={5}>
                        <Typography sx={{ fontWeight: '500' }}>Select Lead Sub Stage</Typography>
                    </Grid>
                    <Grid item md={7}>
                        <SelectX
                            options={fetchSubStages}
                            control={control}
                            // error={errors?.sub_stage?.id ? errors?.sub_stage?.message : false}
                            // error2={errors?.sub_stage?.message ? errors?.sub_stage?.message : false}
                            name={'sub_stage'}
                            defaultValue={watch('sub_stage')}
                        />
                    </Grid>
                </Grid>

                {/* assigned to */}
                <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                    <Grid item md={5}>
                        <Typography sx={{ fontWeight: '500' }}>Follow-up Assigned To</Typography>
                    </Grid>
                    <Grid item md={7}>
                        <SelectX
                            options={fetchUser}
                            control={control}
                            // error={errors?.assigned_to?.id ? errors?.assigned_to?.message : false}
                            // error2={errors?.assigned_to?.message ? errors?.assigned_to?.message : false}
                            name={'assigned_to'}
                            defaultValue={watch('assigned_to')}
                        />
                    </Grid>
                </Grid>

                {/* date */}
                <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                    <Grid item md={5}>
                        <Typography sx={{ fontWeight: '500' }}>Set Follow-up Date</Typography>
                    </Grid>
                    <Grid item md={7}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateInput
                                control={control}
                                label='Followup Date'
                                name="date"
                                value={watch('date')}
                            />
                        </LocalizationProvider>

                    </Grid>
                </Grid>

                <Grid display={'flex'} alignItems={'center'} container p={1.5} item xs={12}>
                    <Grid item md={5}>
                        <Typography sx={{ fontWeight: '500' }}>Note</Typography>
                    </Grid>
                    <Grid item md={7}>
                        <TextInput control={control} name="note"
                            value={watch('note')} />
                    </Grid>
                </Grid>

                <Grid p={1} pb={3} display={'flex'} justifyContent={'end'}>
                    <Button sx={{ textTransform: 'none', mr: 2 }} variant='outlined'>Cancel</Button>
                    <Button type='submit' sx={{ textTransform: 'none' }} variant='contained'>Save</Button>
                </Grid>

            </form>
        </div>
    )
}

export default Detail
