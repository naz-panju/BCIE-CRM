import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect } from 'react';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from 'react';
import { Drawer, Grid, IconButton, TextField, Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Close, Delete } from '@mui/icons-material';
import { ListingApi } from '@/data/Endpoints/Listing';
import { LeadApi } from '@/data/Endpoints/Lead';
import toast from 'react-hot-toast';
import TextInput from '@/Form/TextInput';
import AsyncSelect from "react-select/async";
import DynamicChip from '@/utils/DynamicChip';
import { useSession } from 'next-auth/react';

const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    // maxHeight: 500,
    // overflowY: 'auto',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};


export default function AssignLeadModal({ selected, setSelected, editId, setEditId, handleRefresh, handlePopClose, setsingle, single, assignToUser, setassignToUser, reAssign, setreAssign, unAssigned }) {
    const scheme = yup.object().shape({

        // template: yup.object().required("Please Choose a Template").typeError("Please choose a Template"),
        // country: yup.object().required("Please Choose a Country").typeError("Please choose a User"),

    })

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const [loading, setLoading] = useState(false)
    const [reqLoading, setReqLoading] = useState(false)

    const [selectedoption, setseletctedoption] = useState()

    const anchor = 'right'; // Set anchor to 'right'

    const session = useSession()


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

    const handleClose = () => {
        setValue('counsellor', '')
        setValue('counsellors', '')
        setValue('branch', '')
        if (handlePopClose) {
            handlePopClose()
        }
        if (setsingle) {
            setsingle(false)
        }
        if (setassignToUser) {
            setassignToUser()
        }
        if (reAssign) {
            setreAssign(false)
        }
        setseletctedoption()
        setSelected([])
        setEditId()
        setbranchId()
        setOpen(false);
    }


    const fetchCounsellor = (e) => {
        if (unAssigned) {
            return ListingApi.unAssignCounsellor({ keyword: e, office_id: branchId  }).then(response => {
                if (typeof response?.data?.data !== "undefined") {
                    return response?.data?.data;
                } else {
                    return [];
                }
            })
        } else {
            return ListingApi.counsellors({ keyword: e, office_id: branchId || assignToUser?.assignedToOffice?.id, }).then(response => {
                if (typeof response?.data?.data !== "undefined") {
                    return response?.data?.data;
                } else {
                    return [];
                }
            })
        }
    }

    const fetchBranches = (e) => {
        if (unAssigned) {
            return ListingApi.unAssignOffice({ keyword: e }).then(response => {
                if (typeof response?.data?.data !== "undefined") {
                    return response?.data?.data;
                } else {
                    return [];
                }
            })
        } else {
            return ListingApi.office({ keyword: e }).then(response => {
                if (typeof response?.data?.data !== "undefined") {
                    return response?.data?.data;
                } else {
                    return [];
                }
            })
        }

    }

    const onSubmit = () => {
        setLoading(true)

        let dataToSubmit;
        if (selectedoption == 1) {
            // console.log(watch('counsellors'));
            if (!watch('counsellors')) {
                toast.error('Please Select Counsellors')
                setLoading(false)
            } else {

                let counsellorIds = []
                watch('counsellors')?.map((obj) => {
                    counsellorIds?.push(obj?.id)
                })

                dataToSubmit = {
                    users: counsellorIds,
                    leads: selected,
                    assign_to_office_id: watch('branch')?.id
                }

                LeadApi.roundRobin(dataToSubmit).then((response) => {
                    // console.log(response);
                    if (response?.status == 200 || response?.status == 201) {
                        toast.success(response?.data?.message)
                        handleClose()
                        setSelected([])
                        if (handlePopClose) {
                            handlePopClose()
                        }
                        setLoading(false)
                        handleRefresh()
                    } else {
                        toast.error(response?.response?.data?.message)
                        setLoading(false)
                    }
                    setLoading(false)
                }).catch((error) => {
                    console.log(error);
                    toast.error(error?.response?.data?.message)
                    setLoading(false)
                })
            }
        }

        if (selectedoption == 2) {
            if (!watch('counsellor')) {
                toast.error('Please Select a Counsellor')
                setLoading(false)
            } else {
                let dataToSubmit = {
                }

                let action;
                if (reAssign || assignToUser?.assignedToCounsellor) {
                    let reSelect=selected?.length>0?selected[0]:selected
                    dataToSubmit = {
                        user_id: watch('counsellor')?.id,
                        lead_id: reSelect,
                        assign_to_office_id: watch('branch')?.id
                    }

                    action = LeadApi.reassign(dataToSubmit)

                } else {
                    dataToSubmit = {
                        user_id: watch('counsellor')?.id,
                        leads: selected,
                        assign_to_office_id: watch('branch')?.id
                    }
                    action = LeadApi.bulkAssign(dataToSubmit)
                }
                // console.log(dataToSubmit)
                action.then((response) => {
                    // console.log(response);
                    if (response?.status == 200 || response?.status == 201) {
                        toast.success(response?.data?.message)
                        handleClose()
                        setSelected([])
                        if (handlePopClose) {
                            handlePopClose()
                        }
                        setLoading(false)
                        handleRefresh()
                    } else {
                        toast.error(response?.response?.data?.message)
                        setLoading(false)
                    }
                    setLoading(false)
                }).catch((error) => {
                    console.log(error);
                    toast.error(error?.response?.data?.message)
                    setLoading(false)
                })
            }
        }
    }


    const handleCouncsellorChange = (e) => {
        setValue('counsellor', e || '');
    }

    const [branchId, setbranchId] = useState()
    const handleBranchChange = (e) => {
        setbranchId(e?.id)
        setValue('branch', e || '');
        setValue('counsellors', '');
        setValue('counsellor', '');
    }

    const handleBulkCouncsellorChange = (e) => {
        setValue('counsellors', e || '');
    }

    let Options;
    if (single) {
        Options = [
            { id: 2, name: 'Counsellor' }
        ];
    } else {
        Options = [
            { id: 1, name: 'Round Robin' },
            { id: 2, name: 'Counsellor' }
        ];
    }

    const handleOptionChange = (name) => {
        // console.log(id);
        setseletctedoption(name);
        setValue('counsellors', '')
        setValue('counsellor', '')
        setValue('branch', '')
    }


    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
            setseletctedoption(2)
            setValue('branch', assignToUser?.assignedToOffice)
            setValue('counsellor', assignToUser?.assignedToCounsellor)
        } else if (editId == 0) {
            setOpen(true)
            if (single) {
                setseletctedoption(2)
            }
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
                                <path d="M21.9582 15.5H9.0415M9.0415 15.5L14.2082 20.6666M9.0415 15.5L14.2082 10.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>

                        <a className='back_modal_head'> Assign </a>

                    </Grid>

                    <div className='form-data-cntr'>

                        <Grid className='mb-5 forms-data  '>
                            {Options.map(obj => {
                                return <DynamicChip color='primary' key={obj.id} name={obj.name} id={obj.id} active={selectedoption} onChipCLick={handleOptionChange} />
                            })}
                        </Grid>
                        {
                            selectedoption &&
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                                <div className='application-input'>
                                    <a className='form-text'>Select Branch</a>
                                    <Grid className='mb-5 forms-data' >
                                        <AsyncSelect
                                            key={selectedoption}
                                            // placeholder='Select Branch'
                                            name={'branch'}
                                            defaultValue={watch('branch')}
                                            isClearable
                                            defaultOptions
                                            loadOptions={fetchBranches}
                                            getOptionLabel={(e) => e?.name}
                                            getOptionValue={(e) => e?.id}
                                            onChange={handleBranchChange}
                                        />
                                        {errors.branch && <span className='form-validation'>{errors.branch.message}</span>}

                                    </Grid>
                                </div>
                            </div>
                        }

                        {
                            (selectedoption == 1 && watch('branch')) &&
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                                <div className='application-input'>
                                    <a className='form-text'>Select Counsellors</a>
                                    <Grid className='mb-5 forms-data'>
                                        <AsyncSelect
                                            isMulti
                                            key={branchId}
                                            // placeholder='Select Counsellors'
                                            name={'counsellors'}
                                            defaultValue={watch('counsellors')}
                                            isClearable
                                            defaultOptions
                                            loadOptions={fetchCounsellor}
                                            getOptionLabel={(e) => e?.name}
                                            getOptionValue={(e) => e?.id}
                                            onChange={handleBulkCouncsellorChange}
                                        />
                                        {errors.counsellors && <span className='form-validation'>{errors.counsellors.message}</span>}
                                    </Grid>
                                </div>
                            </div>
                        }

                        {
                            (selectedoption == 2 && watch('branch')) &&
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 gap-y-0">
                                <div className='application-input'>
                                    <a className='form-text'>Select Counsellor</a>
                                    <Grid className='mb-5 forms-data'>
                                        <AsyncSelect
                                            key={branchId}
                                            name={'counsellor'}
                                            defaultValue={watch('counsellor')}
                                            isClearable
                                            defaultOptions
                                            loadOptions={fetchCounsellor}
                                            getOptionLabel={(e) => e?.name}
                                            getOptionValue={(e) => e?.id}
                                            onChange={handleCouncsellorChange}
                                        />
                                        {errors.counsellor && <span className='form-validation'>{errors.counsellor.message}</span>}

                                    </Grid>
                                </div>
                            </div>
                        }

                        {
                            ((watch('counsellor') || watch('counsellors')?.length > 0)) &&
                            <Grid pb={3}  >

                                <LoadingButton onClick={onSubmit} loading={loading} disabled={loading} type='submit' className='save-btn'>
                                    {
                                        loading ?
                                            <Grid display={'flex'} justifyContent={'center'}><div className="spinner"></div></Grid>
                                            :
                                            <>
                                                Save <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                                                    <path d="M7.875 13.5H19.125M19.125 13.5L14.625 9M19.125 13.5L14.625 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </>
                                    }
                                </LoadingButton>
                                <Button onClick={handleClose} className='cancel-btn'>Cancel <svg svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 9L11.9999 11.9999M11.9999 11.9999L14.9999 14.9999M11.9999 11.9999L9 14.9999M11.9999 11.9999L14.9999 9M4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4801 4 18.9079 4.21799C19.2842 4.40973 19.5905 4.71547 19.7822 5.0918C20.0002 5.51962 20.0002 6.07967 20.0002 7.19978V16.7998C20.0002 17.9199 20.0002 18.48 19.7822 18.9078C19.5905 19.2841 19.2842 19.5905 18.9079 19.7822C18.4805 20 17.9215 20 16.8036 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg></Button>

                            </Grid>
                        }
                    </div>

                </Grid>
            </Drawer>
        </div>
    );
}
