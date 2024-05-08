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
        return ListingApi.stages({ keyword: e,type:'application' }).then(response => {
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
        isSubStage(details?.stage)
        // setValue('stage', details?.stage)
        // setValue('subStage', details?.substage)
        console.log(details);
    }

    const handleStageChange = (data) => {
        setValue('stage', data)
        setsubStages(data?.sub_stages)
        if (data?.sub_stages?.includes(watch('subStage'))) {
            setValue('subStage', '')
        } else {

        }
    }



    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
        } else if (editId == 0) {
            setOpen(true)
        }
    }, [editId])


    return (
        <div>
            <Drawer
                anchor={anchor}
                open={open}
                onClose={handleDrawerClose}
            >
                <Grid width={550}>
                    <Grid p={1} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <a style={{ fontWeight: 500, fontSize: '19px' }}>Change Stage</a>
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
                                            <Grid item pr={1} xs={4} md={4}>
                                                <a className='form-text'>Application Stage </a>
                                            </Grid>
                                            <Grid item pr={1} xs={8} md={8}>
                                                <AsyncSelect
                                                    // isDisabled={!selectedUniversityId}
                                                    // key={selectedUniversityId}
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
                                        </Grid>

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