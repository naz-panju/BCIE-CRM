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
import { Grid, IconButton, TextField, Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Close, Delete } from '@mui/icons-material';
import { ListingApi } from '@/data/Endpoints/Listing';
import { LeadApi } from '@/data/Endpoints/Lead';
import toast from 'react-hot-toast';
import TextInput from '@/Form/TextInput';
import AsyncSelect from "react-select/async";
import DynamicChip from '@/utils/DynamicChip';

const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

export default function AssignLeadModal({ selected, setSelected, editId, setEditId, handleRefresh,handlePopClose }) {
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

    const handleClose = () => {
        setValue('counsellor', '')
        setEditId()
        setOpen(false);
    }


    const fetchCounsellor = (e) => {
        return ListingApi.users({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data;
            } else {
                return [];
            }
        })
    }

    const onSubmit = () => {
        setLoading(true)

        if (selectedoption == 2 && !watch('counsellor')) {
            toast.error('Please Select a Counsellor')
        } else {
            let dataToSubmit = {
                user_id: watch('counsellor')?.id,
                leads: selected
            }

            // console.log(dataToSubmit);

            let action;

            if (editId > 0) {
                // formData.append('id', editId)
                // action = LeadApi.updateDocument(formData)
            } else {
                action = LeadApi.bulkAssign(dataToSubmit)
            }

            action.then((response) => {
                // console.log(response);
                if (response?.status == 200 || response?.status == 201) {
                    toast.success(response?.data?.message)
                    handleClose()
                    setSelected([])
                    handlePopClose()
                    // handleRefresh()
                    setLoading(false)
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


    const handleCouncsellorChange = (e) => {
        setValue('counsellor', e || '');
    }

    const Options = [
        { id: 1, name: 'Round Robin' },
        { id: 2, name: 'Counsellor' },
    ]

    const handleOptionChange = (name) => {
        // console.log(id);
        setseletctedoption(name);
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

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Assign
                        </Typography>
                        <IconButton
                            onClick={handleClose}
                        >
                            <Close />
                        </IconButton>
                    </Grid>

                    <Grid mt={2}>
                        {Options.map(obj => {
                            return <DynamicChip color='primary' key={obj.id} name={obj.name} id={obj.id} active={selectedoption} onChipCLick={handleOptionChange} />
                        })}
                    </Grid>

                    {
                        selectedoption == 2 &&
                        <Grid container>
                            <Grid mt={2} mb={2} md={12}>
                                <AsyncSelect
                                    placeholder='Select Counsellor'
                                    name={'counsellor'}
                                    defaultValue={watch('counsellor')}
                                    isClearable
                                    defaultOptions
                                    loadOptions={fetchCounsellor}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    onChange={handleCouncsellorChange}
                                />
                                {errors.counsellor && <span className='form-validation'>{errors.counsellor.message}</span>}

                            </Grid>
                        </Grid>
                    }


                    <Grid mt={2} display={'flex'} justifyContent={'end'}>

                        <Button
                            variant='outlined'
                            size='small'
                            sx={{ textTransform: 'none', height: 30, mr: 2 }}
                        >
                            Cancel
                        </Button>
                        <LoadingButton
                            type='submit'
                            onClick={onSubmit}
                            variant='contained'
                            disabled={loading || !selectedoption}
                            loading={loading}
                            size='small'
                            sx={{ textTransform: 'none', height: 30 }}
                        // className="mt-2 bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Submit
                        </LoadingButton>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
}
