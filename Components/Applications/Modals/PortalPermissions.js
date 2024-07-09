import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect } from 'react';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Grid, IconButton, TextField, Tooltip, Skeleton, FormControlLabel, Checkbox, Paper } from '@mui/material';
import { Close, ContentCopyOutlined, CopyAllOutlined, DoneOutlined } from '@mui/icons-material';
import { useState } from 'react';
import toast from 'react-hot-toast';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 3,
    pt: 1,
    height:600,
    maxHeigth: 600,
    overflowY: 'auto'
};

export default function PortalPermissionModal({ editId, setEditId, details, setDetails }) {

    // console.log(details);

    let scheme = yup.object().shape({

        // template: yup.object().required("Please Choose a Template").typeError("Please choose a Template"),
    })



    const { register, handleSubmit, watch, formState: { errors }, control, Controller, setValue, getValues, reset, trigger } = useForm({ resolver: yupResolver(scheme) })

    const [open, setOpen] = React.useState(false);


    const handleClose = () => {
        setDetails()
        setEditId()
        setOpen(false);
    }

    const [nameCopied, setNameCopied] = useState(false);
    const [passCopied, setPassCopied] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000); // Hide the message after 3 seconds
    };

    const copyToClipboard = (text, from) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success('Copied')
            // setcopied(text)
            // if (from == 'name') {
            //     setNameCopied(true)
            // } else if (from == 'pass') {
            //     setPassCopied(true)
            // } else if (from == 'link') {
            //     setLinkCopied(true)
            // }
            // setTimeout(() => {
            //     setNameCopied(false)
            //     setPassCopied(false)
            //     setLinkCopied(false)
            // }, 2000);
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    };

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
            // BackdropProps={{
            //     onClick: null, // Prevent closing when clicking outside
            // }}
            >
                <Box sx={style}>
                    <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Portal Permissions
                        </Typography>
                        <IconButton
                            onClick={handleClose}
                        >
                            <Close />
                        </IconButton>
                    </Grid>

                    <Grid mb={1} mt={2} container spacing={1} >
                        <Grid pl={1}><a style={{ fontSize: '14px' }}>User Name</a></Grid>
                        <Grid item p={1} xs={12}>
                            <Paper elevation={3} sx={{ p: 1 }}>
                                <Grid display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                    <a style={{ fontSize: '14px' }} >{details?.university?.portal_username || 'NA'}</a>
                                    {
                                        nameCopied ?
                                            <span style={{ color: '#689df6', fontSize: '13px' }}>copied <DoneOutlined sx={{ color: '#689df6', cursor: 'pointer' }} fontSize='small' /></span>
                                            :
                                            <ContentCopyOutlined onClick={() => copyToClipboard(details?.university?.portal_username, 'name')} fontSize='small' sx={{ color: '#689df6', cursor: 'pointer' }} />
                                    }
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Grid mb={1} mt={2} container spacing={1} >
                        <Grid pl={1}><a style={{ fontSize: '14px' }}>Password</a></Grid>
                        <Grid item p={1} xs={12}>
                            <Paper elevation={3} sx={{ p: 1 }}>
                                <Grid display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                    <a style={{ fontSize: '14px' }} >{details?.university?.portal_password || 'NA'}</a>
                                    {
                                        passCopied ?
                                            <span style={{ color: '#689df6', fontSize: '13px' }}>copied <DoneOutlined sx={{ color: '#689df6', cursor: 'pointer' }} fontSize='small' /></span>
                                            :
                                            <ContentCopyOutlined onClick={() => copyToClipboard(details?.university?.portal_password, 'pass')} fontSize='small' sx={{ color: '#689df6', cursor: 'pointer' }} />
                                    }
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Grid mb={1} mt={2} container spacing={1} >
                        <Grid pl={1}><a style={{ fontSize: '14px' }}>Portal Link</a></Grid>
                        <Grid item p={1} xs={12}>
                            <Paper elevation={3} sx={{ p: 1 }}>
                                <Grid display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                    <a href={details?.university?.portal_link} target='_blank' style={{ fontSize: '14px', color: details?.university?.portal_link ? 'blue' : '', cursor: 'pointer' }} className={details?.university?.portal_link ? 'a_hover' : ''}> {details?.university?.portal_link || 'NA'}</a>
                                    {
                                        linkCopied ?
                                            <span style={{ color: '#689df6', fontSize: '13px' }}>copied <DoneOutlined sx={{ color: '#689df6', cursor: 'pointer' }} fontSize='small' /></span>
                                            :
                                            <ContentCopyOutlined onClick={() => copyToClipboard(details?.university?.portal_link, 'link')} fontSize='small' sx={{ color: '#689df6', cursor: 'pointer' }} />
                                    }
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* 2 */}

                   
                        <Grid mb={1} mt={2} container spacing={1} >
                            <Grid pl={1}><a style={{ fontSize: '14px' }}>User Name 2</a></Grid>
                            <Grid item p={1} xs={12}>
                                <Paper elevation={3} sx={{ p: 1 }}>
                                    <Grid display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                        <a style={{ fontSize: '14px' }} >{details?.university?.portal2_username || 'NA'}</a>
                                        {
                                            nameCopied ?
                                                <span style={{ color: '#689df6', fontSize: '13px' }}>copied <DoneOutlined sx={{ color: '#689df6', cursor: 'pointer' }} fontSize='small' /></span>
                                                :
                                                <ContentCopyOutlined onClick={() => copyToClipboard(details?.university?.portal2_username, 'name')} fontSize='small' sx={{ color: '#689df6', cursor: 'pointer' }} />
                                        }
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    

                    
                        <Grid mb={1} mt={2} container spacing={1} >
                            <Grid pl={1}><a style={{ fontSize: '14px' }}>Password 2</a></Grid>
                            <Grid item p={1} xs={12}>
                                <Paper elevation={3} sx={{ p: 1 }}>
                                    <Grid display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                        <a style={{ fontSize: '14px' }} >{details?.university?.portal2_password || 'NA'}</a>
                                        {
                                            passCopied ?
                                                <span style={{ color: '#689df6', fontSize: '13px' }}>copied <DoneOutlined sx={{ color: '#689df6', cursor: 'pointer' }} fontSize='small' /></span>
                                                :
                                                <ContentCopyOutlined onClick={() => copyToClipboard(details?.university?.portal2_password, 'pass')} fontSize='small' sx={{ color: '#689df6', cursor: 'pointer' }} />
                                        }
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    
                        <Grid mb={1} mt={2} container spacing={1} >
                            <Grid pl={1}><a style={{ fontSize: '14px' }}>Portal Link 2</a></Grid>
                            <Grid item p={1} xs={12}>
                                <Paper elevation={3} sx={{ p: 1 }}>
                                    <Grid display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                        <a href={details?.university?.portal2_link} target='_blank' style={{ fontSize: '14px', color: details?.university?.portal2_link ? 'blue' : '', cursor: 'pointer' }} className={details?.university?.portal2_link ? 'a_hover' : ''}> {details?.university?.portal2_link || 'NA'}</a>
                                        {
                                            linkCopied ?
                                                <span style={{ color: '#689df6', fontSize: '13px' }}>copied <DoneOutlined sx={{ color: '#689df6', cursor: 'pointer' }} fontSize='small' /></span>
                                                :
                                                <ContentCopyOutlined onClick={() => copyToClipboard(details?.university?.portal2_link, 'link')} fontSize='small' sx={{ color: '#689df6', cursor: 'pointer' }} />
                                        }
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    

                    {/* 3 */}

                   
                        <Grid mb={1} mt={2} container spacing={1} >
                            <Grid pl={1}><a style={{ fontSize: '14px' }}>User Name 3</a></Grid>
                            <Grid item p={1} xs={12}>
                                <Paper elevation={3} sx={{ p: 1 }}>
                                    <Grid display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                        <a style={{ fontSize: '14px' }} >{details?.university?.portal3_username || 'NA'}</a>
                                        {
                                            nameCopied ?
                                                <span style={{ color: '#689df6', fontSize: '13px' }}>copied <DoneOutlined sx={{ color: '#689df6', cursor: 'pointer' }} fontSize='small' /></span>
                                                :
                                                <ContentCopyOutlined onClick={() => copyToClipboard(details?.university?.portal2_username, 'name')} fontSize='small' sx={{ color: '#689df6', cursor: 'pointer' }} />
                                        }
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    

                        <Grid mb={1} mt={2} container spacing={1} >
                            <Grid pl={1}><a style={{ fontSize: '14px' }}>Password 3</a></Grid>
                            <Grid item p={1} xs={12}>
                                <Paper elevation={3} sx={{ p: 1 }}>
                                    <Grid display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                        <a style={{ fontSize: '14px' }} >{details?.university?.portal3_password || 'NA'}</a>
                                        {
                                            passCopied ?
                                                <span style={{ color: '#689df6', fontSize: '13px' }}>copied <DoneOutlined sx={{ color: '#689df6', cursor: 'pointer' }} fontSize='small' /></span>
                                                :
                                                <ContentCopyOutlined onClick={() => copyToClipboard(details?.university?.portal3_password, 'pass')} fontSize='small' sx={{ color: '#689df6', cursor: 'pointer' }} />
                                        }
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    


                    <Grid mb={1} mt={2} container spacing={1} >
                        <Grid pl={1}><a style={{ fontSize: '14px' }}>Portal Link 3</a></Grid>
                        <Grid item p={1} xs={12}>
                            <Paper elevation={3} sx={{ p: 1 }}>
                                <Grid display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                    <a href={details?.university?.portal3_link} target='_blank' style={{ fontSize: '14px', color: details?.university?.portal3_link ? 'blue' : '', cursor: 'pointer' }} className={details?.university?.portal3_link ? 'a_hover' : ''}> {details?.university?.portal3_link || 'NA'}</a>
                                    {
                                        linkCopied ?
                                            <span style={{ color: '#689df6', fontSize: '13px' }}>copied <DoneOutlined sx={{ color: '#689df6', cursor: 'pointer' }} fontSize='small' /></span>
                                            :
                                            <ContentCopyOutlined onClick={() => copyToClipboard(details?.university?.portal3_link, 'link')} fontSize='small' sx={{ color: '#689df6', cursor: 'pointer' }} />
                                    }
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>


                </Box>
            </Modal >
        </div >
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