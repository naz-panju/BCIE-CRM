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
import { Grid, IconButton, TextField, Tooltip, Skeleton, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { AttachFile, Close, Delete } from '@mui/icons-material';
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
    width: 600,
    maxHeight: 600,
    overflowY: 'auto',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
}

export default function DocumentSelectModal({ editId, setEditId, SelectedDocuments, setSelectedDocuments, setSelectedAttachments,from }) {


    let scheme = yup.object().shape({
        // template: yup.object().required("Please Choose a Template").typeError("Please choose a Template"),
    })


    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const [loading, setLoading] = useState(false)
    const [reqLoading, setReqLoading] = useState(false)
    // const [details, setDetails] = useState()
    const [dataLoading, setDataLoading] = useState(false)

    const handleClose = () => {
        setdocumentSelected([])
        setSelectedFile(null)
        setEditId()
        setOpen(false);
    }

    const [selectedFile, setSelectedFile] = useState(null);
    const [fileInputKey, setFileInputKey] = useState(0);


    // single
    // const handleFileChange = (event) => {
    //     setFileInputKey(prevKey => prevKey + 1);
    //     setSelectedFile(event.target.files[0]);
    // };

    const [file, setFile] = useState([])
    const handleFileChange = (e) => {
        const newFile = e?.target?.files[0];
        setFileInputKey(prevKey => prevKey + 1)
        setFile([...file, newFile]); // Add the new file to the state
    };

    const handleDeleteAttachment = (index) => {
        const updatedAttachments = [...file];
        updatedAttachments.splice(index, 1);
        setFile(updatedAttachments);
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

            if (data?.template?.stage?.id) {
                formData.append('stage', data?.template?.stage?.id)
            }

            if (data?.template?.stage?.action_type == 'Get Application Id') {
                formData.append('application_number', data?.application_id)
            }

            if (data?.template?.stage?.action_type == 'Deposit Paid') {
                let date = ''
                if (data?.paid_date) {
                    date = moment(data?.paid_date).format('YYYY-MM-DD')
                }
                formData.append('deposit_paid_on', date)
                formData.append('deposit_amount', data?.amount)
            }

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

    function trimUrlAndNumbers(url) {
        const lastSlashIndex = url?.lastIndexOf('/');
        let trimmedString = url?.substring(lastSlashIndex + 1);
        trimmedString = trimmedString?.replace(/[0-9]/g, ''); // Replace all numeric characters with an empty string
        return trimmedString?.replace(/_/g, ''); // Replace all underscores with an empty string
    }

    const [documentSelected, setdocumentSelected] = useState(SelectedDocuments)
    const handleDocumentSelect = (doc) => {
        const isSelected = documentSelected.includes(doc);

        if (isSelected) {
            // If the template is already selected, remove it from the array
            setdocumentSelected(documentSelected.filter(value => value !== doc));
        } else {
            // If the template is not selected, add it to the array
            setdocumentSelected([...documentSelected, doc]);
        }
    }

    const [Documents, setDocuments] = useState([])
    const getDetails = () => {
    
        setDataLoading(true)
        ApplicationApi.view({ id: editId }).then((response) => {
            // console.log(response);
            console.log(response?.data?.data)
            setDocuments([...response?.data?.data?.documents,...response?.data?.data?.university_documents])
            setDataLoading(false)
        }).catch((error) => {
            setDataLoading(false)
        })
    }
    const getLeadDetails = () => {
        setDataLoading(true)
        LeadApi.listDocuments({ lead_id: editId ,limit:60}).then((response) => {
            setDocuments(response?.data?.data)
            console.log(response?.data?.data)
            setDataLoading(false)
        }).catch((error) => {
            setDataLoading(false)
        })
    }


    const isDocumentChecked = (value) => documentSelected.includes(value);

    const handleAttach = () => {
        setSelectedDocuments(documentSelected)
        setSelectedAttachments(file)
        handleClose()
    }

    

    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
            if (Documents?.length == 0) {
                if(from=='app'){
                    console.log('here');
                    getDetails()
                }else if(from=='lead'){
                    getLeadDetails()
                }
            }
        } else if (editId == 0) {
            setOpen(true)
        }
        setdocumentSelected(SelectedDocuments)
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
                            Add Student Documents
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
                            <div>
                                <Grid>
                                    {
                                        Documents?.length > 0 ?
                                            <FormGroup style={{}}>
                                                <Grid container sx={{ display: 'flex', }}>
                                                    {
                                                        Documents?.map((obj, index) => (
                                                            obj?.file &&
                                                            <Grid key={index} mb={2} item xs={12} sm={6}>
                                                                <FormControlLabel control={<Checkbox onChange={() => handleDocumentSelect(obj)} value={obj} checked={isDocumentChecked(obj)} />} label={obj?.document_template?.name} />
                                                            </Grid>

                                                        ))
                                                    }
                                                </Grid>
                                            </FormGroup>
                                            :
                                           <Grid height={100} display={'flex'} alignItems={'center'} justifyContent={'center'}> <a>No Document Found</a></Grid>
                                    }


                                </Grid>

                                <Grid display={'flex'} container item xs={12}>
                                    <Grid item xs={12} md={12}>
                                        <label htmlFor="file-input">
                                            <input
                                                type="file"
                                                id="file-input"
                                                style={{ display: 'none' }}
                                                onChange={handleFileChange}
                                                key={fileInputKey}
                                            />
                                            <Button sx={{ textTransform: 'none', }}
                                                variant='contained'
                                                className='bg-sky-800' size='small' component="span">
                                                Upload<AttachFile />
                                            </Button>
                                        </label>
                                    </Grid>
                                    {
                                        file?.length > 0 &&
                                        <Grid mt={2} item xs={12} md={12}>
                                            {file?.map((obj, index) => (
                                                <Grid display={'flex'} justifyContent={'space-between'} key={index} sx={{ pl: 1, mt: 0.5 }} item xs={12}>
                                                    <a style={{ color: 'black', fontSize: '14px' }}>{obj?.name}</a>
                                                    <a style={{ cursor: 'pointer' }} onClick={() => handleDeleteAttachment(index)}>
                                                        {/* You can use any icon for delete, for example, a delete icon */}
                                                        <Delete fontSize='small' style={{ color: 'red' }} />
                                                    </a>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    }
                                </Grid>

                                {/* drag and drop single file */}
                                {/* <div
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
                                    {(selectedFile) && (
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

                                            </Grid>
                                            {
                                                selectedFile &&
                                                <Grid>
                                                    <Delete sx={{ cursor: 'pointer' }} color='error' fontSize='small' onClick={handleDelete} />
                                                </Grid>
                                            }
                                        </Grid>
                                    )}
                                </div> */}
                                <Grid mt={2} display={'flex'} justifyContent={'end'}>

                                    <Button
                                        onClick={handleAttach}
                                        type='submit'
                                        variant='contained'
                                        size='small'
                                        sx={{ textTransform: 'none', height: 30 }}
                                    // className="mt-2 bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Attach
                                    </Button>
                                </Grid>
                            </div>
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
                {
                    [...Array(4)].map((_, index) => (
                        <Grid mt={1} mb={2} key={index} item xs={12} sm={6}>
                            <Skeleton variant='rounded' height={20} width={150} />
                        </Grid>
                    ))
                }

            </Grid>

            <Grid mt={2}>
                <Skeleton variant="rounded" width={'100%'} height={100} />
            </Grid>
        </Grid>
    )
}