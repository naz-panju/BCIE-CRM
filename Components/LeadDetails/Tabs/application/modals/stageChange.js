import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, Grid, IconButton, Skeleton, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Close, Refresh } from '@mui/icons-material';
import { ListingApi } from '@/data/Endpoints/Listing';
import SelectX from '@/Form/SelectX';
import { useState } from 'react';
import AsyncSelect from "react-select/async";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab';
import LoadingEdit from '@/Components/Common/Loading/LoadingEdit';
import toast from 'react-hot-toast';
import { LeadApi } from '@/data/Endpoints/Lead';
import ReactSelector from 'react-select';
import { ApplicationApi } from '@/data/Endpoints/Application';


const scheme = yup.object().shape({
    // first_name: yup.string().required("First Name is Required"),
    // email: yup.string().required("Email is Required"),
    // phone: yup.string().required("Phone Number is Required"),
    // dob: yup.string().required("Date Of Birth is Required"),
    // zip: yup.string().required("Zip Code is Required"),
    // country: yup.object().required("Please Choose a Country").typeError("Please choose a Country"),
    // state: yup.string().required("State is Required"),
})

export default function ApplicationStageChangeModal({ details, editId, setEditId, refresh, setRefresh }) {

    // console.log(details);

    const [state, setState] = React.useState({
        right: false,
    });
    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const [dataLoading, setDataLoading] = useState(false)

    const [stages, setstages] = useState([])

    const [subStages, setsubStages] = useState([])

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



    const fetchStages = (e) => {
        return ListingApi.stages({ keyword: e, type: 'application', changable: 1 }).then(response => {
            if (typeof response.data.data !== "undefined") {
                setstages(response.data.data)
                return response.data.data;
            } else {
                return [];
            }
        })
    }

    const onSubmit = async (data) => {
        console.log(data);

        setLoading(true)
        // let dob = ''
        // if (data?.dob) {
        //     dob = moment(data?.dob).format('YYYY-MM-DD')
        // }

        let dataToSubmit = {
            id: details.id,
            stage: data?.stage?.id,
            note: data?.note
            // substage_id: data?.substage?.id,
        }

        if (data?.stage?.sub_stages?.length > 0) {
            dataToSubmit['stage_id'] = data?.subStage?.id
        }

        console.log(dataToSubmit);

        let action;

        if (editId > 0) {
            // dataToSubmit['id'] = editId
            // action = TaskApi.update(dataToSubmit)
            action = ApplicationApi.stageChange(dataToSubmit)
        } else {
            action = ApplicationApi.stageChange(dataToSubmit)
        }

        action.then((response) => {
            // console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                toast.success(response?.data?.message)
                reset()
                handleClose()
                setRefresh(!refresh)
                setLoading(false)
            } else {
                toast.error(response?.response?.data?.message)
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
        setValue('stage', '')
        setValue('subStage', '')
        setsubStages([])
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

    function isSubStage(detailsSubStages) {
        // Iterate over each item in the main array
        for (const item of stages) {
            // Check if details.sub_stages is a sub stage of the current item
            if (item.sub_stages.some(subStage => subStage?.id === detailsSubStages?.id)) {
                console.log(item); // If found, return true
                setValue('stage', item)
                setsubStages(item?.sub_stages)
                setValue('subStage', details?.stage)
            }
        }
        return null; // If not found in any item, return false
    }

    const initialValues = () => {
        console.log(details);
        // isSubStage(details?.stage)
        setValue('stage', details?.stage)
        setValue('note', details?.stage_note)
        // setValue('subStage', details?.substage)

    }

    const handleStageChange = (data) => {
        setValue('stage', data)
        setsubStages(data?.sub_stages)
        if (data?.sub_stages?.includes(watch('subStage'))) {
            setValue('subStage', '')
        } else {

        }
    }

    const getDetails = () => {
        ApplicationApi.view({ id: details?.id }).then((response) => {
            setValue('stage', response?.data?.data?.stage)
            // setValue('note', details?.stage_note)
        })
    }




    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
            initialValues()
            // isSubStage()
        } else if (editId == 0) {
            setOpen(true)
            initialValues()
            // isSubStage()
        }
    }, [editId])


    return (
        <div>
            <Drawer
                anchor={anchor}
                open={open}
                onClose={handleClose}
            >
                <Grid width={550}>
                    <Grid className='modal_title d-flex align-items-center'>

                        <a className='back_modal' onClick={handleClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                                <path d="M21.9582 15.5H9.0415M9.0415 15.5L14.2082 20.6666M9.0415 15.5L14.2082 10.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                            </svg>
                        </a>

                        <a className='back_modal_head'> Change Application Stage </a>

                    </Grid>
                    {/* <hr /> */}
                    <div className='form-data-cntr'>
                        <form onSubmit={handleSubmit(onSubmit)}>

                            {
                                dataLoading ?
                                    <LoadingEdit item={items} />
                                    :
                                    <>

                                        <div class="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                                            <div className='application-input'>
                                                <a className='form-text'>Select Stage</a>
                                                <Grid className='mb-5 forms-data' >
                                                    <AsyncSelect
                                                        // isDisabled={!selectedUniversityId}
                                                        // key={selectedUniversityId}
                                                        // placeholder='Select Stage'
                                                        name={'stage'}
                                                        defaultValue={watch('stage')}
                                                        isClearable
                                                        defaultOptions
                                                        loadOptions={fetchStages}
                                                        getOptionLabel={(e) => e.name}
                                                        getOptionValue={(e) => e.id}
                                                        onChange={handleStageChange}
                                                    />
                                                    {errors.stage && <span className='form-validation'>{errors.stage.message}</span>}

                                                </Grid>
                                            </div>
                                        </div>



                                        {
                                            watch('stage')?.sub_stages?.length > 0 &&

                                            <Grid p={1} container >
                                                <Grid item pr={1} xs={4} md={4}>
                                                    <a className='form-text'>Lead Sub Stage </a>
                                                </Grid>
                                                <Grid item pr={1} xs={8} md={8}>
                                                    <ReactSelector
                                                        onInputChange={subStages}
                                                        styles={{
                                                            menu: provided => ({ ...provided, zIndex: 9999 })
                                                        }}
                                                        options={subStages}
                                                        getOptionLabel={option => option.name}
                                                        getOptionValue={option => option}
                                                        value={
                                                            subStages.find(options =>
                                                                options.name === watch('subStage')
                                                            )
                                                        }
                                                        name='subStage'

                                                        defaultValue={(watch('subStage'))}
                                                        onChange={(selectedOption) => setValue('subStage', selectedOption)}
                                                    />

                                                    {/* <SelectX
                                                        menuPlacement='top'
                                                        loadOptions={fetchSubStages}
                                                        control={control}
                                                        name={'substage'}
                                                        defaultValue={watch('substage')}
                                                    /> */}
                                                    {errors.substage && <span className='form-validation'>{errors.substage.message}</span>}
                                                </Grid>
                                            </Grid>
                                        }

                                        <div class="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                                            <div className='application-input'>
                                                <a className='form-text'>Note</a>
                                                <Grid className='mb-5 forms-data' >
                                                    <TextField
                                                        // placeholder='Note'
                                                        {...register('note')}
                                                        variant="outlined"
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        sx={{ width: '100%', }}
                                                    />
                                                    {errors.note && <span className='form-validation'>{errors.note.message}</span>}
                                                </Grid>
                                            </div>
                                        </div>

                                    </>
                            }

                            <Grid p={1} pb={3} display={'flex'} >
                                <LoadingButton className='save-btn' loading={loading || dataLoading} disabled={loading} type='submit'  >
                                    {
                                        loading ?
                                            <Grid display={'flex'} justifyContent={'center'}><div className="spinner"></div></Grid>
                                            :
                                            <>
                                                Save <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
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
                    </div>
                </Grid>
            </Drawer>
        </div >
    );
}
