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
import { Grid, IconButton, TextField, Tooltip, Skeleton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Close, Delete } from '@mui/icons-material';
import { ListingApi } from '@/data/Endpoints/Listing';
import { LeadApi } from '@/data/Endpoints/Lead';
import toast from 'react-hot-toast';
import TextInput from '@/Form/TextInput';
import AsyncSelect from "react-select/async";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 750,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

export default function LeadDocumentModal({ id, editId, setEditId, handleRefresh }) {
    const scheme = yup.object().shape({

        template: yup.object().required("Please Choose a Template").typeError("Please choose a Template"),
        // country: yup.object().required("Please Choose a Country").typeError("Please choose a User"),

    })

    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const [loading, setLoading] = useState(false)
    const [reqLoading, setReqLoading] = useState(false)
    const [details, setDetails] = useState()
    const [dataLoading, setDataLoading] = useState(false)

    const handleClose = () => {
        setValue('template', '')
        setValue('title', '')
        setSelectedFile(null)
        setDetails()
        setValue('remarks', '')
        setEditId()
        setOpen(false);
    }

    const [selectedFile, setSelectedFile] = useState(null);
    const [fileInputKey, setFileInputKey] = useState(0);


    const handleFileChange = (event) => {
        setFileInputKey(prevKey => prevKey + 1);
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        // Handle file upload logic here
        console.log("Selected File:", selectedFile);
        // You can send the file to the server using fetch or any other method
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
        return ListingApi.documentTemplate({ keyword: e }).then(response => {
            if (typeof response?.data?.data !== "undefined") {
                return response?.data?.data;
            } else {
                return [];
            }
        })
    }

    const onSubmit = (data) => {
        setLoading(true)
        // console.log(data);
        // console.log(selectedFile)

        const formData = new FormData()

        formData.append('document_template_id', data?.template?.id)
        formData.append('lead_id', id)
        formData.append('title', data?.title)
        formData.append('note', data?.remarks || '')
        if (selectedFile) {
            formData.append('file', selectedFile)
        }

        let action;

        if (editId > 0) {
            formData.append('id', editId)
            action = LeadApi.updateDocument(formData)
        } else {
            action = LeadApi.addDocument(formData)
        }

        action.then((response) => {
            // console.log(response);
            if (response?.data?.data) {
                handleClose()
                toast.success(editId > 0 ? 'Document has been successfully updated' : 'Document has been successfully added')
                handleRefresh()
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

    const requestDocument = () => {
        setReqLoading(true)

        if (watch('template')) {
            let dataToSubmit = {
                lead_id: id,
                document_template_ids: [watch('template')?.id]
            }

            LeadApi.requestDocument(dataToSubmit).then((response) => {
                if (response?.status == 200 || 201) {
                    toast.success(response?.data?.message)
                    handleClose()
                    setReqLoading(false)
                } else {
                    toast.error(response?.response?.data?.message)
                    setReqLoading(false)
                }
            }).catch((error) => {
                console.log(error);
                toast.error(error?.response?.data?.message)
                setReqLoading(false)
            })
        } else {
            toast.error('Please choose a Template')
            setReqLoading(false)
        }

    }

    const handleTemplateSelect = (e) => {
        setValue('template', e || '');
        setValue('title', e?.name || '')
    }

    function trimUrlAndNumbers(url) {
        const lastSlashIndex = url?.lastIndexOf('/');
        let trimmedString = url?.substring(lastSlashIndex + 1);
        trimmedString = trimmedString?.replace(/[0-9]/g, ''); // Replace all numeric characters with an empty string
        return trimmedString?.replace(/_/g, ''); // Replace all underscores with an empty string
    }

    const getDetails = async () => {
        setDataLoading(true)
        const response = await LeadApi.viewDocuments({ id: editId })
        if (response?.data?.data) {
            let data = response?.data?.data
            setDetails(data)
            setValue('template', data?.document_template)
            setValue('title', data?.title)
            setValue('remarks', data?.note || '')
        }
        setDataLoading(false)
    }




    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
            getDetails()
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
                BackdropProps={{
                    onClick: null, // Prevent closing when clicking outside
                }}
            >
                <Box sx={style}>
                    <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {editId > 0 ? 'Edit Document' : 'Add Document'}
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
                                    <Grid pr={1} mt={2} md={6}>
                                        <a>Select Template</a>
                                        {/* <SelectX
                                    required={true}
                                    loadOptions={fetchTemplates}
                                    control={control}
                                    rules={{ required: 'Template is required' }}
                                    name={'template'}
                                    defaultValue={watch('template')}
                                /> */}
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
                                    <Grid mt={2} md={6}>
                                        <a>Title</a>
                                        <TextInput control={control} name="title"
                                            value={watch('title')} />
                                    </Grid>
                                </Grid>
                                <Grid mt={2}>
                                    <a>Remarks</a>
                                    <TextField
                                        {...register('remarks')}
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        sx={{ width: '100%', }}
                                    />
                                </Grid>

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
                                <Grid mt={2} display={'flex'} justifyContent={'space-between'}>
                                    <LoadingButton
                                        variant='contained'
                                        onClick={requestDocument}
                                        loading={reqLoading}
                                        disabled={reqLoading || loading || dataLoading}
                                        size='small'
                                        sx={{ textTransform: 'none', height: 30 }}
                                        className=" bg-sky-500 hover:bg-sky-700 text-white font-bold  rounded"
                                    >
                                        Request Document
                                    </LoadingButton>
                                    <LoadingButton
                                        type='submit'
                                        variant='contained'
                                        disabled={loading || reqLoading || dataLoading}
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
                <Grid pr={1} mt={2} md={6}>
                    <a>Select Template</a>
                    {/* <SelectX
                    required={true}
                    loadOptions={fetchTemplates}
                    control={control}
                    rules={{ required: 'Template is required' }}
                    name={'template'}
                    defaultValue={watch('template')}
                /> */}
                    <Skeleton variant="rounded" width={'100%'} height={40} />
                </Grid>
                <Grid mt={2} md={6}>
                    <a>Title</a>
                    <Skeleton variant="rounded" width={'100%'} height={40} />
                </Grid>
            </Grid>
            <Grid mt={2}>
                <a>Remarks</a>
                <Skeleton variant="rounded" width={'100%'} height={70} />
            </Grid>

            <Grid mt={2}>
                
                <Skeleton variant="rounded" width={'100%'} height={100} />
            </Grid>




            <Grid display={'flex'} justifyContent={'space-between'} className="mt-4">
                <Grid mr={1}>
                    <Skeleton variant="rounded" width={'100%'} height={60} />
                </Grid>
            </Grid>



        </Grid>
    )
}