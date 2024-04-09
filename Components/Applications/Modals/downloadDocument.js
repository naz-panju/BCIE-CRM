import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect } from 'react';
import { useState } from 'react';
import { Grid, IconButton, Skeleton, Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { CheckCircle, Close, Delete } from '@mui/icons-material';
import { ApplicationApi } from '@/data/Endpoints/Application';


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

export default function DownloadDocumentModal({ editId, setEditId, handleRefresh }) {

    const [open, setOpen] = React.useState(false);
    const [details, setDetails] = useState()
    const [dataLoading, setDataLoading] = useState(false)
    const [documents, setdocuments] = useState([])
    const [selectedDocuments, setselectedDocuments] = useState([])

    const handleSelectDocs = (id) => {
        if (selectedDocuments.includes(id)) {
            // If the ID is already in selectedImages, remove it
            setselectedDocuments(selectedDocuments.filter(imageId => imageId !== id));
        } else {
            // If the ID is not in selectedImages, add it
            setselectedDocuments([...selectedDocuments, id]);
        }
    }

    const handleClose = () => {
        setdocuments([])
        setselectedDocuments([])
        setEditId()
        setOpen(false);
    }




    // const onSubmit = (data) => {
    //     setLoading(true)
    //     console.log(data);
    //     console.log(selectedFile)

    //     const formData = new FormData()

    //     formData.append('document_template_id', data?.template?.id)
    //     formData.append('lead_id', id)
    //     formData.append('title', data?.title)
    //     formData.append('note', data?.remarks || '')
    //     if (selectedFile) {
    //         formData.append('file', selectedFile)
    //     }

    //     let action;

    //     if (editId > 0) {
    //         formData.append('id', editId)
    //         action = LeadApi.updateDocument(formData)
    //     } else {
    //         action = LeadApi.addDocument(formData)
    //     }

    //     action.then((response) => {
    //         console.log(response);
    //         if (response?.data?.data) {
    //             handleClose()
    //             toast.success(editId > 0 ? 'Document has been successfully updated' : 'Document has been successfully added')
    //             handleRefresh()
    //             setLoading(false)
    //         } else {
    //             toast.error(response?.response?.data?.message)
    //             setLoading(false)
    //         }
    //         setLoading(false)
    //     }).catch((error) => {
    //         console.log(error);
    //         toast.error(error?.response?.data?.message)
    //         setLoading(false)
    //     })

    // }


    const getDetails = async () => {
        setDataLoading(true)
        const response = await ApplicationApi.view({ id: editId })
        if (response?.status == 200 || response?.status == 201) {
            setdocuments(response?.data?.data?.documents)
            setDataLoading(false)
        } else {
            // toast.
            setDataLoading(false)
        }
        // console.log(response);
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
                            {editId > 0 ? 'Download Document' : 'Download Document'}
                        </Typography>
                        <IconButton
                            onClick={handleClose}
                        >
                            <Close />
                        </IconButton>
                    </Grid>
                    {
                        dataLoading ?
                        loadingGrid()
                        :
                        documents?.length == 0 ?
                            <Grid>
                                <div className='no-table-ask-block'>
                                    <h4 style={{ color: 'grey' }}>No Document Found</h4>
                                </div>
                            </Grid>
                            :
                            <Grid mt={4} container>
                                {
                                    documents?.map((obj, index) => (

                                        <Grid display={'flex'} justifyContent={'space-between'} alignItems={'center'} key={index} onClick={() => handleSelectDocs(obj?.id)} item md={5.5} mr={1} mt={1} style={{ border: selectedDocuments.includes(obj?.id) ? '1px solid blue' : '1px solid grey', padding: '10px', cursor: 'pointer' }}>
                                            <Grid>
                                                {obj?.title}
                                            </Grid>
                                            {
                                                selectedDocuments?.includes(obj?.id) &&
                                                <Grid>
                                                    <CheckCircle fontSize='small' sx={{ color: 'blue' }} />
                                                </Grid>
                                            }

                                        </Grid>
                                    ))
                                }
                            </Grid>
                    }
                    {/* {
                        documents?.length == 0 ?
                            <Grid>
                                <div className='no-table-ask-block'>
                                    <h4 style={{ color: 'grey' }}>No Document Found</h4>
                                </div>
                            </Grid>
                            :
                            <Grid mt={4} container>
                                {
                                    documents?.map((obj, index) => (

                                        <Grid display={'flex'} justifyContent={'space-between'} alignItems={'center'} key={index} onClick={() => handleSelectDocs(obj?.id)} item md={5.5} mr={1} style={{ border: selectedDocuments.includes(obj?.id) ? '1px solid blue' : '1px solid grey', padding: '10px', cursor: 'pointer' }}>
                                            <Grid>
                                                {obj?.title}
                                            </Grid>
                                            {
                                                selectedDocuments?.includes(obj?.id) &&
                                                <Grid>
                                                    <CheckCircle fontSize='small' sx={{ color: 'blue' }} />
                                                </Grid>
                                            }

                                        </Grid>
                                    ))
                                }
                            </Grid>
                    } */}


                    <Grid mt={3} display={'flex'} justifyContent={'end'}>
                        <LoadingButton disabled={documents?.length == 0} variant='outlined' sx={{ textTransform: 'none' }}>Download</LoadingButton>
                    </Grid>

                </Box>
            </Modal>
        </div>
    );
}


const loadingGrid = () => {
    return (
        <Grid mt={4} container>
            {[...Array(4)].map((_, index) => (
                <Grid item md={5.5} mr={1} display={'flex'} justifyContent={'space-between'} alignItems={'center'} key={index} >
                   <Skeleton width={'100%'} height={60} />
                </Grid>
            ))}

        </Grid>
    )
}