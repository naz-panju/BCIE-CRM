import * as React from 'react';
import Box from '@mui/material/Box';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect } from 'react';
import { useState } from 'react';
import { Grid, IconButton, Skeleton, Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { CheckCircle, Close, Delete } from '@mui/icons-material';
import { ApplicationApi } from '@/data/Endpoints/Application';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';


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

    const handleSelectDocs = (data) => {
        if (selectedDocuments.includes(data)) {
            // If the ID is already in selectedImages, remove it
            setselectedDocuments(selectedDocuments.filter(imageId => imageId !== data));
        } else {
            // If the ID is not in selectedImages, add it
            setselectedDocuments([...selectedDocuments, data]);
        }
    }

    const handleClose = () => {
        setdocuments([])
        setselectedDocuments([])
        setDetails()
        setEditId()
        setOpen(false);
    }

    const [files, setFiles] = useState(null);
    const [loading, setLoading] = useState(false);

    function getLastExtension(url) {
        // Split the URL by '.' to get an array of parts
        const parts = url.split('.');

        // Extract the last part from the array
        const lastPart = parts[parts.length - 1];

        // Return the last part as the last extension
        return lastPart.toLowerCase(); // Optional: Convert to lowercase
    }


    const getFiles = async () => {
        let downloadables = []
        selectedDocuments?.map((obj) => {
            let fileType = getLastExtension(obj?.file)
            let object = {
                name: obj?.title || obj?.document_template?.name,
                url: obj?.file,
                type: fileType
                // type:obj?.file_type
            }
            downloadables.push(object)
        })

        const res = await fetch("/api/files", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(downloadables)
        });
        const files = await res.json();

        setFiles(files);
    };
    useEffect(() => {
        getFiles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDocuments]);

    const downloadDocument = async () => {
        setLoading(true);
        try {
            const zip = new JSZip();
            const remoteZips = files.map(async (file) => {
                const response = await fetch(file?.url);
                const data = await response.blob();
                zip.file(`${file.name}.${file.type}`, data);
                return data;
            });

            Promise.all(remoteZips)
                .then(() => {
                    zip.generateAsync({ type: "blob" }).then((content) => {
                        // give the zip file a name
                        saveAs(content, `${details?.student?.name}  Application Documents .zip`);
                    });
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });

            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };


    const getDetails = async () => {
        setDataLoading(true)
        const response = await ApplicationApi.view({ id: editId, status: 'Accepted' })
        console.log(response?.data?.data);
        if (response?.status == 200 || response?.status == 201) {
            setDetails(response?.data?.data)
            // setdocuments(response?.data?.data?.documents)
            // const filteredDocuments = response?.data?.data?.documents.filter(document => document?.status === 'Accepted');
            // setdocuments(filteredDocuments);
            // setselectedDocuments(filteredDocuments)

            setdocuments(response?.data?.data?.documents);
            setselectedDocuments(response?.data?.data?.documents)
            setDataLoading(false)
        } else {
            // toast.
            setDataLoading(false)
        }
        // console.log(response);
    }


    // console.log(documents);



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

                                            <Grid display={'flex'} justifyContent={'space-between'} alignItems={'center'} key={index} onClick={() => handleSelectDocs(obj)} item md={5.5} mr={1} mt={1} style={{ border: selectedDocuments.includes(obj) ? '1px solid blue' : '1px solid grey', padding: '10px', cursor: 'pointer' }}>
                                                <Grid>
                                                    {obj?.title || obj?.document_template?.name}
                                                </Grid>
                                                {
                                                    selectedDocuments?.includes(obj) &&
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
                        <LoadingButton loading={loading} onClick={downloadDocument} disabled={documents?.length == 0} variant='outlined' sx={{ textTransform: 'none' }}>Download</LoadingButton>
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