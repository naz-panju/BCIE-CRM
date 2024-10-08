import * as React from 'react';

import { useEffect } from 'react';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from 'react';
import { Grid, IconButton, TextField, Tooltip, Skeleton, Drawer } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Close, Delete } from '@mui/icons-material';
import { ListingApi } from '@/data/Endpoints/Listing';
import { LeadApi } from '@/data/Endpoints/Lead';
import toast from 'react-hot-toast';
import Doc from '@/img/doc.png';
import Image from 'next/image';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

export default function LeadRequestUploadDocumentModal({ lead_id, editId, setEditId, handleRefresh, from, app_id, datas, setdocumentSelected }) {
    const scheme = yup.object().shape({

        // template: yup.object().required("Please Choose a Template").typeError("Please choose a Template"),
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
        setSelectedFile(null)
        setDetails()
        setEditId()
        setOpen(false);
    }

    const [selectedFile, setSelectedFile] = useState(null);
    const [fileInputKey, setFileInputKey] = useState(0);


    const handleFileChange = (event) => {
        setFileInputKey(prevKey => prevKey + 1);

        const file = event.target.files[0]
        const maxSize = watch('template')?.max_upload_size || size
        console.log(maxSize)
        if (file?.size > maxSize * 1024 * 1024) {
            toast.error(`File size exceeds ${maxSize}MB`)
        } else {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        // Handle file upload logic here
        // console.log("Selected File:", selectedFile);
        // You can send the file to the server using fetch or any other method
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        const maxSize = watch('template')?.max_upload_size || size
        console.log(maxSize)
        if (file?.size > maxSize * 1024 * 1024) {
            toast.error(`File size exceeds ${maxSize}MB`)
        } else {
            setSelectedFile(file);
        }
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

        formData.append('document_template_id', datas?.document_template?.id)
        formData.append('document_id', editId)
        // if (from == 'app') {
        //     formData.append('application_id', app_id)
        // }
        if (selectedFile) {
            formData.append('file', selectedFile)
        }

        let action;

        if (editId > 0) {
            formData.append('id', editId)
            action = LeadApi.uploadDocument(formData)
        }
        // else {
        //     action = LeadApi.addDocument(formData)
        // }

        action.then((response) => {
            // console.log(response);
            if (response?.status == 200 || response?.status == 201) {
                setdocumentSelected(response?.data?.data)
                handleClose()
                toast.success(editId > 0 ? 'Document has been successfully uploaded' : 'Document has been successfully uploaded')
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
                lead_id: lead_id,
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

    const anchor = 'right'; // Set anchor to 'right'

    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
            // getDetails()
        } else if (editId == 0) {
            setOpen(true)
        }
    }, [editId])

    const [size, setsize] = useState()
    useEffect(() => {
        const session = sessionStorage.getItem('size')
        if (session) {
            setsize(session)
        }
    }, [])


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

                        <a className='back_modal_head'>Upload Document</a>

                    </Grid>

                    <hr />
                    <div className='form-data-cntr'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* <Grid container>
                                    <Grid pr={1} mt={2} md={6}>
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
                                </Grid> */}


                            <div
                                // className="flex flex-col items-center justify-center mt-4 border-dashed border-2 border-gray-400 p-4 "
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
                                <label htmlFor="file-upload" style={{ cursor: 'pointer' }} className='add-document-block'>
                                    <Image src={Doc} alt='Doc' width={200} height={200} />

                                    <h3><span>Select File</span>  or Drag and Drop Here</h3>
                                    <h4>Max {datas?.document_template?.max_upload_size || size} MB files are allowed</h4>
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
                                    className='save-btn'
                                    type='submit'
                                    variant='contained'
                                    disabled={loading || reqLoading || dataLoading}
                                    loading={loading}
                                    size='small'
                                    sx={{ textTransform: 'none', height: 30 }}
                                // className="mt-2 bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    {
                                        loading ?
                                            <Grid display={'flex'} justifyContent={'center'}><div className="spinner"></div></Grid>
                                            :
                                            <>
                                                Upload
                                            </>
                                    }
                                </LoadingButton>
                            </Grid>
                        </form>
                    </div>



                </Grid>
            </Drawer>
        </div>
    );
}


const loadingFields = () => {
    return (
        <Grid>

            <Grid display={'flex'} justifyContent={'space-between'} className="mt-4">
                <Grid mr={1}>
                    <Skeleton variant="rounded" width={'100%'} height={60} />
                </Grid>
            </Grid>



        </Grid>
    )
}