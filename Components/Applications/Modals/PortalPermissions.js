import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect } from 'react';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Grid, IconButton, TextField, Tooltip, Skeleton, FormControlLabel, Checkbox, Paper } from '@mui/material';
import { Close } from '@mui/icons-material';

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
    maxHeigth: 600,
    overflowY: 'auto'
};

export default function PortalPermissionModal({ editId, setEditId, details, setDetails }) {


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
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Grid mb={1} mt={2} container spacing={1} >
                        <Grid pl={1}><a style={{ fontSize: '14px' }}>Portal Link</a></Grid>
                        <Grid item p={1} xs={12}>
                            <Paper elevation={3} sx={{ p: 1 }}>
                                <Grid display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                    <a href={details?.university?.portal_link} target='_blank' style={{ fontSize: '14px', color: details?.university?.portal_link ? 'blue' : '', cursor: 'pointer' }} className={details?.university?.portal_link ? 'a_hover' : '' }> { details?.university?.portal_link || 'NA'}</a>

                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* <Grid mb={1}  container spacing={1} justifyContent="center">
                        <Grid item p={1} xs={11.5}>
                            <Paper elevation={3} sx={{ p: 1 }}>
                                <Grid  display={'flex'} justifyContent={'space-between'} alignItems={'center'} sx={{ mt: index !== 0 ? 1 : '' }}>
                                    <a style={{ fontSize: '14px' }} target='_blank' href={obj?.file} key={index} >{trimUrlAndNumbers(obj?.title || obj?.document_template?.name)}</a>
                                    <Grid display={'flex'} alignItems={'center'}>
                                        <Tooltip title={'Preview'}><a target='_blank' href={obj?.file}><Visibility fontSize='small' sx={{ color: '#689df6' }} /></a></Tooltip>

                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid> */}


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