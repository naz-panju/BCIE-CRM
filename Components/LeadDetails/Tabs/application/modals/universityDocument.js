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
import { Grid, IconButton, TextField, Tooltip, Skeleton, FormControlLabel, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Close, Delete } from '@mui/icons-material';
import { ListingApi } from '@/data/Endpoints/Listing';
import { LeadApi } from '@/data/Endpoints/Lead';
import toast from 'react-hot-toast';
import TextInput from '@/Form/TextInput';
import AsyncSelect from "react-select/async";
import { ApplicationApi } from '@/data/Endpoints/Application';
import DateInput from '@/Form/DateInput';
import moment from 'moment';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

export default function UniversityDocumentModal({ app_id, setapp_id, editId, setEditId, handleRefresh, fetchTable, details }) {

    // console.log(app_id);

    const [template, settemplate] = useState()

    let scheme = yup.object().shape({

        template: yup.object().required("Please Choose a Template").typeError("Please choose a Template"),
    })

    if (template?.stage?.action_type == 'Deposit Paid') {
        scheme = yup.object().shape({
            // template: yup.object().required("Please Choose a Template").typeError("Please choose a Template"),
            paid_date: yup.string().required("Please select Date").typeError("Please select Date"),
            amount: yup.string().required("Please enter Amount").typeError("Please enter Amount"),
        })
    }
    // if (template?.stage?.action_type == 'Get Application Id') {
    //     scheme = yup.object().shape({
    //         application_id: yup.string().required("Please enter Application Id").typeError("Please enter Application Id"),
    //     })
    // }

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const [loading, setLoading] = useState(false)
    const [reqLoading, setReqLoading] = useState(false)
    // const [details, setDetails] = useState()
    const [dataLoading, setDataLoading] = useState(false)

    const handleClose = () => {
        settemplate()
        setapp_id()
        setValue('template', '')
        setValue('application_id', '')
        setValue('amount', '')
        setValue('paid_date', '')
        setSelectedFile(null)
        // setDetails()
        setChangeStage(true)
        setEditId()
        setOpen(false);
    }

    const [selectedFile, setSelectedFile] = useState(null);
    const [fileInputKey, setFileInputKey] = useState(0);


    const handleFileChange = (event) => {
        setFileInputKey(prevKey => prevKey + 1);
        setSelectedFile(event.target.files[0]);
    };


    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setSelectedFile(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDelete = () => {
        setSelectedFile(null); // Clear selected file
    };

    const fetchTemplates = (e) => {
        return ListingApi.documentTemplate({ keyword: e, type: 'university' }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data;
            } else {
                return [];
            }
        })
    }

    const onSubmit = (data) => {
        // console.log(selectedFile);
        if (!selectedFile) {
            toast.error('Please select a File')
        } else {
            setLoading(true)
            // console.log(data);

            const formData = new FormData()

            // application:id
            formData.append('id', app_id)
            formData.append('document_template_id', data?.template?.id)
            if (selectedFile) {
                formData.append('document', selectedFile)
            }

            if (changeStage) {
                formData.append('stage', data?.template?.stage?.id)
            }

            // if (data?.template?.stage?.action_type == 'Get Application Id') {
                formData.append('application_number', data?.application_id)
            // }

            if (data?.template?.stage?.action_type == 'Deposit Paid') {
                let date = ''
                if (data?.paid_date) {
                    date = moment(data?.paid_date).format('YYYY-MM-DD')
                }
                formData.append('deposit_paid_on', date)
                formData.append('deposit_amount', data?.amount)
            }

            // for (const [key, value] of formData.entries()) {
            //     console.log(`${key}: ${value}`);
            // }

            let action;

            if (editId > 0) {
                // formData.append('id', editId)
                action = ApplicationApi.uploadUniversityDocument(formData)
            } else {
                action = ApplicationApi.uploadUniversityDocument(formData)
            }

            action.then((response) => {
                // console.log(response);
                if (response?.status == 200 || response?.status == 201) {
                    handleClose()
                    toast.success(response?.data?.message)
                    handleRefresh()
                    if (fetchTable) {
                        fetchTable()
                    }
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

    const handleTemplateSelect = (e) => {
        settemplate(e || '')
        setValue('template', e || '');
    }

    function trimUrlAndNumbers(url) {
        const lastSlashIndex = url?.lastIndexOf('/');
        let trimmedString = url?.substring(lastSlashIndex + 1);
        trimmedString = trimmedString?.replace(/[0-9]/g, ''); // Replace all numeric characters with an empty string
        return trimmedString?.replace(/_/g, ''); // Replace all underscores with an empty string
    }

    const [changeStage, setChangeStage] = useState(true);
    const handleCheckboxChange = (event) => {
        setChangeStage(event.target.checked);
    };

    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
        } else if (editId == 0) {
            setOpen(true)
            setValue('application_id', details?.application_number || '')
        }
    }, [editId])


    return (
        <div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                BackdropProps={{
                    onClick: null, // Prevent closing when clicking outside
                }}
            >
                <Box sx={style}>
                    <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {editId > 0 ? 'Edit University Document' : 'Add University Document'}
                        </Typography>
                        <IconButton
                            onClick={handleClose}
                        >
                            <Close />
                        </IconButton>
                    </Grid>

                    {
                        dataLoading ?
                            loadingFields()
                            :
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Grid container>
                                    <Grid pr={1} mt={2} md={12}>
                                        <a>Select Template</a>
                                        <AsyncSelect
                                            key={watch('template')}
                                            name={'template'}
                                            defaultValue={watch('template')}
                                            isClearable
                                            defaultOptions
                                            loadOptions={fetchTemplates}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                            onChange={handleTemplateSelect}
                                        />
                                        {errors.template && <span className='form-validation'>{errors.template.message}</span>}

                                    </Grid>
                                </Grid>

                                <Grid container>
                                    <Grid pr={1} mt={2} md={12}>
                                        <a>UNI ID</a>
                                        <TextInput control={control} name="application_id"
                                            value={watch('application_id')} />
                                        {errors.application_id && <span className='form-validation'>{errors.application_id.message}</span>}

                                    </Grid>
                                </Grid>

                                <Grid container>
                                    <Grid pr={1} mt={2} md={12}>
                                        <FormControlLabel
                                            control={<Checkbox checked={changeStage} onChange={handleCheckboxChange} />}
                                            label="Change Stage"
                                        />

                                    </Grid>
                                </Grid>

                                {
                                    watch('template')?.stage?.action_type == "Deposit Paid" &&
                                    <Grid container>
                                        <Grid pr={1} mt={2} md={6}>
                                            <a>Deposit Amount</a>
                                            <TextInput type={'number'} control={control} name="amount"
                                                value={watch('amount')} />
                                            {errors.amount && <span className='form-validation'>{errors.amount.message}</span>}
                                        </Grid>
                                        <Grid pr={1} mt={2} md={6}>
                                            <a>Deposit Paid Date</a>
                                            <DateInput
                                                control={control}
                                                name="paid_date"
                                                value={watch('paid_date')}
                                            />
                                            {errors.paid_date && <span className='form-validation'>{errors.paid_date.message}</span>}
                                        </Grid>
                                    </Grid>
                                }

                                <div
                                    className="flex flex-col items-center justify-center mt-4 border-dashed border-2 border-gray-400 p-4 "
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                >
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="file-upload"
                                        key={fileInputKey}
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Select File or Drag and Drop Here
                                    </label>
                                    {(selectedFile || details?.file) && (
                                        <Grid display={'flex'} justifyContent={'space-between'} className="mt-4">
                                            <Grid mr={1}>
                                                {
                                                    selectedFile &&
                                                    <Tooltip title={selectedFile?.name}>
                                                        <p className="text-gray-700">
                                                            {
                                                                selectedFile?.name?.length > 20
                                                                    ? selectedFile?.name?.slice(0, 20) + '....'
                                                                    : selectedFile?.name
                                                            }
                                                        </p>
                                                    </Tooltip>
                                                }
                                                {
                                                    !selectedFile &&
                                                    <Tooltip title={details?.file}>
                                                        <p className="text-gray-700">
                                                            {trimUrlAndNumbers(details?.file)}
                                                        </p>
                                                    </Tooltip>
                                                }
                                            </Grid>
                                            {
                                                selectedFile &&
                                                <Grid>
                                                    <Delete sx={{ cursor: 'pointer' }} color='error' fontSize='small' onClick={handleDelete} />
                                                </Grid>
                                            }
                                        </Grid>
                                    )}
                                </div>
                                <Grid mt={2} display={'flex'} justifyContent={'end'}>

                                    <LoadingButton
                                        type='submit'
                                        variant='contained'
                                        // disabled={loading || reqLoading || dataLoading}
                                        loading={loading}
                                        size='small'
                                        sx={{ textTransform: 'none', height: 30 }}
                                    // className="mt-2 bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Upload
                                    </LoadingButton>
                                </Grid>
                            </form>
                    }

                </Box>
            </Modal>
        </div>
    );
}


const loadingFields = () => {
    return (
        <Grid>
            <Grid container>
                <Grid pr={1} mt={2} md={12}>
                    <a>Select Template</a>
                    <Skeleton variant="rounded" width={'100%'} height={40} />
                </Grid>

            </Grid>

            <Grid mt={2}>
                <Skeleton variant="rounded" width={'100%'} height={100} />
            </Grid>
        </Grid>
    )
}