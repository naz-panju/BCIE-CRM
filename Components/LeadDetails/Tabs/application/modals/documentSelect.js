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

export default function DocumentSelectModal({ editId, setEditId, SelectedDocuments, setSelectedDocuments, setSelectedAttachments, from, SelectedAttachments, sendMessage }) {

    // console.log(editId);


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
    const [uniDocuments, setuniDocuments] = useState([])
    const getDetails = () => {
        setDataLoading(true)
        ApplicationApi.view({ id: editId }).then((response) => {
            console.log(response);
            // const mergedArray = response?.data?.data?.documents.concat(response?.data?.data?.university_documents);
            setuniDocuments(response?.data?.data?.university_documents)
            setDocuments(response?.data?.data?.documents)
            setDataLoading(false)
        }).catch((error) => {
            setDataLoading(false)
        })
    }

    // console.log(Documents);
    const getLeadDetails = async () => {
        setDataLoading(true)
        try {
            const response = await LeadApi.listDocuments({ lead_id: editId, limit: 100 })
            const uniResponse = await ListingApi.uniDocuments({ lead_id: editId, limit: 100 })
            console.log(uniResponse);
            const datas = response?.data?.data?.filter((obj => obj?.status !== 'Requested'))
            setDocuments(datas)
            setuniDocuments(uniResponse?.data?.data)
            setDataLoading(false)
        } catch (error) {

        }
        // LeadApi.listDocuments({ lead_id: editId, limit: 100 }).then((response) => {
        //     console.log(response);
        //     const datas = response?.data?.data?.filter((obj => obj?.status !== 'Requested'))
        //     setDocuments(datas)
        //     setDataLoading(false)
        // }).catch((error) => {
        //     setDataLoading(false)
        // })
    }

    const isDocumentChecked = (value) => documentSelected.includes(value);

    const callBack = () => {
        handleClose()
        setattachLoading(false)
    }

    const [attachLoading, setattachLoading] = useState(false)

    const handleAttach = () => {

        if (sendMessage) {
            // setSelectedDocuments(documentSelected)
            // setSelectedAttachments(file)
            setattachLoading(true)
            sendMessage(null, callBack, documentSelected, file, setattachLoading)
        } else {
            setSelectedDocuments(documentSelected)
            setSelectedAttachments(file)
            handleClose()
        }
    }

    useEffect(() => {
        if (editId > 0) {
            setOpen(true)
            if (Documents?.length == 0) {
                if (from == 'app') {
                    getDetails()
                } else if (from == 'lead') {
                    getLeadDetails()
                }
            }
        } else if (editId == 0) {
            setOpen(true)
        }
        setdocumentSelected(SelectedDocuments)
        setFile(SelectedAttachments || [])
    }, [editId, open])

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
                            {/* Add  Documents */}
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
                                <div><span style={{ fontWeight: 'bold', fontSize: '16px' }}>Student Documents</span></div>
                                <Grid>
                                    {
                                        Documents?.length > 0 ?
                                            <FormGroup style={{}}>
                                                <Grid container sx={{ display: 'flex', }}>
                                                    {
                                                        Documents?.map((obj, index) => (
                                                            obj &&
                                                            <Grid key={index} mb={2} item xs={12} sm={6}>
                                                                <FormControlLabel control={<Checkbox onChange={() => handleDocumentSelect(obj)} value={obj} checked={isDocumentChecked(obj)} />} label={obj?.document_template?.name} />
                                                            </Grid>

                                                        ))
                                                    }
                                                </Grid>
                                            </FormGroup>
                                            :
                                            <Grid height={100} display={'flex'} alignItems={'center'} justifyContent={'center'}> <a>No Student Document Found</a></Grid>
                                    }


                                </Grid>

                                <div className='mb-3'><span style={{ fontWeight: 'bold', fontSize: '16px' }}>University Documents</span></div>

                                {
                                    from == 'lead' ?
                                        uniDocuments?.length > 0 ?
                                            uniDocuments?.map((obj, index) => (
                                                <div key={index}>
                                                    <div><span style={{ fontWeight: 'bold', fontSize: '13px', color: 'grey' }}>{obj?.university}</span></div>
                                                    <Grid>

                                                        <FormGroup style={{}}>
                                                            <Grid container sx={{ display: 'flex', }}>
                                                                {
                                                                    obj?.documents?.map((document, docIndex) => (
                                                                        obj &&
                                                                        <Grid key={docIndex} mb={2} item xs={12} sm={6}>
                                                                            <FormControlLabel control={<Checkbox onChange={() => handleDocumentSelect(document)} value={document} checked={isDocumentChecked(document)} />} label={document?.document_template?.name} />
                                                                        </Grid>

                                                                    ))
                                                                }
                                                            </Grid>
                                                        </FormGroup>



                                                    </Grid>
                                                </div>
                                            ))
                                            :
                                            <Grid height={100} display={'flex'} alignItems={'center'} justifyContent={'center'}> <a>No University Document Found</a></Grid>

                                        :

                                        uniDocuments?.length > 0 ?
                                            <FormGroup style={{}}>
                                                <Grid container sx={{ display: 'flex', }}>
                                                    {
                                                        uniDocuments?.map((obj, index) => (
                                                            obj &&
                                                            <Grid key={index} mb={2} item xs={12} sm={6}>
                                                                <FormControlLabel control={<Checkbox onChange={() => handleDocumentSelect(obj)} value={obj} checked={isDocumentChecked(obj)} />} label={obj?.document_template?.name} />
                                                            </Grid>

                                                        ))
                                                    }
                                                </Grid>
                                            </FormGroup>
                                            :
                                            <Grid height={100} display={'flex'} alignItems={'center'} justifyContent={'center'}> <a>No University Document Found</a></Grid>

                                }

                                <Grid display={'flex'} container item xs={12}>
                                    <Grid item xs={12} md={12}>
                                        <label htmlFor="file-input">
                                            <input
                                                type="file"
                                                id="file-input"
                                                style={{ display: 'none' }}
                                                onChange={handleFileChange}
                                                key={fileInputKey}
                                                accept=".doc,.docx,.xls,.xlsx,.pdf,image/*"
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
                                        {
                                            attachLoading ?
                                                <div
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        border: '3px solid white',
                                                        borderTop: '3px solid transparent',
                                                        borderRadius: '50%',
                                                        animation: 'spin 1s linear infinite'
                                                    }}
                                                />
                                                :
                                                "Send"
                                        }

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