
import TextInput from '@/Form/TextInput'
import { Button, Grid, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import 'react-phone-input-2/lib/style.css'
import PhoneInput from 'react-phone-input-2'
import toast from 'react-hot-toast'
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab'
import LoadingEdit from '@/Components/Common/Loading/LoadingEdit'

import axios from 'axios'
import { EventRegistrationApi } from '@/data/Endpoints/EventRegistration'

const scheme = yup.object().shape({
    name: yup.string().required("Name is Required"),
    email: yup.string().email("Invalid email format").required("Email is Required"),
    // phone: yup.string().required('Phone Number is Required'),
})


function EventForm({ data }) {

    // console.log(data);

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })

    const [eventId, setEventId] = useState(data?.id)
    const [loading, setLoading] = useState(false)
    const [dataLoading, setDataLoading] = useState(false)
    const [code, setcode] = useState()


    const handlePhoneNumber = (value, country) => {
        if (!value) {
            setValue('phone', '')
            return;
        }
        else {
            setValue('phone', value)
            setcode(country?.dialCode)
            return;
        }
    };



    const onSubmit = async (data) => {

        setLoading(true)

        let dataToSubmit = {
            event_id: eventId,
            name: data?.name,
            email: data?.email,
            phone_number: data?.phone,
        }


        EventRegistrationApi.add(dataToSubmit).then((response) => {
            // console.log(response);
            if (response?.data?.data) {
                toast.success('Registered Successfully')
                setValue('phone', `+${code}`)
                reset()
                setLoading(false)
            } else {
                toast.error(response?.response?.data?.message)
                setLoading(false)
            }
        }).catch((error) => {
            console.log(error);
            toast.error(error?.response?.data?.message)
            setLoading(false)
        })

    }

    return (
        <Grid mt={5} mb={5} display={'flex'} alignItems={'center'} flexDirection={'column'} justifyContent={'center'} >

            <Typography>{data?.name}</Typography>
            <form style={{ width: 600 }} onSubmit={handleSubmit(onSubmit)}>
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

                <Grid p={1} pb={3} display={'flex'} justifyContent={'end'}>
                    <LoadingButton loading={loading} disabled={loading} size='small' type='submit' sx={{ textTransform: 'none', height: 30 }} variant='contained'>Save</LoadingButton>
                </Grid>
            </form>

        </Grid >
    )
}

export default EventForm

// export async function getStaticPaths() {
//     const list = await ModalitiesApi.list();
//     // Extract slugs from the data (replace 'slugField' with the actual field containing slugs)
//     const paths = list?.data?.data?.map((item) => ({
//       params: { slug: item?.slug },
//     })) || [];

//     // console.log(paths);
//     return { paths, fallback: 'blocking' };
//   }

//   export async function getStaticProps(context) {
//     console.log(context);
//     try {
//     //   const megaMenu = await MenuApi.megaMenu();
//           return {
//         props: {
//         },
//         revalidate: 10,
//       };
//     } catch (error) {
//       console.error('Error', error);

//       return {
//         props: {
//           header: null, // or handle the error in a way that makes sense for your application
//         },
//         revalidate: 10,
//         notFound: true
//       };
//     }
//   }

export async function getServerSideProps(context) {
    try {
        const formCheck = await axios.get(process.env.NEXT_PUBLIC_API_PATH + `events/form/${context?.query?.slug}`)
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
                notFound: true

            };
        }
    } catch (error) {
        console.error('Error', error);

        return {
            props: {
                data: null, // or handle the error in a way that makes sense for your application
            },
            notFound: true
        };
    }
}


